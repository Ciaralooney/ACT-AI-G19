const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users'); // user model path

const loginRouter = express.Router();

// login route
loginRouter.route('/login')
    .get((req, res, next) => {
        res.render('login', { title: 'Login', errorMessage: null });
    })
    .post(async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('login', { title: 'Login', errorMessage: 'Invalid Email' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('login', { title: 'Login', errorMessage: 'Invalid Password' });
            }

            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.userEmail = user.email;
            const redirectTo = req.session.returnTo || '/user/profile';
            delete req.session.returnTo;
            res.redirect(redirectTo);
            console.log("User logged in with ID:", req.session.userId);

        } catch (err) {
            console.error(err.message);
            res.status(500).render('login', { title: 'Login', errorMessage: 'Server error' });
        }
    });

module.exports = loginRouter;
