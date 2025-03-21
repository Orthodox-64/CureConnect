const validator = require("validator");
const sendEmail = require("./sendEmail");
const sendSMS = require("./sendSMS");

const sendReminder = async (user, appointmentDetails) => {
    const isEmail = validator.isEmail(user.contact);
    const message = `
    Reminder: Your appointment is in 5 minutes!
    
    Appointment Details:
    Date: ${appointmentDetails.day}
    Time: ${appointmentDetails.time}
    Room ID: ${appointmentDetails.roomId}
    
    Please be ready to join the session.
    `;

    if (isEmail) {
        await sendEmail({
            email: user.contact,
            subject: "Appointment Reminder - TeleConnect",
            message,
        });
    } else {
        await sendSMS({
            phone: `+91${user.contact}`,
            message: `TeleConnect Reminder: Your appointment is in 5 minutes! Room ID: ${appointmentDetails.roomId}`,
        });
    }
};

module.exports = sendReminder;
