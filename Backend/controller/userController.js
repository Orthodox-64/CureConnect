const ErrorHander = require("../utils/errorHander");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");


// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
        avatar: {
            public_id: "This is sample image",
            url: "PicURL",
        },
    });

    const message = `Welcome to TeleConnect ${name}`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Welcome to TeleConnect`,
            message,
        });
    } catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
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
        email: doctor.email,
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
        email: req.body.email,
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