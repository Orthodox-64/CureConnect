const Pharmacy = require('../models/pharmacyModel');
const Medicine = require('../models/medicineModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHander');
const { uploadSingle } = require('../utils/cloudinary');

// Register new pharmacy
exports.registerPharmacy = catchAsyncError(async (req, res, next) => {
    // Multer (multipart/form-data) provides text fields as strings
    // Safely parse nested objects if they arrive stringified from the client
    const parseIfString = (val, fallback = undefined) => {
        if (val === undefined || val === null) return fallback;
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch {
                return val; // if plain string, keep it
            }
        }
        return val;
    };

    const name = req.body.name;
    const description = req.body.description;
    // Parse nested JSON if provided, else start with empty and merge dot.notation fallbacks
    let address = parseIfString(req.body.address, {});
    let contactInfo = parseIfString(req.body.contactInfo, {});
    const licenseNumber = req.body.licenseNumber;
    const establishedYear = req.body.establishedYear ? Number(req.body.establishedYear) : undefined;
    let operatingHours = parseIfString(req.body.operatingHours, {});
    const deliveryRadius = req.body.deliveryRadius ? Number(req.body.deliveryRadius) : undefined;

    // Merge support for dot.notation payloads like address.street if present
    address = {
        street: address?.street || req.body['address.street'],
        city: address?.city || req.body['address.city'],
        state: address?.state || req.body['address.state'],
        pincode: address?.pincode || req.body['address.pincode'],
        coordinates: address?.coordinates || undefined,
    };

    contactInfo = {
        phone: contactInfo?.phone || req.body['contactInfo.phone'],
        email: contactInfo?.email || req.body['contactInfo.email'],
        whatsapp: contactInfo?.whatsapp || req.body['contactInfo.whatsapp'],
    };

    // Normalize operating hours shape
    operatingHours = {
        weekdays: {
            open: operatingHours?.weekdays?.open || req.body['operatingHours.weekdays.open'],
            close: operatingHours?.weekdays?.close || req.body['operatingHours.weekdays.close'],
        },
        weekends: {
            open: operatingHours?.weekends?.open || req.body['operatingHours.weekends.open'],
            close: operatingHours?.weekends?.close || req.body['operatingHours.weekends.close'],
        }
    };

    // Check if user is already a pharmacist
    const existingPharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (existingPharmacy) {
        return next(new ErrorHandler("You have already registered a pharmacy", 400));
    }

    // Check if license number already exists
    const existingLicense = await Pharmacy.findOne({ licenseNumber });
    if (existingLicense) {
        return next(new ErrorHandler("Pharmacy with this license number already exists", 400));
    }

    const pharmacyData = {
        owner: req.user._id,
        name,
        description,
        address,
        contactInfo,
        licenseNumber,
        establishedYear,
        operatingHours,
        deliveryRadius
    };

    if (req.file) {
        pharmacyData.avatar = {
            public_id: req.file.filename,
            url: req.file.path
        };
    }

    const pharmacy = await Pharmacy.create(pharmacyData);

    // Update user role to pharmacist
    await User.findByIdAndUpdate(req.user._id, { role: 'pharmacist' });

    res.status(201).json({
        success: true,
        message: 'Pharmacy registered successfully',
        pharmacy
    });
});

// Get pharmacy details
exports.getPharmacyDetails = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findById(req.params.id).populate('owner', 'name email');
    
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    res.status(200).json({
        success: true,
        pharmacy
    });
});

// Get my pharmacy (for pharmacist)
exports.getMyPharmacy = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    if (!pharmacy) {
        return next(new ErrorHandler("No pharmacy found for this user", 404));
    }

    res.status(200).json({
        success: true,
        pharmacy
    });
});

// Update pharmacy details
exports.updatePharmacy = catchAsyncError(async (req, res, next) => {
    let pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    if (req.file) {
        req.body.avatar = {
            public_id: req.file.filename,
            url: req.file.path
        };
    }

    pharmacy = await Pharmacy.findByIdAndUpdate(pharmacy._id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Pharmacy updated successfully',
        pharmacy
    });
});

// Get all pharmacies with filters
exports.getAllPharmacies = catchAsyncError(async (req, res, next) => {
    const { city, pincode, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'active' };
    
    if (city) {
        query['address.city'] = new RegExp(city, 'i');
    }
    
    if (pincode) {
        query['address.pincode'] = pincode;
    }

    const skip = (page - 1) * limit;
    
    const pharmacies = await Pharmacy.find(query)
        .populate('owner', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await Pharmacy.countDocuments(query);

    res.status(200).json({
        success: true,
        pharmacies,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            page: parseInt(page),
            limit: parseInt(limit)
        }
    });
});

