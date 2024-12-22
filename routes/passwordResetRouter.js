const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/users');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Request Password Reset
router.get('/request-password-reset', async (req, res) => {
    res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: null, successMessage: null });
});

// Handle Password Reset
router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'No user found with this email', successMessage: null });
        }

        // Generate token and set expiration
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetURL = `https://act-ai-g19.onrender.com/accounts/reset-password/${token}`; 
        const msg = {
            to: email,
            from: 'AgenticCorporateTrader@gmail.com',
            subject: 'ACT-AI Password Reset',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="text-align: center; color: #333;">ACT-AI Password Reset</h2>
                <p style="font-size: 16px; color: #555;">
                    Hello, ${email}
                </p>
                <p style="font-size: 16px; color: #555;">
                    You have requested to reset your password. Click the button below to proceed:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetURL}" style="background-color: #007BFF; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">
                        Reset Your Password
                    </a>
                </div>
                <p style="font-size: 14px; color: #777;">
                    If you did not request this change, you can safely ignore this email.
                </p>
                <p style="font-size: 14px; color: #777;">
                    Thank you,<br>ACT-AI Team
                </p>
            </div>
            `
        };

        await sgMail.send(msg);
        res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: null, successMessage: 'Email sent. Check your spam' });
    } catch (error) {
        console.error(error);
        res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'Failed to send email', successMessage: null });
    }
});

router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'Token has expired', successMessage: null });
        }
        res.render('passwordResetForm', { title: 'Reset Password', token, errorMessage: null });
    } catch (err) {
        console.error(err);
        res.render('passwordResetRequest', { title: 'Request Password Reset', errorMessage: 'Server error', successMessage: null });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.render('passwordResetForm', { title: 'Reset Password', token, errorMessage: 'Token has expired' });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token and expiration
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();
        res.render('login', { title: 'Login', errorMessage: null, successMessage: 'Password has been reset successfully. Please log in.' });
    } catch (error) {
        console.error(error);
        res.render('passwordResetForm', { title: 'Reset Password', token, errorMessage: 'Server error' });
    }
});

module.exports = router;
