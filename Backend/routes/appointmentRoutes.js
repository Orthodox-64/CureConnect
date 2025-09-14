const express = require('express')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { newAppointment, allAppointments, deleteAppointment, getSingleAppointment, getAvailableSlots } = require('../controller/appointmentController');

const router = express.Router();

router.route("/appointment/new").post(isAuthenticatedUser, newAppointment)
router.route("/appointment/my").get(isAuthenticatedUser, allAppointments)
router.route("/appointment/slots/:doctorId/:date").get(getAvailableSlots)
router.route("/appointment/:id")
    .get(isAuthenticatedUser, getSingleAppointment)
    .delete(isAuthenticatedUser, deleteAppointment)

module.exports = router