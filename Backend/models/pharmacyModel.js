const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter pharmacy name'],
        maxLength: [100, 'Pharmacy name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxLength: [500, 'Description cannot exceed 500 characters']
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'suspended'],
        default: 'pending'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    verificationDocuments: {
        pharmacyLicense: {
            public_id: String,
            url: String
        },
        drugLicense: {
            public_id: String,
            url: String
        },
        gstCertificate: {
            public_id: String,
            url: String
        }
    },
    address: {
        street: {
            type: String,
            required: [true, 'Please enter street address']
        },
        city: {
            type: String,
            required: [true, 'Please enter city']
        },
        state: {
            type: String,
            required: [true, 'Please enter state']
        },
        pincode: {
            type: String,
            required: [true, 'Please enter pincode']
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    contactInfo: {
        phone: {
            type: String,
            required: [true, 'Please enter phone number']
        },
        email: {
            type: String,
            required: [true, 'Please enter email']
        },
        whatsapp: String
    },
    licenseNumber: {
        type: String,
        required: [true, 'Please enter pharmacy license number'],
        unique: true
    },
    establishedYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
    },
    operatingHours: {
        weekdays: {
            open: String,
            close: String
        },
        weekends: {
            open: String,
            close: String
        }
    },
    deliveryRadius: {
        type: Number,
        default: 10 // in kilometers
    },
    deliveryCharges: {
        type: Number,
        default: 0
    },
    freeDeliveryAbove: {
        type: Number,
        default: 500
    },
    isVerified: {
        type: Boolean,
        default: false
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
    avatar: {
        public_id: String,
        url: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    totalMedicines: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    monthlyRevenue: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for location-based queries
pharmacySchema.index({ "address.coordinates": "2dsphere" });
pharmacySchema.index({ "address.city": 1 });
pharmacySchema.index({ "address.pincode": 1 });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
