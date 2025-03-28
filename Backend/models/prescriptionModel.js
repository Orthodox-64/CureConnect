const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
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
    appointment: {
        type: mongoose.Schema.ObjectId,
        ref: "Appointment",
        required: [true, "Appointment reference is required"]
    },
    medications: [{
        name: {
            type: String,
            required: [true, "Medication name is required"]
        },
        dosage: {
            type: String,
            required: [true, "Dosage is required"]
        },
        frequency: {
            type: String,
            required: [true, "Frequency is required"]
        },
        duration: String,
        instructions: String
    }],
    notes: {
        type: String,
        maxLength: [500, "Notes cannot exceed 500 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);