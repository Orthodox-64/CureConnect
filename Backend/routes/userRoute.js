const express = require('express');
const { registerUser, loginUser, getUserDetails, logout, getAllUsers, getSingleUser, updateUserRole, deleteUser, getAllDoctors, addMedicalHistory, getMedicalHistory, notifyDoctorJoined, getCompletePatientData } = require('../controller/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { createPrescription, getPrescriptions, getSinglePrescription, generatePrescriptionPDF } = require('../controller/prescriptionController');
const { uploadSingle } = require('../utils/cloudinary');

const router = express.Router()


router.route('/register').post(uploadSingle, registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)


router.route('/doctors').get(getAllDoctors)
router.route('/me').get(isAuthenticatedUser, getUserDetails)

router.route("/medical-history")
    .post(isAuthenticatedUser, addMedicalHistory)

router.route("/medical-history/:userId")
    .get(isAuthenticatedUser, getMedicalHistory)

router.route("/prescription/new")
    .post(isAuthenticatedUser, authorizeRoles("doctor"), createPrescription);

router.route("/prescriptions")
    .get(isAuthenticatedUser, getPrescriptions);

router.route("/prescription/:id")
    .get(isAuthenticatedUser, getSinglePrescription);

router.route("/prescription/:id/pdf")
    .get(isAuthenticatedUser, generatePrescriptionPDF);

router.route("/notify-doctor-joined")
    .post(isAuthenticatedUser, authorizeRoles("doctor"), notifyDoctorJoined);

router.route("/patient/:patientId/complete-data")
    .get(isAuthenticatedUser, getCompletePatientData);


// router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
// router.route('/admin/user/:id')
//     .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
//     .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
//     .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)


module.exports = router