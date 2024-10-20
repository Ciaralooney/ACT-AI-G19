const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users'); // user model path

var loginRouter = express.Router();

// sign up route
loginRouter.route('/register')
    .get((req, res, next) => {
        res.render('register', { title: 'Register' });
    })
    .post(async (req, res, next) => {
        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: 'User already exists' });

            // Hash the password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create and save the new user
            user = new User({
                username,
                email,
                password: hashedPassword
            });

            await user.save();
            res.status(201).json({ msg: 'User is now registered' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

// login route 
loginRouter.route('/login')
    .get((req, res, next) => {
        res.render('login', { title: 'Login' });
    })
    .post(async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Invalid Email' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid Password' });

            res.status(200).json({ msg: 'Logged in successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = loginRouter;
