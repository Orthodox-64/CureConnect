const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter medicine name'],
        maxLength: [200, 'Medicine name cannot exceed 200 characters']
    },
    genericName: {
        type: String,
        maxLength: [200, 'Generic name cannot exceed 200 characters']
    },
    pharmacy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please select medicine category'],
        enum: [
            'Pain Relief',
            'Antibiotics',
            'Vitamins & Supplements',
            'Cold & Flu',
            'Digestive Health',
            'Heart & Blood Pressure',
            'Diabetes',
            'Skin Care',
            'Eye Care',
            'Women Health',
            'Men Health',
            'Child Care',
            'First Aid',
            'Prescription',
            'Other'
        ]
    },
    manufacturer: {
        type: String,
        required: [true, 'Please enter manufacturer name']
    },
    composition: {
        type: String,
        required: [true, 'Please enter medicine composition']
    },
    strength: {
        type: String,
        required: [true, 'Please enter medicine strength']
    },
    formType: {
        type: String,
        required: [true, 'Please select form type'],
        enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Cream', 'Ointment', 'Gel', 'Powder', 'Other']
    },
    packSize: {
        type: String,
        required: [true, 'Please enter pack size']
    },
    price: {
        type: Number,
        required: [true, 'Please enter medicine price'],
        min: 0
    },
    mrp: {
        type: Number,
        required: [true, 'Please enter MRP'],
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    stock: {
        type: Number,
        required: [true, 'Please enter stock quantity'],
        min: 0,
        default: 0
    },
    minStock: {
        type: Number,
        default: 10
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please enter expiry date']
    },
    batchNumber: {
        type: String,
        required: [true, 'Please enter batch number']
    },
    images: [{
        public_id: String,
        url: String
    }],
    description: {
        type: String,
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    uses: {
        type: String,
        maxLength: [500, 'Uses cannot exceed 500 characters']
    },
    sideEffects: {
        type: String,
        maxLength: [500, 'Side effects cannot exceed 500 characters']
    },
    precautions: {
        type: String,
        maxLength: [500, 'Precautions cannot exceed 500 characters']
    },
    dosage: {
        type: String,
        maxLength: [300, 'Dosage cannot exceed 300 characters']
    },
    prescriptionRequired: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    tags: [String],
    soldCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Text search indexes
medicineSchema.index({
    name: 'text',
    genericName: 'text',
    manufacturer: 'text',
    composition: 'text',
    uses: 'text',
    tags: 'text'
});

// Compound indexes for efficient queries
medicineSchema.index({ pharmacy: 1, category: 1 });
medicineSchema.index({ pharmacy: 1, isActive: 1 });
medicineSchema.index({ category: 1, prescriptionRequired: 1 });
medicineSchema.index({ price: 1 });
medicineSchema.index({ rating: -1 });

// Virtual for calculated discount price
medicineSchema.virtual('discountedPrice').get(function() {
    return this.mrp * (1 - this.discount / 100);
});

// Check if medicine is in stock
medicineSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

// Check if medicine is low on stock
medicineSchema.virtual('lowStock').get(function() {
    return this.stock <= this.minStock && this.stock > 0;
});

module.exports = mongoose.model('Medicine', medicineSchema);
