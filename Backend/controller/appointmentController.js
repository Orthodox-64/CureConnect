const ErrorHander = require("../utils/errorHander");
const Appointment = require("../models/appointmentModel.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");
const validator = require("validator");
const sendSMS = require("../utils/sendSMS");
const sendReminder = require("../utils/sendReminder");

const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 12);
};

exports.newAppointment = catchAsyncError(async (req, res, next) => {
    const { doctor, description, symptoms, day, time, audioTranscript } = req.body;

    if (!doctor || !description || !symptoms || !day || !time) {
        return next(new ErrorHander("Please provide all required fields including symptoms", 400));
    }
    const doctorExists = await User.findOne({ _id: doctor, role: "doctor" });
    if (!doctorExists) {
        return next(new ErrorHander("Doctor not found", 404));
    }

    const existingAppointment = await Appointment.findOne({
        doctor,
        day,
        time
    });
    if (existingAppointment) {
        return next(new ErrorHander("This time slot is already booked", 400));
    }

    // Generate a random roomId
    const roomId = generateRoomId();

    const appointment = await Appointment.create({
        patient: req.user._id,
        doctor,
        description,
        symptoms,
        audioTranscript: audioTranscript || '', // Add audio transcript field
        day,
        time,
        roomId // Add the roomId to the appointment
    });
    const isEmail = validator.isEmail(req.user.contact);

    let message = `
    Dear ${req.user.name},
    Your appointment has been successfully scheduled with Dr. ${doctorExists.name}.

    Appointment Details:
    -------------------
    Date: ${day}
    Time: ${time}
    Doctor: Dr. ${doctorExists.name}
    Speciality: ${doctorExists.speciality}
    Description: ${description}
    Symptoms: ${symptoms}
    Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}

    Best regards,
    TeleConnect Team
    `;
    if (isEmail) {
        try {
            await sendEmail({
                email: req.user.contact,
                subject: `Welcome to TeleConnect`,
                message,
            });
            // Send separate email to doctor
            const doctorMessage = `
            Dear Dr. ${doctorExists.name},
            You have a new appointment scheduled.

            Patient Details:
            ---------------
            Patient: ${req.user.name}
            Contact: ${req.user.contact}
            Date: ${day}
            Time: ${time}
            Description: ${description}
            Symptoms: ${symptoms}
            Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}

            Best regards,
            TeleConnect Team
            `;

            await sendEmail({
                email: doctorExists.contact,
                subject: `New Appointment - ${req.user.name}`,
                message: doctorMessage,
            });
        } catch (error) {
            return next(new ErrorHander(error.message, 500));
        }
    } else {
        message = `
            TeleConnect: Appointment confirmed!
            Dr. ${doctorExists.name} (${doctorExists.speciality})
            Date: ${day}
            Time: ${time}
            Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}
            Description: ${description}
            Symptoms: ${symptoms}
        `;
        try {
            console.log(req.user);
            await sendSMS({
                phone: `+91${req.user.contact}`,
                message,
            });

        } catch (error) {
            return next(new ErrorHander(error.message, 500));
        }
    }

    // Schedule reminders 5 minutes before appointment
    const appointmentDateTime = new Date(`${day}T${time}`);
    const reminderTime = new Date(appointmentDateTime.getTime() - 5 * 60000); // 5 minutes before
    const now = new Date();

    if (reminderTime > now) {
        const timeoutDuration = reminderTime.getTime() - now.getTime();
        
        setTimeout(async () => {
            try {
                await sendReminder(req.user, {
                    day,
                    time,
                    roomId,
                });
                await sendReminder(doctorExists, {
                    day,
                    time,
                    roomId,
                });
            } catch (error) {
                console.error("Failed to send reminder:", error);
            }
        }, timeoutDuration);
    }

    res.status(201).json({
        success: true,
        appointment
    });
});

