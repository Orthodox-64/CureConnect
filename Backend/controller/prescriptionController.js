const ErrorHander = require("../utils/errorHander");
const Prescription = require("../models/prescriptionModel");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createPrescription = catchAsyncError(async (req, res, next) => {
    const { patientId, appointmentId, medications, notes } = req.body;

    if (!patientId || !appointmentId || !medications) {
        return next(new ErrorHander("Please provide all required fields", 400));
    }

    const prescription = await Prescription.create({
        patient: patientId,
        doctor: req.user._id,
        appointment: appointmentId,
        medications,
        notes
    });

    res.status(201).json({
        success: true,
        prescription
    });
});

exports.getPrescriptions = catchAsyncError(async (req, res, next) => {
    let prescriptions;

    if (req.user.role === 'doctor') {
        prescriptions = await Prescription.find({ doctor: req.user._id })
            .populate('patient', 'name contact')
            .populate('appointment', 'day time')
            .sort({ createdAt: -1 });
    } else {
        prescriptions = await Prescription.find({ patient: req.user._id })
            .populate('doctor', 'name speciality')
            .populate('appointment', 'day time')
            .sort({ createdAt: -1 });
        console.log(prescriptions);
    }

    res.status(200).json({
        success: true,
        prescriptions
    });
});

exports.getSinglePrescription = catchAsyncError(async (req, res, next) => {
    const prescription = await Prescription.findById(req.params.id)
        .populate('patient', 'name contact')
        .populate('doctor', 'name speciality')
        .populate('appointment', 'day time');

    if (!prescription) {
        return next(new ErrorHander("Prescription not found", 404));
    }

    // Check if user is authorized to view this prescription
    if (req.user.role !== 'doctor' && 
        prescription.patient._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHander("Not authorized to view this prescription", 403));
    }

    res.status(200).json({
        success: true,
        prescription
    });
});