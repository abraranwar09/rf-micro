const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

// Middleware
app.use(bodyParser.json());

// CORS
app.use(cors());

// POST /contact endpoint
app.post('/api/1.1/crm/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    console.log(process.env.SMTP_HOST, process.env.SMTP_EMAIL, process.env.SMTP_PASSWORD);

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587, // or 465 for SSL
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: 'emile@rebelforce.tech',
        subject: `Rebel Force contact form submission from ${email}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