// Quick pharmacy setup for testing
exports.quickPharmacySetup = catchAsyncError(async (req, res, next) => {
    // Check if user already has a pharmacy
    const existingPharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (existingPharmacy) {
        return res.status(200).json({
            success: true,
            message: "Pharmacy already exists",
            pharmacy: existingPharmacy
        });
    }

    // Generate a unique license number for testing
    const licenseNumber = `TEST-${Date.now()}-${req.user._id.toString().slice(-4)}`;
    
    const pharmacyData = {
        owner: req.user._id,
        name: `${req.user.name}'s Pharmacy`,
        description: "Test pharmacy for development",
        address: {
            street: "123 Test Street",
            city: "Test City",
            state: "Test State",
            pincode: "123456"
        },
        contactInfo: {
            phone: req.user.phone || "1234567890",
            email: req.user.email || "test@example.com",
        },
        licenseNumber,
        establishedYear: new Date().getFullYear(),
        operatingHours: {
            weekdays: { open: "09:00", close: "21:00" },
            weekends: { open: "10:00", close: "20:00" }
        },
        isVerified: true, // Auto-verify for testing
        verificationStatus: 'verified'
    };

    const pharmacy = await Pharmacy.create(pharmacyData);

    // Ensure the user has pharmacist role for access to pharmacist routes
    if (req.user.role !== 'pharmacist') {
        await User.findByIdAndUpdate(req.user._id, { role: 'pharmacist' });
    }

    res.status(201).json({
        success: true,
        message: "Test pharmacy created successfully",
        pharmacy
    });
});

// Add new medicine
exports.addMedicine = catchAsyncError(async (req, res, next) => {
    let pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    // Auto-create a basic pharmacy for pharmacists if missing (DX-friendly)
    if (!pharmacy) {
        // Minimal auto-setup to unblock adding medicines during dev/testing
        const licenseNumber = `AUTO-${Date.now()}-${req.user._id.toString().slice(-4)}`;
        const basePharmacy = {
            owner: req.user._id,
            name: `${req.user.name || 'My'} Pharmacy`,
            description: 'Auto-created pharmacy',
            address: {
                street: 'Auto Street',
                city: 'Auto City',
                state: 'Auto State',
                pincode: '000000',
            },
            contactInfo: {
                phone: req.user.phone || '0000000000',
                email: req.user.email || 'auto@example.com',
            },
            licenseNumber,
            establishedYear: new Date().getFullYear(),
            isVerified: true,
            verificationStatus: 'verified',
        };
        pharmacy = await Pharmacy.create(basePharmacy);
    }

    // Coerce types from multipart form (everything arrives as strings)
    const coerceBoolean = (v) => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'string') return v.toLowerCase() === 'true';
        return false;
    };
    const coerceNumber = (v) => (v === '' || v === undefined ? undefined : Number(v));
    const coerceDate = (v) => (v ? new Date(v) : undefined);

    const medicineData = {
        name: req.body.name,
        genericName: req.body.genericName,
        category: req.body.category,
        manufacturer: req.body.manufacturer,
        composition: req.body.composition,
        strength: req.body.strength,
        formType: req.body.formType,
        packSize: req.body.packSize,
        price: coerceNumber(req.body.price),
        mrp: coerceNumber(req.body.mrp),
        discount: coerceNumber(req.body.discount) || 0,
        stock: coerceNumber(req.body.stock),
        minStock: coerceNumber(req.body.minStock),
        expiryDate: coerceDate(req.body.expiryDate),
        batchNumber: req.body.batchNumber,
        description: req.body.description,
        uses: req.body.uses,
        sideEffects: req.body.sideEffects,
        precautions: req.body.precautions,
        dosage: req.body.dosage,
        prescriptionRequired: coerceBoolean(req.body.prescriptionRequired),
        isActive: req.body.isActive !== undefined ? coerceBoolean(req.body.isActive) : undefined,
        pharmacy: pharmacy._id
    };

    if (req.files && req.files.length > 0) {
        medicineData.images = req.files.map(file => ({
            public_id: file.filename,
            url: file.path
        }));
    }

    const medicine = await Medicine.create(medicineData);

    res.status(201).json({
        success: true,
        message: 'Medicine added successfully',
        medicine
    });
});

// Get all medicines for a pharmacy
exports.getPharmacyMedicines = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 20, category, search, sortBy = 'name' } = req.query;
    const pharmacyId = req.params.pharmacyId;

    let query = { pharmacy: pharmacyId, isActive: true };
    
    if (category && category !== 'all') {
        query.category = category;
    }
    
    if (search) {
        query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    
    let sortOption = {};
    switch (sortBy) {
        case 'price-low':
            sortOption = { price: 1 };
            break;
        case 'price-high':
            sortOption = { price: -1 };
            break;
        case 'rating':
            sortOption = { rating: -1 };
            break;
        case 'newest':
            sortOption = { createdAt: -1 };
            break;
        default:
            sortOption = { name: 1 };
    }

    const medicines = await Medicine.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortOption);

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
        success: true,
        medicines,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            page: parseInt(page),
            limit: parseInt(limit)
        }
    });
});

