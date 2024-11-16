const express = require('express');
// const session = require('express-session');
var homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.render('index', { title: 'Home', session: req.session }); // Render the view index.ejs
});

module.exports = homeRouter;