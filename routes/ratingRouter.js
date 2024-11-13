// routes/rating.js
const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating'); // getting the rating model

// Display the rating form
router.get('/', (req, res) => {
    res.render('rating'); // Renders views/rating.ejs
});

// handling post request to submit the rating
router.post('/submit-rating', async (req, res) => {
    const { rating, comment } = req.body;

    try {
        // Create a new rating document
        const newRating = new Rating({
            rating,
            comment
        });

        // Saving the rating document to the database
        await newRating.save();
        
        res.send('Thank you for your feedback!'); // Confirmation message
    } catch (error) {
        console.error('Error saving rating:', error); //error message to be displayed in case of error occurs
        res.status(500).send('An error occurred. Please try again later.');
    }
});


module.exports = router;
