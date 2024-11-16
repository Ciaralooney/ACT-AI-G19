const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/'); // Redirect to homepage
    });
});

module.exports = logoutRouter;