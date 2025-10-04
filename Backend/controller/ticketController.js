const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHander');
const sendEmail = require('../utils/sendEmail');

// Create a new ticket
exports.createTicket = catchAsyncError(async (req, res, next) => {
    const { subject, description, category, priority } = req.body;

    // Validate required fields
    if (!subject || !description) {
        return next(new ErrorHandler('Subject and description are required', 400));
    }

    const ticket = await Ticket.create({
        userId: req.user._id,
        subject,
        description,
        category: category || 'General Inquiry',
        priority: priority || 'Medium'
    });

    // Populate user details
    await ticket.populate('userId', 'name email contact');

    // Send email notification to admin (if admin email exists)
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cureconnect.com';
        const emailContent = `
            <h2>New Support Ticket Created</h2>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>From:</strong> ${ticket.userId.name} (${ticket.userId.email})</p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p><strong>Category:</strong> ${ticket.category}</p>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p><strong>Description:</strong></p>
            <p>${ticket.description}</p>
            <p><strong>Created At:</strong> ${ticket.createdAt}</p>
            <br>
            <p>Please login to the admin panel to review and respond to this ticket.</p>
        `;

        await sendEmail({
            email: adminEmail,
            subject: `New Support Ticket - ${ticket.ticketId}`,
            html: emailContent
        });
    } catch (emailError) {
        console.log('Email notification error:', emailError);
        // Don't fail the ticket creation if email fails
    }

    res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        ticket
    });
});

// Get user's tickets
exports.getUserTickets = catchAsyncError(async (req, res, next) => {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { userId: req.user._id };
    
    if (status && status !== 'all') {
        query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const tickets = await Ticket.find(query)
        .populate('userId', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalTickets = await Ticket.countDocuments(query);

    res.status(200).json({
        success: true,
        tickets,
        totalTickets,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTickets / limit)
    });
});

// Get single ticket details
exports.getTicketDetails = catchAsyncError(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id)
        .populate('userId', 'name email contact')
        .populate('assignedTo', 'name email')
        .populate('adminNotes.addedBy', 'name email');

    if (!ticket) {
        return next(new ErrorHandler('Ticket not found', 404));
    }

    // Check if user owns the ticket or is admin
    if (ticket.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied', 403));
    }

    res.status(200).json({
        success: true,
        ticket
    });
});

// Admin: Get all tickets
exports.getAllTickets = catchAsyncError(async (req, res, next) => {
    const { status, priority, category, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
        query.status = status;
    }
    
    if (priority && priority !== 'all') {
        query.priority = priority;
    }
    
    if (category && category !== 'all') {
        query.category = category;
    }

    if (search) {
        query.$or = [
            { ticketId: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;
    
    const tickets = await Ticket.find(query)
        .populate('userId', 'name email contact')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalTickets = await Ticket.countDocuments(query);

    // Get ticket stats
    const stats = await Ticket.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const ticketStats = {
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0
    };

    stats.forEach(stat => {
        switch(stat._id) {
            case 'Open':
                ticketStats.open = stat.count;
                break;
            case 'In Progress':
                ticketStats.inProgress = stat.count;
                break;
            case 'Resolved':
                ticketStats.resolved = stat.count;
                break;
            case 'Closed':
                ticketStats.closed = stat.count;
                break;
        }
    });

    res.status(200).json({
        success: true,
        tickets,
        totalTickets,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTickets / limit),
        stats: ticketStats
    });
});

// Admin: Update ticket status
exports.updateTicketStatus = catchAsyncError(async (req, res, next) => {
    const { status, assignedTo, adminNote } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
        return next(new ErrorHandler('Ticket not found', 404));
    }

    // Update status if provided
    if (status) {
        ticket.status = status;
    }

    // Update assigned admin if provided
    if (assignedTo) {
        ticket.assignedTo = assignedTo;
    }

    // Add admin note if provided
    if (adminNote) {
        ticket.adminNotes.push({
            note: adminNote,
            addedBy: req.user._id,
            addedAt: new Date()
        });
    }

    await ticket.save();
    
    // Populate for response
    await ticket.populate('userId', 'name email');
    await ticket.populate('assignedTo', 'name email');

    // Send email notification to user about status update
    try {
        const emailContent = `
            <h2>Ticket Status Update</h2>
            <p>Dear ${ticket.userId.name},</p>
            <p>Your support ticket has been updated:</p>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p><strong>New Status:</strong> ${ticket.status}</p>
            ${adminNote ? `<p><strong>Admin Note:</strong> ${adminNote}</p>` : ''}
            <p><strong>Updated At:</strong> ${new Date()}</p>
            <br>
            <p>You can view your ticket details by logging into your account.</p>
            <p>Thank you for using CureConnect!</p>
        `;

        await sendEmail({
            email: ticket.userId.email,
            subject: `Ticket Update - ${ticket.ticketId}`,
            html: emailContent
        });
    } catch (emailError) {
        console.log('Email notification error:', emailError);
    }

    res.status(200).json({
        success: true,
        message: 'Ticket updated successfully',
        ticket
    });
});

// Admin: Delete ticket
exports.deleteTicket = catchAsyncError(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
        return next(new ErrorHandler('Ticket not found', 404));
    }

    await ticket.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Ticket deleted successfully'
    });
});

// Get ticket statistics
exports.getTicketStats = catchAsyncError(async (req, res, next) => {
    const stats = await Ticket.aggregate([
        {
            $group: {
                _id: null,
                totalTickets: { $sum: 1 },
                openTickets: {
                    $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] }
                },
                inProgressTickets: {
                    $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
                },
                resolvedTickets: {
                    $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
                },
                closedTickets: {
                    $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
                }
            }
        }
    ]);

    const categoryStats = await Ticket.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    const priorityStats = await Ticket.aggregate([
        {
            $group: {
                _id: '$priority',
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        stats: stats[0] || {
            totalTickets: 0,
            openTickets: 0,
            inProgressTickets: 0,
            resolvedTickets: 0,
            closedTickets: 0
        },
        categoryStats,
        priorityStats
    });
});
