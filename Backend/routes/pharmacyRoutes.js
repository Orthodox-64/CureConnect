const express = require('express');
const {
    registerPharmacy,
    quickPharmacySetup,
    getPharmacyDetails,
    getMyPharmacy,
    updatePharmacy,
    getAllPharmacies,
    addMedicine,
    getPharmacyMedicines,
    updateMedicine,
    deleteMedicine,
    getPharmacyStats,
    bulkUploadMedicines,
    bulkUpdateStock,
    getLowStockMedicines,
    getExpiringMedicines,
    getPharmacyReport,
    searchPharmacyMedicines
} = require('../controller/pharmacyController');
const {
    getAllMedicines,
    getMedicineById,
    searchMedicines,
    getMedicineCategories,
    getFeaturedMedicines
} = require('../controller/medicineController');
const {
    createOrder,
    getMyOrders,
    getPharmacyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    rateOrder
} = require('../controller/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../utils/cloudinary');

const router = express.Router();

// Pharmacy routes
router.route('/pharmacy/register')
    .post(isAuthenticatedUser, uploadSingle, registerPharmacy);

// Quick setup (dev convenience)
router.route('/pharmacy/quick-setup')
    .post(isAuthenticatedUser, quickPharmacySetup);

router.route('/pharmacy/my')
    .get(isAuthenticatedUser, authorizeRoles('pharmacist'), getMyPharmacy)
    .put(isAuthenticatedUser, authorizeRoles('pharmacist'), uploadSingle, updatePharmacy);

router.route('/pharmacy/stats')
    .get(isAuthenticatedUser, authorizeRoles('pharmacist'), getPharmacyStats);

router.route('/pharmacies')
    .get(getAllPharmacies);

router.route('/pharmacy/:id')
    .get(getPharmacyDetails);

// Medicine management routes (for pharmacists)
router.route('/pharmacy/medicines')
    .post(isAuthenticatedUser, authorizeRoles('pharmacist'), uploadMultiple, addMedicine);

router.route('/pharmacy/medicine/:id')
    .put(isAuthenticatedUser, authorizeRoles('pharmacist'), uploadMultiple, updateMedicine)
    .delete(isAuthenticatedUser, authorizeRoles('pharmacist'), deleteMedicine);

// Public medicine routes
router.route('/medicines')
    .get(getAllMedicines);

router.route('/medicines/search')
    .get(searchMedicines);

router.route('/medicines/categories')
    .get(getMedicineCategories);

router.route('/medicines/featured')
    .get(getFeaturedMedicines);

router.route('/medicine/:id')
    .get(getMedicineById);

router.route('/pharmacy/:pharmacyId/medicines')
    .get(getPharmacyMedicines);

// Order routes
router.route('/orders')
    .post(isAuthenticatedUser, uploadMultiple, createOrder);

router.route('/orders/my')
    .get(isAuthenticatedUser, getMyOrders);

router.route('/pharmacy/orders')
    .get(isAuthenticatedUser, authorizeRoles('pharmacist'), getPharmacyOrders);

router.route('/order/:id')
    .get(isAuthenticatedUser, getOrderById);

router.route('/order/:id/status')
    .put(isAuthenticatedUser, authorizeRoles('pharmacist'), updateOrderStatus);

router.route('/order/:id/cancel')
    .put(isAuthenticatedUser, cancelOrder);

router.route('/order/:id/rate')
    .put(isAuthenticatedUser, rateOrder);

// Advanced pharmacist routes
router.route('/pharmacy/medicines/bulk-upload')
    .post(isAuthenticatedUser, authorizeRoles('pharmacist'), bulkUploadMedicines);

router.route('/pharmacy/medicines/bulk-stock-update')
    .put(isAuthenticatedUser, authorizeRoles('pharmacist'), bulkUpdateStock);

router.route('/pharmacy/medicines/low-stock')
    .get(isAuthenticatedUser, authorizeRoles('pharmacist'), getLowStockMedicines);

router.route('/pharmacy/medicines/expiring')
    .get(isAuthenticatedUser, authorizeRoles('pharmacist'), getExpiringMedicines);

router.route('/pharmacy/medicines/search')
    .get(isAuthenticatedUser, authorizeRoles('pharmacist'), searchPharmacyMedicines);

router.route('/pharmacy/report')
    .get(isAuthenticatedUser, authorizeRoles('pharmacist'), getPharmacyReport);

module.exports = router;
