const ErrorHander = require("../utils/errorHander");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");
const validator = require("validator");
const sendSMS = require("../utils/sendSMS");
const { uploadSingle } = require("../utils/cloudinary");


// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, contact, password, role, speciality } = req.body;

    // Handle avatar upload for doctors
    let avatarData = {};
    if (req.file && role === 'doctor') {
        avatarData = {
            public_id: req.file.public_id,
            url: req.file.secure_url
        };
    } else if (req.body.avatar && role === 'doctor') {
        // Handle client-side uploaded avatar data
        try {
            const parsedAvatar = JSON.parse(req.body.avatar);
            avatarData = {
                public_id: parsedAvatar.public_id,
                url: parsedAvatar.url
            };
        } catch (error) {
            console.error('Error parsing avatar data:', error);
        }
    }

    const userData = {
        name,
        contact,
        password,
        role,
        avatar: avatarData.public_id ? avatarData : {
            public_id: "",
            url: "",
        },
    };

    // Add speciality for doctors
    if (role === 'doctor' && speciality) {
        userData.speciality = speciality;
    }

    const user = await User.create(userData);

    // Check if contact is email or phone
    const isEmail = validator.isEmail(contact);
    
    if (isEmail) {
        const message = `Welcome to CureConnect ${name}`;
        try {
            await sendEmail({
                email: contact,
                subject: `Welcome to CureConnect`,
                message,
            });
        } catch (error) {
            return next(new ErrorHander(error.message, 500));
        }
    } else {
        const message = `Welcome to CureConnect ${name}`;
        try {
            let sms = await sendSMS({
                phone: `+91${contact}`,
                message,
            });
            console.log(sms);
        } catch (error) {
            return next(new ErrorHander(error.message, 500));
        }
    }

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { contact, password } = req.body;
    
    if (!contact || !password) {
        return next(new ErrorHander("Please Enter Contact & Password", 400));
    }

    const user = await User.findOne({ contact }).select("+password");
    if (!user) {
        return next(new ErrorHander("Invalid credentials", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid credentials", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Get User Detail
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    if (!req.user._id) {
        return next(new ErrorHander("Login", 401));
    }
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user,
    });
});

// Update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Update User Details
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Get all Doctors
exports.getAllDoctors = catchAsyncError(async (req, res, next) => {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    // If no doctors found
    if (!doctors || doctors.length === 0) {
        return next(new ErrorHander("No doctors found", 404));
    }

    // Format the response data
    const formattedDoctors = doctors.map(doctor => ({
        _id: doctor._id,
        name: doctor.name,
        contact: doctor.contact,
        speciality: doctor.speciality,
        availability: doctor.availablity, // Note: Fix typo in model from 'availablity' to 'availability'
        avatar: doctor.avatar,
        createdAt: doctor.createdAt
    }));


    res.status(200).json({
        success: true,
        count: doctors.length,
        doctors: formattedDoctors
    });
})

// Get single users --> Admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHander(`User not found with id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user: user,
    })
})

// update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        contact: req.body.contact,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});




// Delete User --Admin

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});


