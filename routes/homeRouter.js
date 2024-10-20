const express = require('express');
var homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.send('Home Page'); // temporary
    //res.render('index'); // Render the view index.ejs
});

module.exports = homeRouter;