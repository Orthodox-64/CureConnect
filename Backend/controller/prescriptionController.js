const ErrorHander = require("../utils/errorHander");
const Prescription = require("../models/prescriptionModel");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createPrescription = catchAsyncError(async (req, res, next) => {
    console.log('Creating prescription with data:', req.body);
    console.log('User creating prescription:', req.user);
    
    const { 
        patientId, 
        appointmentId, 
        medications, 
        notes, 
        diagnosis, 
        symptoms, 
        followUpInstructions 
    } = req.body;

    // If patientId is missing, try to get it from the appointment
    let actualPatientId = patientId;
    if (!actualPatientId && appointmentId) {
        console.log('PatientId is missing, trying to fetch from appointment:', appointmentId);
        try {
            const Appointment = require('../models/appointmentModel');
            const appointment = await Appointment.findById(appointmentId);
            if (appointment) {
                console.log('Found appointment:', { 
                    _id: appointment._id, 
                    patient: appointment.patient,
                    doctor: appointment.doctor 
                });
                actualPatientId = appointment.patient;
                console.log('Extracted patient ID from appointment:', actualPatientId);
            } else {
                console.log('Appointment not found');
            }
        } catch (error) {
            console.error('Error fetching appointment:', error.message);
        }
    }

    // Validate required fields
    if (!actualPatientId || !appointmentId || !medications || !diagnosis) {
        console.log('Missing required fields:', { 
            patientId: actualPatientId, 
            appointmentId, 
            medications: !!medications, 
            diagnosis: !!diagnosis 
        });
        return next(new ErrorHander("Please provide all required fields (patientId, appointmentId, medications, diagnosis)", 400));
    }

    // Validate medications array
    if (!Array.isArray(medications) || medications.length === 0) {
        return next(new ErrorHander("Please provide at least one medication", 400));
    }

    // Validate each medication
    for (let i = 0; i < medications.length; i++) {
        const med = medications[i];
        if (!med.name || !med.dosage || !med.frequency) {
            return next(new ErrorHander(`Medication ${i + 1} is missing required fields (name, dosage, frequency)`, 400));
        }
    }

    try {
        // Generate unique prescription number
        const prescriptionNumber = `RX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        console.log('Creating prescription with number:', prescriptionNumber);

        const prescription = await Prescription.create({
            patient: actualPatientId,
            doctor: req.user._id,
            appointment: appointmentId,
            medications,
            notes,
            diagnosis,
            symptoms,
            followUpInstructions,
            prescriptionNumber
        });

        console.log('Prescription created successfully:', prescription._id);

        // Populate the prescription with patient and doctor details
        await prescription.populate('patient', 'name contact');
        await prescription.populate('doctor', 'name speciality');

        console.log('Prescription populated, sending response');

        res.status(201).json({
            success: true,
            prescription
        });
    } catch (error) {
        console.error('Error creating prescription:', error);
        return next(new ErrorHander(`Failed to create prescription: ${error.message}`, 500));
    }
});

exports.getPrescriptions = catchAsyncError(async (req, res, next) => {
    console.log('Getting prescriptions for user:', req.user._id, 'Role:', req.user.role);
    
    let prescriptions;

    try {
        if (req.user.role === 'doctor') {
            console.log('Fetching prescriptions for doctor:', req.user._id);
            prescriptions = await Prescription.find({ doctor: req.user._id })
                .populate('patient', 'name contact')
                .populate('appointment', 'day time')
                .sort({ createdAt: -1 });
        } else {
            console.log('Fetching prescriptions for patient:', req.user._id);
            prescriptions = await Prescription.find({ patient: req.user._id })
                .populate('doctor', 'name speciality')
                .populate('appointment', 'day time')
                .sort({ createdAt: -1 });
        }

        console.log(`Found ${prescriptions.length} prescriptions`);
        if (prescriptions.length > 0) {
            console.log('Prescription IDs:', prescriptions.map(p => p._id));
        }
        
        res.status(200).json({
            success: true,
            prescriptions
        });
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        return next(new ErrorHander(`Failed to fetch prescriptions: ${error.message}`, 500));
    }
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

// Generate PDF
const generatePrescriptionPDF = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log('PDF generation requested for prescription ID:', id);

    const prescription = await Prescription.findById(id)
        .populate('patient', 'name contact')
        .populate('doctor', 'name speciality')
        .populate('appointment');

    console.log('Found prescription:', prescription ? 'Yes' : 'No');
    if (prescription) {
        console.log('Prescription details:', {
            id: prescription._id,
            prescriptionNumber: prescription.prescriptionNumber,
            patient: prescription.patient?.name,
            doctor: prescription.doctor?.name
        });
    }

    if (!prescription) {
        return next(new ErrorHander('Prescription not found', 404));
    }

    try {
        console.log('Starting PDF generation...');
        const pdfBuffer = await generatePrescriptionPDFContent(prescription);
        console.log('PDF generated successfully, buffer length:', pdfBuffer.length);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="prescription-${prescription.prescriptionNumber}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        return next(new ErrorHander('Error generating PDF', 500));
    }
});

// Helper function to generate PDF content
function generatePrescriptionPDFContent(prescription) {
    return new Promise((resolve, reject) => {
        try {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 50 });
            
            // Set up buffers
            const buffers = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', (error) => {
                reject(error);
            });
            
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
            doc.moveDown();
            
            // Doctor's Digital Signature
            doc.fontSize(12)
               .font('Helvetica-Oblique') // Italic font for signature
               .text(`Digitally Signed by: Dr. ${prescription.doctor.name}`, { align: 'right' })
               .font('Helvetica'); // Reset to normal font
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    createPrescription: exports.createPrescription,
    getPrescriptions: exports.getPrescriptions,
    getSinglePrescription: exports.getSinglePrescription,
    generatePrescriptionPDF: generatePrescriptionPDF
};