const express = require('express');
const { registerUser, loginUser, getUserDetails, logout, getAllUsers, getSingleUser, updateUserRole, deleteUser, getAllDoctors, addMedicalHistory, getMedicalHistory } = require('../controller/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router()


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)


router.route('/doctors').get(getAllDoctors)
router.route('/me').get(isAuthenticatedUser, getUserDetails)

router.route("/medical-history")
    .post(isAuthenticatedUser, addMedicalHistory)

router.route("/medical-history/:userId")
    .get(isAuthenticatedUser, getMedicalHistory)

// router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
// router.route('/admin/user/:id')
//     .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
//     .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
//     .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)


module.exports = router