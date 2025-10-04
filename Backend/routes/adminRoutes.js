const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const Pharmacy = require('../models/pharmacyModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Medicine = require('../models/medicineModel');

// Get all pharmacies (Admin only)
router.get('/pharmacies', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find()
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            pharmacies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all orders (Admin only)
router.get('/orders', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('pharmacyId', 'name')
            .populate('items.medicine', 'name')
            .sort({ createdAt: -1 })
            .limit(100);
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update pharmacy status (Admin only)
router.put('/pharmacy/:id/status', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['pending', 'verified', 'rejected', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const pharmacy = await Pharmacy.findById(id);
        if (!pharmacy) {
            return res.status(404).json({
                success: false,
                message: 'Pharmacy not found'
            });
        }

        pharmacy.verificationStatus = status;
        await pharmacy.save();

        res.status(200).json({
            success: true,
            message: 'Pharmacy status updated successfully',
            pharmacy
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get dashboard analytics (Admin only)
router.get('/analytics', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const totalPharmacies = await Pharmacy.countDocuments();
        const verifiedPharmacies = await Pharmacy.countDocuments({ verificationStatus: 'verified' });
        const pendingPharmacies = await Pharmacy.countDocuments({ verificationStatus: 'pending' });
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'patient' });
        const totalMedicines = await Medicine.countDocuments();

        // Get recent statistics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentOrders = await Order.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo } 
        });

        const recentUsers = await User.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo },
            role: 'patient'
        });

        // Get revenue data
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const monthlyRevenue = await Order.aggregate([
            { 
                $match: { 
                    status: 'delivered',
                    createdAt: { $gte: thirtyDaysAgo }
                } 
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                totalPharmacies,
                verifiedPharmacies,
                pendingPharmacies,
                totalOrders,
                totalUsers,
                totalMedicines,
                recentOrders,
                recentUsers,
                totalRevenue: totalRevenue[0]?.total || 0,
                monthlyRevenue: monthlyRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get order details (Admin only)
router.get('/order/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('pharmacyId', 'name address contactInfo')
            .populate('items.medicine', 'name manufacturer image');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Admin registration route
router.post('/register', async (req, res) => {
    try {
        const { name, contact, password, adminKey } = req.body;

        // Verify admin key for security (should be set in environment variables)
        if (adminKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin key'
            });
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        const admin = await User.create({
            name,
            contact,
            password,
            role: 'admin',
            avatar: {
                public_id: "",
                url: "",
            }
        });

        // Generate JWT token
        const token = admin.getJWTToken();

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: {
                _id: admin._id,
                name: admin.name,
                contact: admin.contact,
                role: admin.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Admin login route
router.post('/login', async (req, res) => {
    try {
        const { contact, password } = req.body;
        
        if (!contact || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide contact and password'
            });
        }

        const admin = await User.findOne({ contact, role: 'admin' }).select('+password');
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        const isPasswordMatched = await admin.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Generate JWT token
        const token = admin.getJWTToken();

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            admin: {
                _id: admin._id,
                name: admin.name,
                contact: admin.contact,
                role: admin.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all users (Admin only)
router.get('/users', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, role } = req.query;
        const query = {};
        
        if (role && ['patient', 'pharmacist', 'doctor'].includes(role)) {
            query.role = role;
        } else {
            query.role = { $in: ['patient', 'doctor', 'pharmacist'] }; // Exclude admin from list
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all doctors (Admin only)
router.get('/doctors', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' })
            .select('-password')
            .sort({ createdAt: -1 });

        const formattedDoctors = doctors.map(doctor => ({
            _id: doctor._id,
            name: doctor.name,
            contact: doctor.contact,
            speciality: doctor.speciality,
            availability: doctor.availablity,
            avatar: doctor.avatar,
            createdAt: doctor.createdAt
        }));

        res.status(200).json({
            success: true,
            count: doctors.length,
            doctors: formattedDoctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all patients (Admin only)
router.get('/patients', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const query = { role: 'patient' };
        
        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { contact: { $regex: search, $options: 'i' } }
            ];
        }

        const patients = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        const formattedPatients = patients.map(patient => ({
            _id: patient._id,
            name: patient.name,
            contact: patient.contact,
            avatar: patient.avatar,
            createdAt: patient.createdAt,
            medicalHistoryCount: patient.medicalHistory ? patient.medicalHistory.length : 0
        }));

        res.status(200).json({
            success: true,
            patients: formattedPatients,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all pharmacists (Admin only)
router.get('/pharmacists', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const query = { role: 'pharmacist' };
        
        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { contact: { $regex: search, $options: 'i' } }
            ];
        }

        const pharmacists = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        const formattedPharmacists = pharmacists.map(pharmacist => ({
            _id: pharmacist._id,
            name: pharmacist.name,
            contact: pharmacist.contact,
            avatar: pharmacist.avatar,
            createdAt: pharmacist.createdAt,
            availability: pharmacist.availablity
        }));

        res.status(200).json({
            success: true,
            pharmacists: formattedPharmacists,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update user status (Admin only) - Can be used for patients, doctors, pharmacists
router.put('/user/:id/status', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.availablity = availability;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User status updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                contact: user.contact,
                role: user.role,
                availability: user.availablity
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete user (Admin only) - For patients, doctors, pharmacists
router.delete('/user/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Don't allow deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: `${user.role} deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get dashboard statistics (Admin only)
router.get('/stats', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalPharmacists = await User.countDocuments({ role: 'pharmacist' });
        const totalPharmacies = await Pharmacy.countDocuments();
        
        // Get recent registrations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentUsers = await User.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo },
            role: 'patient'
        });
        
        const recentDoctors = await User.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo },
            role: 'doctor'
        });

        const recentPharmacists = await User.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo },
            role: 'pharmacist'
        });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalDoctors,  
                totalPharmacists,
                totalPharmacies,
                recentUsers,
                recentDoctors,
                recentPharmacists,
                total: totalUsers + totalDoctors + totalPharmacists
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete user (Admin only)
router.delete('/user/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: `${user.role} deleted successfully`,
            deletedUser: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Block/Unblock user (Admin only)
router.patch('/user/:id/status', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const { isBlocked } = req.body;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from blocking themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot block/unblock your own account'
            });
        }

        // Update user status
        user.isBlocked = isBlocked;
        await user.save();

        res.status(200).json({
            success: true,
            message: `${user.role} ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Bulk action - Delete multiple users (Admin only)
router.post('/users/bulk-delete', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { userIds } = req.body;
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid user IDs'
            });
        }

        // Remove current admin from the list to prevent self-deletion
        const filteredUserIds = userIds.filter(id => id !== req.user.id);
        
        if (filteredUserIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete selected users'
            });
        }

        // Delete users
        const result = await User.deleteMany({ _id: { $in: filteredUserIds } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} users deleted successfully`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Bulk action - Block/Unblock multiple users (Admin only)
router.patch('/users/bulk-status', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { userIds, isBlocked } = req.body;
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid user IDs'
            });
        }

        // Remove current admin from the list to prevent self-blocking
        const filteredUserIds = userIds.filter(id => id !== req.user.id);
        
        if (filteredUserIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify selected users'
            });
        }

        // Update users status
        const result = await User.updateMany(
            { _id: { $in: filteredUserIds } },
            { isBlocked: isBlocked }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} users ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
