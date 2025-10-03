const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Patient is required"]
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Doctor is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxLength: [500, "Description cannot exceed 500 characters"]
    },
    symptoms: {
        type: String,
        required: [true, "Symptoms are required"],
        trim: true,
        maxLength: [1000, "Symptoms cannot exceed 1000 characters"]
    },
    aiSuggestions: {
        type: String,
        trim: true,
        maxLength: [2000, "AI suggestions cannot exceed 2000 characters"]
    },
    day: {
        type: String,
        required: [true, "Day is required"],
        validate: {
            validator: function(v) {
                // Validate date format YYYY-MM-DD
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid date format! Use YYYY-MM-DD`
        }
    },
    time: {
        type: String,
        required: [true, "Time is required"],
        validate: {
            validator: function(v) {
                // Validate time format HH:MM
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid time format! Use HH:MM`
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate appointments
appointmentSchema.index({ doctor: 1, day: 1, time: 1 }, { unique: true });

// Method to check if time slot is available
appointmentSchema.statics.isTimeSlotAvailable = async function(doctorId, day, time) {
    const appointment = await this.findOne({ doctor: doctorId, day, time });
    return !appointment;
};

// Pre-save middleware to validate appointment date is not in past
appointmentSchema.pre('save', function(next) {
    const appointmentDate = new Date(`${this.day}T${this.time}`);
    if (appointmentDate < new Date()) {
        next(new Error('Cannot create appointment for past date/time'));
    }
    next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);