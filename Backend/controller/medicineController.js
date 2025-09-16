const Medicine = require('../models/medicineModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Pharmacy = require('../models/pharmacyModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHander');

// Get all medicines with filters
exports.getAllMedicines = catchAsyncError(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 20, 
        category, 
        search, 
        sortBy = 'name',
        minPrice,
        maxPrice,
        prescriptionRequired,
        city,
        pincode
    } = req.query;

    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
        query.category = category;
    }
    
    // Text search
    if (search) {
        query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Prescription filter
    if (prescriptionRequired !== undefined) {
        query.prescriptionRequired = prescriptionRequired === 'true';
    }

    // Location-based filter
    let pharmacyQuery = {};
    if (city) {
        pharmacyQuery['address.city'] = new RegExp(city, 'i');
    }
    if (pincode) {
        pharmacyQuery['address.pincode'] = pincode;
    }

    let medicines;
    if (Object.keys(pharmacyQuery).length > 0) {
        // If location filter is applied, first get pharmacies in that location
        const pharmacies = await Pharmacy.find(pharmacyQuery).select('_id');
        const pharmacyIds = pharmacies.map(p => p._id);
        query.pharmacy = { $in: pharmacyIds };
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
        case 'popular':
            sortOption = { soldCount: -1 };
            break;
        default:
            sortOption = { name: 1 };
    }

    medicines = await Medicine.find(query)
        .populate('pharmacy', 'name address contactInfo rating')
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

// Get medicine by ID
exports.getMedicineById = catchAsyncError(async (req, res, next) => {
    const medicine = await Medicine.findById(req.params.id)
        .populate('pharmacy', 'name address contactInfo rating operatingHours');
    
    if (!medicine) {
        return next(new ErrorHandler("Medicine not found", 404));
    }

    res.status(200).json({
        success: true,
        medicine
    });
});

// Search medicines
exports.searchMedicines = catchAsyncError(async (req, res, next) => {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
        return res.status(200).json({
            success: true,
            medicines: []
        });
    }

    const medicines = await Medicine.find({
        isActive: true,
        $or: [
            { name: new RegExp(q, 'i') },
            { genericName: new RegExp(q, 'i') },
            { manufacturer: new RegExp(q, 'i') },
            { composition: new RegExp(q, 'i') }
        ]
    })
    .populate('pharmacy', 'name address')
    .limit(parseInt(limit))
    .select('name genericName manufacturer price mrp images pharmacy category stock');

    res.status(200).json({
        success: true,
        medicines
    });
});

// Get medicine categories
exports.getMedicineCategories = catchAsyncError(async (req, res, next) => {
    const categories = await Medicine.distinct('category', { isActive: true });
    
    res.status(200).json({
        success: true,
        categories
    });
});

// Get featured medicines
exports.getFeaturedMedicines = catchAsyncError(async (req, res, next) => {
    const { limit = 10 } = req.query;

    const medicines = await Medicine.find({ 
        isActive: true,
        stock: { $gt: 0 }
    })
    .populate('pharmacy', 'name rating')
    .sort({ rating: -1, soldCount: -1 })
    .limit(parseInt(limit));

    res.status(200).json({
        success: true,
        medicines
    });
});

module.exports = {
    getAllMedicines: exports.getAllMedicines,
    getMedicineById: exports.getMedicineById,
    searchMedicines: exports.searchMedicines,
    getMedicineCategories: exports.getMedicineCategories,
    getFeaturedMedicines: exports.getFeaturedMedicines
};
