const express = require('express');
const {
    createTicket,
    getUserTickets,
    getTicketDetails,
    getAllTickets,
    updateTicketStatus,
    deleteTicket,
    getTicketStats
} = require('../controller/ticketController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// User routes - for patients to manage their tickets
router.route('/create').post(isAuthenticatedUser, createTicket);
router.route('/my-tickets').get(isAuthenticatedUser, getUserTickets);
router.route('/details/:id').get(isAuthenticatedUser, getTicketDetails);

// Admin routes - for admin to manage all tickets
router.route('/admin/all').get(isAuthenticatedUser, authorizeRoles('admin'), getAllTickets);
router.route('/admin/stats').get(isAuthenticatedUser, authorizeRoles('admin'), getTicketStats);
router.route('/admin/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateTicketStatus)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteTicket);

module.exports = router;
