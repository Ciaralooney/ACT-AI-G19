require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const signupRouter = express.Router();


signupRouter.route('/register')
    .get((req, res) => {
        res.render('register', { title: 'Register', errorMessage: null });
    })
    .post(async (req, res) => {
        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({
                $or: [{ username }, { email }]
            });
            
            if (user) return res.render('register', { title: 'Register', errorMessage: 'User already exists' });

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                username,
                email,
                password: hashedPassword
            });

            await user.save();

            // Redirect to the login page after successful registration
            res.redirect('/accounts/login');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = signupRouter;