const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    pharmacy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    items: [{
        medicine: {
            type: mongoose.Schema.ObjectId,
            ref: 'Medicine',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        mrp: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        }
    }],
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        landmark: String,
        addressType: {
            type: String,
            enum: ['Home', 'Work', 'Other'],
            default: 'Home'
        }
    },
    paymentInfo: {
        method: {
            type: String,
            required: true,
            enum: ['cod', 'online', 'wallet']
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: String,
        paidAt: Date
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    pricing: {
        itemsPrice: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        deliveryCharge: {
            type: Number,
            default: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0
        }
    },
    deliveryInfo: {
        type: {
            type: String,
            enum: ['pickup', 'delivery'],
            required: true,
            default: 'delivery'
        },
        estimatedTime: {
            type: String
        },
        actualDeliveryTime: Date,
        deliveryPersonName: String,
        deliveryPersonPhone: String,
        trackingNumber: String
    },
    prescriptionImages: [{
        public_id: String,
        url: String
    }],
    specialInstructions: {
        type: String,
        maxLength: [500, 'Special instructions cannot exceed 500 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxLength: [500, 'Review cannot exceed 500 characters']
    },
    reviewedAt: Date,
    isUrgent: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String
}, {
    timestamps: true
});

// Generate order number before validation so `required` passes
orderSchema.pre('validate', async function(next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Find the last order of today
        const lastOrder = await this.constructor.findOne({
            createdAt: {
                $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            }
        }).sort({ createdAt: -1 });
        
        let sequence = 1;
        if (lastOrder && lastOrder.orderNumber) {
            const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        
        this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
    }
    next();
});

// Indexes for efficient queries
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ pharmacy: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

module.exports = mongoose.model('Order', orderSchema);
