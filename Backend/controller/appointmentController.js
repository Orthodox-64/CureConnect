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
    const { doctor, description, day, time } = req.body;

    if (!doctor || !description || !day || !time) {
        return next(new ErrorHander("Please provide all required fields", 400));
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
            await sendEmail({
                email: doctorExists.email,
                subject: `Welcome to TeleConnect`,
                message,
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
            id: appointment.patient._id,
            name: appointment.patient.name,
            contact: appointment.patient.contact
        },
        doctor: {
            id: appointment.doctor._id,
            name: appointment.doctor.name,
            speciality: appointment.doctor.speciality,
            availability: appointment.doctor.availablity
        },
        description: appointment.description,
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