// Update medicine
exports.updateMedicine = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    if (!pharmacy) {
        return next(new ErrorHandler("No pharmacy found for this user", 404));
    }

    let medicine = await Medicine.findOne({ 
        _id: req.params.id, 
        pharmacy: pharmacy._id 
    });
    
    if (!medicine) {
        return next(new ErrorHandler("Medicine not found", 404));
    }

    if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file => ({
            public_id: file.filename,
            url: file.path
        }));
    }

    medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Medicine updated successfully',
        medicine
    });
});

// Delete medicine
exports.deleteMedicine = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    if (!pharmacy) {
        return next(new ErrorHandler("No pharmacy found for this user", 404));
    }

    const medicine = await Medicine.findOne({ 
        _id: req.params.id, 
        pharmacy: pharmacy._id 
    });
    
    if (!medicine) {
        return next(new ErrorHandler("Medicine not found", 404));
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Medicine deleted successfully'
    });
});

// Get pharmacy dashboard stats
exports.getPharmacyStats = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    
    if (!pharmacy) {
        return next(new ErrorHandler("No pharmacy found for this user", 404));
    }

    const totalMedicines = await Medicine.countDocuments({ pharmacy: pharmacy._id });
    const activeMedicines = await Medicine.countDocuments({ pharmacy: pharmacy._id, isActive: true });
    const lowStockMedicines = await Medicine.countDocuments({ 
        pharmacy: pharmacy._id, 
        $expr: { $lte: ["$stock", "$minStock"] }
    });

    const totalOrders = await Order.countDocuments({ pharmacy: pharmacy._id });
    const pendingOrders = await Order.countDocuments({ 
        pharmacy: pharmacy._id, 
        orderStatus: { $in: ['pending', 'confirmed'] }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ 
        pharmacy: pharmacy._id, 
        createdAt: { $gte: today }
    });

    // Revenue calculation
    const revenueData = await Order.aggregate([
        { 
            $match: { 
                pharmacy: pharmacy._id, 
                'paymentInfo.status': 'completed' 
            } 
        },
        { 
            $group: { 
                _id: null, 
                totalRevenue: { $sum: '$pricing.totalPrice' } 
            } 
        }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
        success: true,
        stats: {
            medicines: {
                total: totalMedicines,
                active: activeMedicines,
                lowStock: lowStockMedicines
            },
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                today: todayOrders
            },
            revenue: {
                total: totalRevenue
            }
        }
    });
});

// Bulk operations for pharmacists
exports.bulkUploadMedicines = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    const { medicines } = req.body;

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
        return next(new ErrorHandler("Please provide medicines data", 400));
    }

    const processedMedicines = medicines.map(medicine => ({
        ...medicine,
        pharmacy: pharmacy._id
    }));

    const createdMedicines = await Medicine.insertMany(processedMedicines, { 
        ordered: false // Continue with valid documents even if some fail
    });

    // Update pharmacy medicine count
    await Pharmacy.findByIdAndUpdate(pharmacy._id, {
        $inc: { totalMedicines: createdMedicines.length }
    });

    res.status(201).json({
        success: true,
        message: `${createdMedicines.length} medicines uploaded successfully`,
        medicines: createdMedicines
    });
});

// Update stock for multiple medicines
exports.bulkUpdateStock = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    const { stockUpdates } = req.body; // [{medicineId, newStock}, ...]

    if (!stockUpdates || !Array.isArray(stockUpdates)) {
        return next(new ErrorHandler("Please provide stock updates", 400));
    }

    const updatePromises = stockUpdates.map(({ medicineId, newStock }) => 
        Medicine.findOneAndUpdate(
            { _id: medicineId, pharmacy: pharmacy._id },
            { stock: newStock },
            { new: true }
        )
    );

    const updatedMedicines = await Promise.all(updatePromises);

    res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        medicines: updatedMedicines.filter(med => med !== null)
    });
});

// Get low stock medicines
exports.getLowStockMedicines = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    const lowStockMedicines = await Medicine.find({
        pharmacy: pharmacy._id,
        $expr: { $lte: ["$stock", "$minStock"] },
        isActive: true
    }).sort({ stock: 1 });

    res.status(200).json({
        success: true,
        count: lowStockMedicines.length,
        medicines: lowStockMedicines
    });
});

