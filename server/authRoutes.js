require('dotenv').config({ path: './server/.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
const DjProfile = require('./models/DjProfileForm');
const jwt = require('jsonwebtoken'); // Import JWT library


const transporter = nodemailer.createTransport({
    service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

//Verification code
router.post('/login', async (req, res) => {
    const { email } = req.body;

    console.log('Received login request for email:', email); // Debug log

    try {
        let user = await DjProfile.findOne({ email });

        if (!user) {
            console.log('User not found:', email); // Debug log
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a random 6-digit code
        const verificationCode = crypto.randomBytes(3).toString('hex');

        // Store in the database but eliminate after 10 minutes
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send the verification code
        const mailOptions = {
            from: '"HangTheDJ 💿" <noreplyhangthedj@gmail.com>',
            to: email,
            subject: 'Your login verification code',
            text: `Your login verification code is: ${verificationCode}\nThis code will only be valid for the next 10 minutes`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error); // Debug log
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log('Verification code sent successfully:', info); // Debug log
            res.json({ message: 'Verification code sent successfully' });
        });
    } catch (error) {
        console.error('Error in /login route:', error); // Debug log
        res.status(500).json({ message: 'Server error' }); // Respond with a generic server error
    }
});

router.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;

    console.log('Verification request received:', { email, verificationCode }); // Log incoming request

    try {
        let user = await DjProfile.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user); // Log user data for debugging

        if (user.verificationCode !== verificationCode) {
            console.log('Invalid verification code:', { expected: user.verificationCode, received: verificationCode });
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (Date.now() > user.verificationCodeExpiry) {
            console.log('Verification code expired');
            return res.status(400).json({ message: 'Verification code expired' });
        }

        // Clear verification code after successful verification
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {expiresIn: '1h' });

        console.log('Verification successful, user logged in');
        res.json({ success: true, message: 'Verification successful, logged in!', token });
    } catch (error) {
        console.error('Error in verify route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;