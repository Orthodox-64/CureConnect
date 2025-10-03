const ErrorHander = require("../utils/errorHander");
const Prescription = require("../models/prescriptionModel");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createPrescription = catchAsyncError(async (req, res, next) => {
    const { 
        patientId, 
        appointmentId, 
        medications, 
        notes, 
        diagnosis, 
        symptoms, 
        followUpInstructions 
    } = req.body;

    if (!patientId || !appointmentId || !medications || !diagnosis) {
        return next(new ErrorHander("Please provide all required fields (patientId, appointmentId, medications, diagnosis)", 400));
    }

    // Generate unique prescription number
    const prescriptionNumber = `RX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const prescription = await Prescription.create({
        patient: patientId,
        doctor: req.user._id,
        appointment: appointmentId,
        medications,
        notes,
        diagnosis,
        symptoms,
        followUpInstructions,
        prescriptionNumber
    });

    // Populate the prescription with patient and doctor details
    await prescription.populate('patient', 'name contact');
    await prescription.populate('doctor', 'name speciality');

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

// Generate PDF for prescription
exports.generatePrescriptionPDF = catchAsyncError(async (req, res, next) => {
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

    // Generate PDF content
    const pdfContent = generatePrescriptionPDFContent(prescription);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="prescription-${prescription.prescriptionNumber}.pdf"`);
    res.send(pdfContent);
});

// Helper function to generate PDF content
function generatePrescriptionPDFContent(prescription) {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });
    
    // Set up buffers
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});
    
    // Header
    doc.fontSize(20).text('MEDICAL PRESCRIPTION', { align: 'center' });
    doc.fontSize(12).text(`Prescription #: ${prescription.prescriptionNumber}`, { align: 'center' });
    doc.moveDown();
    
    // Doctor Information
    doc.fontSize(14).text('DOCTOR INFORMATION', { underline: true });
    doc.fontSize(12).text(`Name: Dr. ${prescription.doctor.name}`);
    doc.text(`Speciality: ${prescription.doctor.speciality || 'General Medicine'}`);
    doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
    doc.moveDown();
    
    // Patient Information
    doc.fontSize(14).text('PATIENT INFORMATION', { underline: true });
    doc.fontSize(12).text(`Name: ${prescription.patient.name}`);
    doc.text(`Contact: ${prescription.patient.contact}`);
    doc.moveDown();
    
    // Diagnosis
    if (prescription.diagnosis) {
        doc.fontSize(14).text('DIAGNOSIS', { underline: true });
        doc.fontSize(12).text(prescription.diagnosis);
        doc.moveDown();
    }
    
    // Symptoms
    if (prescription.symptoms) {
        doc.fontSize(14).text('SYMPTOMS', { underline: true });
        doc.fontSize(12).text(prescription.symptoms);
        doc.moveDown();
    }
    
    // Medications
    doc.fontSize(14).text('MEDICATIONS', { underline: true });
    prescription.medications.forEach((med, index) => {
        doc.fontSize(12).text(`${index + 1}. ${med.name}`);
        doc.text(`   Dosage: ${med.dosage}`);
        doc.text(`   Frequency: ${med.frequency}`);
        if (med.duration) doc.text(`   Duration: ${med.duration}`);
        if (med.instructions) doc.text(`   Instructions: ${med.instructions}`);
        doc.moveDown(0.5);
    });
    
    // Notes
    if (prescription.notes) {
        doc.fontSize(14).text('ADDITIONAL NOTES', { underline: true });
        doc.fontSize(12).text(prescription.notes);
        doc.moveDown();
    }
    
    // Follow-up Instructions
    if (prescription.followUpInstructions) {
        doc.fontSize(14).text('FOLLOW-UP INSTRUCTIONS', { underline: true });
        doc.fontSize(12).text(prescription.followUpInstructions);
        doc.moveDown();
    }
    
    // Footer
    doc.fontSize(10).text('This prescription is digitally signed and valid for 30 days from the date of issue.', { align: 'center' });
    doc.text('For any queries, please contact the prescribing doctor.', { align: 'center' });
    
    doc.end();
    
    return Buffer.concat(buffers);
}