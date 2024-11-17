
// routes/ratingRouter.js
const express = require('express');
const Rating = require('../models/ratings'); // getting the rating model

const ratingRouter = express.Router(); // Creating the router instance

// Display the rating form (GET /rating -> mapped from server.js)
ratingRouter.get('/', (req, res) => {
    res.render('rating_copy'); // Render the rating form from views/rating.ejs
});

// Handle rating submission (POST /rating/submit-rating -> mapped from server.js)
ratingRouter.post('/submit-rating', async (req, res) => {
    const { rating, comment } = req.body;

    try {
        // Create and save a new Rating document
        const newRating = new Rating({ rating, comment });
        await newRating.save();

        res.send('Thank you for your feedback!'); // Respond with confirmation
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).send('An error occurred. Please try again later.');
    }
});

module.exports = ratingRouter;
