const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return 'TKT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        }
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject for the ticket'],
        maxLength: [100, 'Subject cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description of the issue'],
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Technical Issue',
            'Account Problem',
            'Appointment Issue',
            'Payment Issue',
            'Medical Records',
            'Prescription Issue',
            'General Inquiry',
            'Bug Report',
            'Feature Request',
            'Other'
        ],
        default: 'General Inquiry'
    },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        required: true,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Admin who is handling the ticket
        default: null
    },
    adminNotes: [{
        note: {
            type: String,
            maxLength: [500, 'Note cannot exceed 500 characters']
        },
        addedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolvedAt: {
        type: Date,
        default: null
    },
    closedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for better query performance
ticketSchema.index({ userId: 1, status: 1 });
ticketSchema.index({ ticketId: 1 });
ticketSchema.index({ createdAt: -1 });

// Pre middleware to set resolved/closed dates
ticketSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        if (this.status === 'Resolved' && !this.resolvedAt) {
            this.resolvedAt = new Date();
        }
        if (this.status === 'Closed' && !this.closedAt) {
            this.closedAt = new Date();
        }
    }
    next();
});

// Virtual to get ticket age in days
ticketSchema.virtual('ageInDays').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual to format ticket ID for display
ticketSchema.virtual('displayId').get(function() {
    return this.ticketId;
});

module.exports = mongoose.model('Ticket', ticketSchema);