// Get expired/expiring medicines
exports.getExpiringMedicines = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    const { days = 30 } = req.query; // Default 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));

    const expiringMedicines = await Medicine.find({
        pharmacy: pharmacy._id,
        expiryDate: { $lte: expiryDate },
        isActive: true
    }).sort({ expiryDate: 1 });

    res.status(200).json({
        success: true,
        count: expiringMedicines.length,
        medicines: expiringMedicines
    });
});

// Generate pharmacy report
exports.getPharmacyReport = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    const { startDate, endDate, reportType = 'monthly' } = req.query;

    let dateRange = {};
    if (startDate && endDate) {
        dateRange = {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
    } else {
        // Default to last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateRange = {
            createdAt: { $gte: thirtyDaysAgo }
        };
    }

    // Order analytics
    const orderStats = await Order.aggregate([
        { 
            $match: { 
                pharmacyId: pharmacy._id,
                ...dateRange
            } 
        },
        {
            $group: {
                _id: {
                    status: '$status',
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                },
                count: { $sum: 1 },
                revenue: { $sum: '$totalAmount' }
            }
        },
        {
            $group: {
                _id: '$_id.status',
                dailyStats: {
                    $push: {
                        date: '$_id.date',
                        count: '$count',
                        revenue: '$revenue'
                    }
                },
                totalCount: { $sum: '$count' },
                totalRevenue: { $sum: '$revenue' }
            }
        }
    ]);

    // Top selling medicines
    const topMedicines = await Order.aggregate([
        { $match: { pharmacyId: pharmacy._id, ...dateRange } },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.medicine',
                totalSold: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'medicines',
                localField: '_id',
                foreignField: '_id',
                as: 'medicineInfo'
            }
        },
        { $unwind: '$medicineInfo' },
        {
            $project: {
                name: '$medicineInfo.name',
                manufacturer: '$medicineInfo.manufacturer',
                totalSold: 1,
                totalRevenue: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        report: {
            pharmacy: {
                name: pharmacy.name,
                id: pharmacy._id
            },
            period: {
                startDate: startDate || thirtyDaysAgo,
                endDate: endDate || new Date(),
                type: reportType
            },
            orderStats,
            topMedicines,
            summary: {
                totalOrders: orderStats.reduce((sum, stat) => sum + stat.totalCount, 0),
                totalRevenue: orderStats.reduce((sum, stat) => sum + stat.totalRevenue, 0),
                topSellingMedicine: topMedicines[0]?.name || 'N/A'
            }
        }
    });
});

// Medicine search within pharmacy
exports.searchPharmacyMedicines = catchAsyncError(async (req, res, next) => {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
        return next(new ErrorHandler("Pharmacy not found", 404));
    }

    const { keyword, category, prescriptionRequired, stockStatus, sortBy = 'name' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = { pharmacy: pharmacy._id };

    if (keyword) {
        query.$text = { $search: keyword };
    }

    if (category) {
        query.category = category;
    }

    if (prescriptionRequired !== undefined) {
        query.prescriptionRequired = prescriptionRequired === 'true';
    }

    if (stockStatus) {
        switch (stockStatus) {
            case 'inStock':
                query.stock = { $gt: 0 };
                break;
            case 'outOfStock':
                query.stock = { $eq: 0 };
                break;
            case 'lowStock':
                query.$expr = { $lte: ["$stock", "$minStock"] };
                break;
        }
    }

    const sortOptions = {};
    switch (sortBy) {
        case 'name':
            sortOptions.name = 1;
            break;
        case 'price':
            sortOptions.price = 1;
            break;
        case 'stock':
            sortOptions.stock = -1;
            break;
        case 'expiry':
            sortOptions.expiryDate = 1;
            break;
        default:
            sortOptions.name = 1;
    }

    const medicines = await Medicine.find(query)
        .sort(sortOptions)
        .limit(limit)
        .skip(skip);

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
        success: true,
        medicines,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
        }
    });
});

module.exports = {
    registerPharmacy: exports.registerPharmacy,
    quickPharmacySetup: exports.quickPharmacySetup,
    getPharmacyDetails: exports.getPharmacyDetails,
    getMyPharmacy: exports.getMyPharmacy,
    updatePharmacy: exports.updatePharmacy,
    getAllPharmacies: exports.getAllPharmacies,
    addMedicine: exports.addMedicine,
    getPharmacyMedicines: exports.getPharmacyMedicines,
    updateMedicine: exports.updateMedicine,
    deleteMedicine: exports.deleteMedicine,
    getPharmacyStats: exports.getPharmacyStats,
    bulkUploadMedicines: exports.bulkUploadMedicines,
    bulkUpdateStock: exports.bulkUpdateStock,
    getLowStockMedicines: exports.getLowStockMedicines,
    getExpiringMedicines: exports.getExpiringMedicines,
    getPharmacyReport: exports.getPharmacyReport,
    searchPharmacyMedicines: exports.searchPharmacyMedicines
};