exports.allAppointments = catchAsyncError(async (req, res, next) => {
    let appointments;
    if (req.user.role == 'doctor') {
        appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name contact')
            .populate('doctor', 'name speciality availablity')
            .sort({ day: -1, time: -1 }); // Most recent appointments first
    } else {
        appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name speciality availablity')
            .populate('patient', 'name contact')
            .sort({ day: -1, time: -1 }); // Most recent appointments first
    }

    if (!appointments || appointments.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No appointments found",
            appointments: []
        });
    }

    // Format appointments for better readability
    const formattedAppointments = appointments.map(appointment => ({
        _id: appointment._id,
        patient: {
            _id: appointment.patient._id, // Use _id instead of id for consistency
            id: appointment.patient._id,  // Keep id for backward compatibility
            name: appointment.patient.name,
            contact: appointment.patient.contact
        },
        doctor: {
            _id: appointment.doctor._id,  // Use _id instead of id for consistency
            id: appointment.doctor._id,   // Keep id for backward compatibility
            name: appointment.doctor.name,
            speciality: appointment.doctor.speciality,
            availability: appointment.doctor.availablity
        },
        description: appointment.description,
        symptoms: appointment.symptoms,
        audioTranscript: appointment.audioTranscript, // Add audioTranscript to the response
        day: appointment.day,
        time: appointment.time,
        status: appointment.status,
        roomId: appointment.roomId, // Add roomId to the response
        createdAt: appointment.createdAt
    }));

    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments: formattedAppointments
    });
});

exports.deleteAppointment = catchAsyncError(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new ErrorHander('Appointment not found', 404));
    }

    // Check if user owns this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
        return next(new ErrorHander('You can only delete your own appointments', 403));
    }

    await appointment.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully'
    });
});

// Get single appointment details
exports.getSingleAppointment = catchAsyncError(async (req, res, next) => {
    if (!req.params.id) {
        return next(new ErrorHander("Please provide appointment ID", 400));
    }

    const appointment = await Appointment.findById(req.params.id)
        .populate('doctor', 'name speciality')
        .populate('patient', 'name');

    if (!appointment) {
        return next(new ErrorHander('Appointment not found', 404));
    }

    res.status(200).json({
        success: true,
        appointment
    });
});

// Get available time slots for a doctor on a specific date
exports.getAvailableSlots = catchAsyncError(async (req, res, next) => {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
        return next(new ErrorHander("Doctor ID and date are required", 400));
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return next(new ErrorHander("Invalid date format. Use YYYY-MM-DD", 400));
    }

    // Check if doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
        return next(new ErrorHander("Doctor not found", 404));
    }

    // Get all appointments for this doctor on this date
    const existingAppointments = await Appointment.find({
        doctor: doctorId,
        day: date
    }).select('time');

    // Define available time slots (9 AM to 5 PM, 30-minute intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            allSlots.push(timeString);
        }
    }

    // Filter out booked slots
    const bookedTimes = existingAppointments.map(apt => apt.time);
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.status(200).json({
        success: true,
        availableSlots,
        doctor: {
            id: doctor._id,
            name: doctor.name,
            speciality: doctor.speciality
        },
        date
    });
});

