const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/users');
const crypto = require('crypto');
const transporter = require('../mailer');
const sgMail = require('@sendgrid/mail')
const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get('/request-password-reset', (req, res) => {
    res.render('passwordResetRequest', { title: 'Request Password Reset' });
});

router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'No user found with this email' });
        }

        // Generate token and set expiration
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetURL = `http://127.0.0.1:3000/accounts/reset-password/${token}`; 
        const msg = {
            to: email,
            from: 'AgenticCorporateTrader@gmail.com', // Change to your verified sender
            subject: 'ACT-AI Password Reset',
            html: `<p>You have requested a password reset. 
                   Click <a href="${resetURL}">here</a> to reset your password.</p>`
        };

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
                res.status(200).json({ msg: 'Email sent. Check your spam' });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Failed to send email');
            });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    // Find user with the reset token
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: 'Token is invalid or has expired' });
            }
            res.render('passwordResetForm', { token }); 
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
        });
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ msg: 'Token is invalid or has expired' });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token and expiration
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();
        res.status(200).json({ msg: 'Password has been reset successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