// Add Medical History with Image
exports.addMedicalHistory = catchAsyncError(async (req, res, next) => {
    if (!req.user._id) {
        return next(new ErrorHander("Please login to add medical history", 401));
    }

    const { analysis, url } = req.body;

    if (!analysis) {
        return next(new ErrorHander("Analysis is required", 400));
    }

    if (!url) {
        return next(new ErrorHander("Image details are required", 400));
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    user.medicalHistory.push({
        analysis,
        image: {
            url
        },
        createdAt: new Date()
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: "Medical history added successfully",
        medicalHistory: user.medicalHistory
    });
});

// Get Medical History
exports.getMedicalHistory = catchAsyncError(async (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
        return next(new ErrorHander("User ID is required", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Check if the requesting user is authorized to view this medical history
    if (req.user.role !== "doctor" && req.user._id.toString() !== userId.toString()) {
        return next(new ErrorHander("Not authorized to view this medical history", 403));
    }

    res.status(200).json({
        success: true,
        medicalHistory: user.medicalHistory
    });
});

// Notify patient when doctor joins video call
// POST /api/v1/notify-doctor-joined
// Body: { patientId: string, roomId: string }
// Headers: Authorization: Bearer <doctor_token>
exports.notifyDoctorJoined = catchAsyncError(async (req, res, next) => {
    const { patientId, roomId } = req.body;
    const doctor = req.user;

    // Validate required fields
    if (!patientId || !roomId) {
        return next(new ErrorHander("Patient ID and Room ID are required", 400));
    }

    // Find the patient
    const patient = await User.findById(patientId);
    if (!patient) {
        return next(new ErrorHander("Patient not found", 404));
    }

    // Validate patient email
    if (!validator.isEmail(patient.contact)) {
        return next(new ErrorHander("Patient email is not valid", 400));
    }

    // Create video call link
    const videoCallLink = `https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}`;

    // Prepare email content
    const emailOptions = {
        email: patient.contact,
        subject: `🎥 Doctor ${doctor.name} has joined your video consultation`,
        message: `
Dear ${patient.name},

Great news! Dr. ${doctor.name} has joined your video consultation and is ready to provide medical assistance.

📋 Consultation Details:
- Doctor: Dr. ${doctor.name}
- Speciality: ${doctor.speciality || 'General Medicine'}
- Room ID: ${roomId}
- Join Time: ${new Date().toLocaleString()}

🎥 Join Video Call:
Click the link below to join your video consultation:
${videoCallLink}

📱 Alternative Access:
If the link doesn't work, you can also access the video call by:
1. Going to the telemedicine section
2. Clicking on "Video Consultation"
3. Using Room ID: ${roomId}

⏰ Important Notes:
- Please join the call as soon as possible
- Ensure you have a stable internet connection
- Have your medical documents ready if needed
- The consultation will be recorded for quality purposes

🆘 Technical Support:
If you experience any technical difficulties, please contact our support team immediately.

We hope this consultation helps address your health concerns effectively.

Best regards,
AgPatil Healthcare Team

---
This is an automated notification. Please do not reply to this email.
For support, contact: ${process.env.SUPPORT_EMAIL || 'support@agpatil.com'}
        `.trim()
    };

    try {
        // Send email notification
        await sendEmail(emailOptions);

        console.log(`✅ Doctor join notification sent to patient ${patient.name} (${patient.contact})`);

        res.status(200).json({
            success: true,
            message: "Patient notification sent successfully",
            data: {
                patientName: patient.name,
                patientEmail: patient.contact,
                doctorName: doctor.name,
                roomId: roomId,
                notificationTime: new Date()
            }
        });
    } catch (error) {
        console.error("❌ Failed to send doctor join notification:", error);
        return next(new ErrorHander("Failed to send notification email", 500));
    }
});

// Get complete patient medical data for QR code
exports.getCompletePatientData = catchAsyncError(async (req, res, next) => {
    const { patientId } = req.params;
    
    // Find the patient with all related data
    const patient = await User.findById(patientId)
        .populate('medicalHistory')
        .populate({
            path: 'appointments',
            populate: {
                path: 'doctor',
                select: 'name speciality'
            }
        })
        .populate({
            path: 'prescriptions',
            populate: {
                path: 'doctor',
                select: 'name speciality'
            }
        });

    if (!patient) {
        return next(new ErrorHander("Patient not found", 404));
    }

    // Create comprehensive data structure
    const completeData = {
        patientId: patient._id,
        name: patient.name,
        email: patient.contact,
        role: patient.role,
        speciality: patient.speciality || null,
        createdAt: patient.createdAt,
        lastUpdated: new Date().toISOString(),
        system: 'AgPatil Healthcare System',
        medicalHistory: patient.medicalHistory || [],
        appointments: patient.appointments || [],
        prescriptions: patient.prescriptions || [],
        avatar: patient.avatar || null,
        isActive: patient.isActive !== undefined ? patient.isActive : true
    };

    res.status(200).json({
        success: true,
        data: completeData
    });
});