// Mark appointment as complete (Doctor only)
exports.markAppointmentComplete = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ErrorHander("Please provide appointment ID", 400));
    }

    const appointment = await Appointment.findById(id)
        .populate('patient', 'name contact')
        .populate('doctor', 'name speciality');

    if (!appointment) {
        return next(new ErrorHander('Appointment not found', 404));
    }

    // Check if the current user is the doctor for this appointment
    if (appointment.doctor._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHander('Only the assigned doctor can mark this appointment as complete', 403));
    }

    // Check if appointment is in a valid state to be completed
    if (appointment.status === 'cancelled') {
        return next(new ErrorHander('Cannot complete a cancelled appointment', 400));
    }

    if (appointment.status === 'completed') {
        return next(new ErrorHander('Appointment is already marked as completed', 400));
    }

    // Update appointment status to completed
    appointment.status = 'completed';
    await appointment.save();

    // Send notification to patient about completed appointment
    const isEmail = validator.isEmail(appointment.patient.contact);
    
    const message = `
    Dear ${appointment.patient.name},
    
    Your appointment with Dr. ${appointment.doctor.name} has been completed.
    
    Appointment Details:
    -------------------
    Date: ${appointment.day}
    Time: ${appointment.time}
    Doctor: Dr. ${appointment.doctor.name}
    Speciality: ${appointment.doctor.speciality}
    Status: Completed
    
    Thank you for choosing TeleConnect for your healthcare needs.
    
    Best regards,
    TeleConnect Team
    `;

    try {
        if (isEmail) {
            await sendEmail({
                email: appointment.patient.contact,
                subject: `Appointment Completed - Dr. ${appointment.doctor.name}`,
                message,
            });
        } else {
            const smsMessage = `TeleConnect: Appointment with Dr. ${appointment.doctor.name} completed on ${appointment.day} at ${appointment.time}. Thank you for choosing TeleConnect!`;
            await sendSMS({
                phone: `+91${appointment.patient.contact}`,
                message: smsMessage,
            });
        }
    } catch (error) {
        console.error("Failed to send completion notification:", error);
        // Don't fail the request if notification fails
    }

    res.status(200).json({
        success: true,
        message: 'Appointment marked as completed successfully',
        appointment: {
            _id: appointment._id,
            patient: {
                _id: appointment.patient._id,
                id: appointment.patient._id,
                name: appointment.patient.name,
                contact: appointment.patient.contact
            },
            doctor: {
                _id: appointment.doctor._id,
                id: appointment.doctor._id,
                name: appointment.doctor.name,
                speciality: appointment.doctor.speciality
            },
            description: appointment.description,
            symptoms: appointment.symptoms,
            day: appointment.day,
            time: appointment.time,
            status: appointment.status,
            roomId: appointment.roomId,
            createdAt: appointment.createdAt
        }
    });
});

