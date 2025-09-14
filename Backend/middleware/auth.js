const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    const { token } = req.cookies;
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
    console.log('Origin:', req.get('origin'));
    console.log('Request URL:', req.originalUrl);
    
    if (!token) {
        return next(new ErrorHander("Please login to access this feature", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decodedData);
        
        const user = await User.findById(decodedData.id);
        if (!user) {
            return next(new ErrorHander("User not found", 404));
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return next(new ErrorHander("Invalid or expired token", 401));
    }
})

exports.authorizeRoles = (...roles) => {
    return catchAsyncError(async(req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHander(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            )
        }
        next();
    })
}
