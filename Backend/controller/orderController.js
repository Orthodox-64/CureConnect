const Order = require('../models/orderModel');
const Medicine = require('../models/medicineModel');
const Pharmacy = require('../models/pharmacyModel');
const User = require('../models/userModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHander');

// Create new order
exports.createOrder = catchAsyncError(async (req, res, next) => {
    const {
        pharmacyId,
        items,
        shippingAddress,
        paymentInfo,
        deliveryInfo,
        specialInstructions,
        isUrgent
    } = req.body;

    // Verify pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    // Verify all medicines exist and calculate pricing
    let itemsPrice = 0;
    let totalDiscount = 0;
    const orderItems = [];

    for (let item of items) {
        const medicine = await Medicine.findById(item.medicine);
        if (!medicine) {
            return next(new ErrorHandler(`Medicine with ID ${item.medicine} not found`, 404));
        }

        if (medicine.stock < item.quantity) {
            return next(new ErrorHandler(`Insufficient stock for ${medicine.name}`, 400));
        }

        const itemPrice = medicine.price * item.quantity;
        const itemMRP = medicine.mrp * item.quantity;
        const itemDiscount = (medicine.mrp - medicine.price) * item.quantity;

        itemsPrice += itemPrice;
        totalDiscount += itemDiscount;

        orderItems.push({
            medicine: medicine._id,
            quantity: item.quantity,
            price: medicine.price,
            mrp: medicine.mrp,
            discount: medicine.discount
        });

        // Update medicine stock
        await Medicine.findByIdAndUpdate(medicine._id, {
            $inc: { stock: -item.quantity, soldCount: item.quantity }
        });
    }

    // Calculate delivery charge
    const deliveryCharge = deliveryInfo.type === 'pickup' ? 0 : (itemsPrice < 500 ? 50 : 0);
    const totalPrice = itemsPrice + deliveryCharge;

    const orderData = {
        customer: req.user._id,
        pharmacy: pharmacyId,
        items: orderItems,
        shippingAddress,
        paymentInfo,
        deliveryInfo,
        specialInstructions,
        isUrgent,
        pricing: {
            itemsPrice,
            discount: totalDiscount,
            deliveryCharge,
            totalPrice
        },
        statusHistory: [{
            status: 'pending',
            timestamp: new Date(),
            note: 'Order placed successfully'
        }]
    };

    // Handle prescription images if any
    if (req.files && req.files.length > 0) {
        orderData.prescriptionImages = req.files.map(file => ({
            public_id: file.filename,
            url: file.path
        }));
    }

    const order = await Order.create(orderData);
    
    await order.populate('customer', 'name email phone');
    await order.populate('pharmacy', 'name contactInfo');
    await order.populate('items.medicine', 'name images');

    res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order
    });
});

// Get user orders
exports.getMyOrders = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { customer: req.user._id };
    
    if (status && status !== 'all') {
        query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
        .populate('pharmacy', 'name address contactInfo')
        .populate('items.medicine', 'name images')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        orders,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            page: parseInt(page),
            limit: parseInt(limit)
        }
    });
});

// Get pharmacy orders
exports.getPharmacyOrders = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    if (!pharmacy) {
        return next(new ErrorHandler("No pharmacy found for this user", 404));
    }

    const { page = 1, limit = 10, status } = req.query;
    
    let query = { pharmacy: pharmacy._id };
    
    if (status && status !== 'all') {
        query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
        .populate('customer', 'name email phone')
        .populate('items.medicine', 'name images')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        orders,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            page: parseInt(page),
            limit: parseInt(limit)
        }
    });
});

// Get single order details
exports.getOrderById = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('customer', 'name email phone')
        .populate('pharmacy', 'name address contactInfo operatingHours')
        .populate('items.medicine', 'name images manufacturer strength');

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    // Check if user has permission to view this order
    if (req.user.role === 'patient' && order.customer._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Not authorized to view this order", 403));
    }

    if (req.user.role === 'pharmacist') {
        const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
        if (!pharmacy || order.pharmacy._id.toString() !== pharmacy._id.toString()) {
            return next(new ErrorHandler("Not authorized to view this order", 403));
        }
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Update order status (pharmacist only)
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    if (!pharmacy) {
        return next(new ErrorHandler("No pharmacy found for this user", 404));
    }

    const { status, note } = req.body;
    
    const order = await Order.findOne({ 
        _id: req.params.id, 
        pharmacy: pharmacy._id 
    });

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    // Update order status
    order.orderStatus = status;
    order.statusHistory.push({
        status,
        timestamp: new Date(),
        note
    });

    // Set delivered date if status is delivered
    if (status === 'delivered') {
        order.deliveredAt = new Date();
    }

    // Set cancelled date if status is cancelled
    if (status === 'cancelled') {
        order.cancelledAt = new Date();
        order.cancellationReason = note;

        // Return stock to medicines
        for (let item of order.items) {
            await Medicine.findByIdAndUpdate(item.medicine, {
                $inc: { stock: item.quantity, soldCount: -item.quantity }
            });
        }
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order
    });
});

// Cancel order (customer)
exports.cancelOrder = catchAsyncError(async (req, res, next) => {
    const { reason } = req.body;
    
    const order = await Order.findOne({ 
        _id: req.params.id, 
        customer: req.user._id 
    });

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
        return next(new ErrorHandler("Order cannot be cancelled at this stage", 400));
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    order.statusHistory.push({
        status: 'cancelled',
        timestamp: new Date(),
        note: `Cancelled by customer: ${reason}`
    });

    // Return stock to medicines
    for (let item of order.items) {
        await Medicine.findByIdAndUpdate(item.medicine, {
            $inc: { stock: item.quantity, soldCount: -item.quantity }
        });
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order
    });
});

// Rate and review order
exports.rateOrder = catchAsyncError(async (req, res, next) => {
    const { rating, review } = req.body;
    
    const order = await Order.findOne({ 
        _id: req.params.id, 
        customer: req.user._id,
        orderStatus: 'delivered'
    });

    if (!order) {
        return next(new ErrorHandler("Order not found or not delivered", 404));
    }

    if (order.rating) {
        return next(new ErrorHandler("Order already rated", 400));
    }

    order.rating = rating;
    order.review = review;
    order.reviewedAt = new Date();

    await order.save();

    // Update pharmacy rating
    const allOrders = await Order.find({ 
        pharmacy: order.pharmacy,
        rating: { $exists: true }
    });

    const totalRating = allOrders.reduce((sum, ord) => sum + ord.rating, 0);
    const avgRating = totalRating / allOrders.length;

    await Pharmacy.findByIdAndUpdate(order.pharmacy, {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: allOrders.length
    });

    res.status(200).json({
        success: true,
        message: 'Order rated successfully',
        order
    });
});

module.exports = {
    createOrder: exports.createOrder,
    getMyOrders: exports.getMyOrders,
    getPharmacyOrders: exports.getPharmacyOrders,
    getOrderById: exports.getOrderById,
    updateOrderStatus: exports.updateOrderStatus,
    cancelOrder: exports.cancelOrder,
    rateOrder: exports.rateOrder
};