// Schedule follow-up appointment (Doctor only)
exports.scheduleFollowUp = catchAsyncError(async (req, res, next) => {
    const { appointmentId, followUpDate, followUpTime, followUpInstructions } = req.body;

    if (!appointmentId || !followUpDate || !followUpTime) {
        return next(new ErrorHander("Please provide appointment ID, follow-up date and time", 400));
    }

    // Find the original appointment
    const originalAppointment = await Appointment.findById(appointmentId)
        .populate('patient', 'name contact')
        .populate('doctor', 'name speciality');

    if (!originalAppointment) {
        return next(new ErrorHander('Original appointment not found', 404));
    }

    // Check if the current user is the doctor for this appointment
    if (originalAppointment.doctor._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHander('Only the assigned doctor can schedule follow-up', 403));
    }

    // Validate follow-up date is in the future
    const followUpDateTime = new Date(`${followUpDate}T${followUpTime}`);
    if (followUpDateTime <= new Date()) {
        return next(new ErrorHander('Follow-up date must be in the future', 400));
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
        doctor: originalAppointment.doctor._id,
        day: followUpDate,
        time: followUpTime
    });

    if (existingAppointment) {
        return next(new ErrorHander('This time slot is already booked', 400));
    }

    // Generate a new room ID for follow-up appointment
    const roomId = generateRoomId();

    // Create follow-up appointment
    const followUpAppointment = await Appointment.create({
        patient: originalAppointment.patient._id,
        doctor: originalAppointment.doctor._id,
        description: `Follow-up appointment for: ${originalAppointment.description}`,
        symptoms: originalAppointment.symptoms,
        day: followUpDate,
        time: followUpTime,
        roomId,
        followUpInstructions: followUpInstructions || '',
        status: 'confirmed'
    });

    // Update original appointment with follow-up information
    originalAppointment.followUpDate = followUpDate;
    originalAppointment.followUpTime = followUpTime;
    originalAppointment.followUpInstructions = followUpInstructions || '';
    await originalAppointment.save();

    // Send notification to patient about follow-up appointment
    const isEmail = validator.isEmail(originalAppointment.patient.contact);
    
    const message = `
    Dear ${originalAppointment.patient.name},
    
    Dr. ${originalAppointment.doctor.name} has scheduled a follow-up appointment for you.
    
    Follow-up Appointment Details:
    -----------------------------
    Date: ${followUpDate}
    Time: ${followUpTime}
    Doctor: Dr. ${originalAppointment.doctor.name}
    Speciality: ${originalAppointment.doctor.speciality}
    Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}
    
    ${followUpInstructions ? `Special Instructions: ${followUpInstructions}` : ''}
    
    Please make sure to attend this follow-up appointment for your continued care.
    
    Best regards,
    TeleConnect Team
    `;

    try {
        if (isEmail) {
            await sendEmail({
                email: originalAppointment.patient.contact,
                subject: `Follow-up Appointment Scheduled - Dr. ${originalAppointment.doctor.name}`,
                message,
            });
        } else {
            const smsMessage = `TeleConnect: Follow-up appointment with Dr. ${originalAppointment.doctor.name} scheduled for ${followUpDate} at ${followUpTime}. Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}`;
            await sendSMS({
                phone: `+91${originalAppointment.patient.contact}`,
                message: smsMessage,
            });
        }

        // Schedule follow-up reminder 24 hours before appointment
        const reminderTime = new Date(followUpDateTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
        const now = new Date();

        if (reminderTime > now) {
            const timeoutDuration = reminderTime.getTime() - now.getTime();
            
            setTimeout(async () => {
                try {
                    const reminderMessage = `
                    Dear ${originalAppointment.patient.name},
                    
                    This is a reminder that you have a follow-up appointment tomorrow.
                    
                    Appointment Details:
                    -------------------
                    Date: ${followUpDate}
                    Time: ${followUpTime}
                    Doctor: Dr. ${originalAppointment.doctor.name}
                    Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}
                    
                    Please be ready 5 minutes before your scheduled time.
                    
                    Best regards,
                    TeleConnect Team
                    `;

                    if (isEmail) {
                        await sendEmail({
                            email: originalAppointment.patient.contact,
                            subject: `Reminder: Follow-up Appointment Tomorrow`,
                            message: reminderMessage,
                        });
                    } else {
                        await sendSMS({
                            phone: `+91${originalAppointment.patient.contact}`,
                            message: `TeleConnect Reminder: Follow-up appointment with Dr. ${originalAppointment.doctor.name} tomorrow at ${followUpTime}. Room: ${roomId}`,
                        });
                    }

                    // Mark notification as sent
                    await Appointment.findByIdAndUpdate(followUpAppointment._id, {
                        followUpNotificationSent: true
                    });
                } catch (error) {
                    console.error("Failed to send follow-up reminder:", error);
                }
            }, timeoutDuration);
        }

    } catch (error) {
        console.error("Failed to send follow-up notification:", error);
        // Don't fail the request if notification fails
    }

    res.status(201).json({
        success: true,
        message: 'Follow-up appointment scheduled successfully',
        followUpAppointment: {
            _id: followUpAppointment._id,
            patient: {
                _id: originalAppointment.patient._id,
                name: originalAppointment.patient.name,
                contact: originalAppointment.patient.contact
            },
            doctor: {
                _id: originalAppointment.doctor._id,
                name: originalAppointment.doctor.name,
                speciality: originalAppointment.doctor.speciality
            },
            description: followUpAppointment.description,
            symptoms: followUpAppointment.symptoms,
            day: followUpAppointment.day,
            time: followUpAppointment.time,
            status: followUpAppointment.status,
            roomId: followUpAppointment.roomId,
            followUpInstructions: followUpAppointment.followUpInstructions,
            createdAt: followUpAppointment.createdAt
        }
    });
});