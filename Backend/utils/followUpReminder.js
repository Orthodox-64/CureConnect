const cron = require('node-cron');
const Appointment = require('../models/appointmentModel');
const sendEmail = require('./sendEmail');
const sendSMS = require('./sendSMS');
const validator = require('validator');

// Function to send follow-up reminders
const sendFollowUpReminders = async () => {
    try {
        console.log('Checking for follow-up appointments to remind...');
        
        // Get tomorrow's date in YYYY-MM-DD format
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        // Find appointments with follow-up scheduled for tomorrow that haven't been reminded yet
        const appointmentsWithFollowUp = await Appointment.find({
            day: tomorrowStr,
            followUpNotificationSent: { $ne: true },
            status: { $in: ['pending', 'confirmed'] }
        })
        .populate('patient', 'name contact')
        .populate('doctor', 'name speciality');

        if (appointmentsWithFollowUp.length === 0) {
            console.log('No follow-up reminders to send for tomorrow.');
            return;
        }

        console.log(`Found ${appointmentsWithFollowUp.length} follow-up appointments to remind.`);

        for (const appointment of appointmentsWithFollowUp) {
            try {
                const isEmail = validator.isEmail(appointment.patient.contact);
                
                const message = `
                Dear ${appointment.patient.name},
                
                This is a reminder that you have a follow-up appointment tomorrow.
                
                Appointment Details:
                -------------------
                Date: ${appointment.day}
                Time: ${appointment.time}
                Doctor: Dr. ${appointment.doctor.name}
                Speciality: ${appointment.doctor.speciality}
                Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${appointment.roomId}
                
                ${appointment.followUpInstructions ? `Special Instructions: ${appointment.followUpInstructions}` : ''}
                
                Please be ready 5 minutes before your scheduled time.
                
                Best regards,
                TeleConnect Team
                `;

                if (isEmail) {
                    await sendEmail({
                        email: appointment.patient.contact,
                        subject: `Reminder: Follow-up Appointment Tomorrow - Dr. ${appointment.doctor.name}`,
                        message,
                    });
                } else {
                    const smsMessage = `TeleConnect Reminder: Follow-up appointment with Dr. ${appointment.doctor.name} tomorrow at ${appointment.time}. Room: ${appointment.roomId}`;
                    await sendSMS({
                        phone: `+91${appointment.patient.contact}`,
                        message: smsMessage,
                    });
                }

                // Mark notification as sent
                await Appointment.findByIdAndUpdate(appointment._id, {
                    followUpNotificationSent: true
                });

                console.log(`Follow-up reminder sent to ${appointment.patient.name} for appointment with Dr. ${appointment.doctor.name}`);
                
                // Small delay to avoid overwhelming the email/SMS service
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error(`Failed to send follow-up reminder for appointment ${appointment._id}:`, error);
            }
        }

        console.log('Follow-up reminder process completed.');
        
    } catch (error) {
        console.error('Error in follow-up reminder process:', error);
    }
};

// Function to send same-day reminders (2 hours before appointment)
const sendSameDayReminders = async () => {
    try {
        console.log('Checking for same-day follow-up reminders...');
        
        const now = new Date();
        const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const todayStr = now.toISOString().split('T')[0];
        
        // Find appointments scheduled for today within the next 2 hours
        const upcomingAppointments = await Appointment.find({
            day: todayStr,
            status: { $in: ['pending', 'confirmed'] }
        })
        .populate('patient', 'name contact')
        .populate('doctor', 'name speciality');

        const relevantAppointments = upcomingAppointments.filter(appointment => {
            const appointmentDateTime = new Date(`${appointment.day}T${appointment.time}`);
            const timeDiff = appointmentDateTime.getTime() - now.getTime();
            // Check if appointment is between 1.5 to 2.5 hours from now
            return timeDiff > 1.5 * 60 * 60 * 1000 && timeDiff <= 2.5 * 60 * 60 * 1000;
        });

        if (relevantAppointments.length === 0) {
            console.log('No same-day reminders to send.');
            return;
        }

        console.log(`Found ${relevantAppointments.length} appointments to remind about in 2 hours.`);

        for (const appointment of relevantAppointments) {
            try {
                const isEmail = validator.isEmail(appointment.patient.contact);
                
                const message = `
                Dear ${appointment.patient.name},
                
                This is a reminder that you have an appointment in 2 hours.
                
                Appointment Details:
                -------------------
                Date: Today (${appointment.day})
                Time: ${appointment.time}
                Doctor: Dr. ${appointment.doctor.name}
                Speciality: ${appointment.doctor.speciality}
                Room ID: https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${appointment.roomId}
                
                Please be ready to join the video call 5 minutes before your scheduled time.
                
                Best regards,
                TeleConnect Team
                `;

                if (isEmail) {
                    await sendEmail({
                        email: appointment.patient.contact,
                        subject: `Reminder: Appointment in 2 Hours - Dr. ${appointment.doctor.name}`,
                        message,
                    });
                } else {
                    const smsMessage = `TeleConnect: Appointment with Dr. ${appointment.doctor.name} in 2 hours at ${appointment.time}. Room: ${appointment.roomId}`;
                    await sendSMS({
                        phone: `+91${appointment.patient.contact}`,
                        message: smsMessage,
                    });
                }

                console.log(`Same-day reminder sent to ${appointment.patient.name} for appointment with Dr. ${appointment.doctor.name}`);
                
                // Small delay to avoid overwhelming the email/SMS service
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error(`Failed to send same-day reminder for appointment ${appointment._id}:`, error);
            }
        }

        console.log('Same-day reminder process completed.');
        
    } catch (error) {
        console.error('Error in same-day reminder process:', error);
    }
};

// Schedule follow-up reminders to run daily at 9:00 AM
const scheduleFollowUpReminders = () => {
    // Run daily at 9:00 AM
    cron.schedule('0 9 * * *', sendFollowUpReminders, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    
    // Run every 2 hours during business hours (9 AM to 6 PM) for same-day reminders
    cron.schedule('0 9,11,13,15,17 * * *', sendSameDayReminders, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    
    console.log('Follow-up reminder scheduler initialized');
    console.log('- Daily reminders at 9:00 AM');
    console.log('- Same-day reminders every 2 hours (9 AM - 5 PM)');
};

module.exports = {
    scheduleFollowUpReminders,
    sendFollowUpReminders,
    sendSameDayReminders
};
