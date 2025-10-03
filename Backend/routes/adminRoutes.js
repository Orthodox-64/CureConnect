const express = require('express');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const Pharmacy = require('../models/pharmacyModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Medicine = require('../models/medicineModel');

// Get all pharmacies (Admin only)
router.get('/pharmacies', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
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
router.get('/orders', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
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
router.put('/pharmacy/:id/status', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
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
router.get('/analytics', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
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
router.get('/order/:id', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
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

// Get all users (Admin only)
router.get('/users', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, role } = req.query;
        const query = {};
        
        if (role && ['patient', 'pharmacist', 'doctor'].includes(role)) {
            query.role = role;
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
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
