// Load environment variables from .env file
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail password
    },
});

// Set up email options
const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender's address
    to: 'recipient@example.com', // Replace with the recipient's email address
    subject: 'Test Email from Node.js', // Subject line
    text: 'This is a test email sent using Nodemailer with SMTP.', // Plain text body
    html: '<h1>This is a test email sent using Nodemailer with SMTP.</h1>', // HTML body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error:', error); // Log error if there is one
    }
    console.log('Email sent:', info.response); // Log success message
});
