const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kevindangol8@gmail.com',
        pass: 'kevindangol1029'
    }
});

const sendAlertEmail = async (to, subject, message) => {
    await transporter.sendMail({
        from: 'DMS',
        to,
        subject,
        text: message
    });
};

module.exports = { sendAlertEmail };