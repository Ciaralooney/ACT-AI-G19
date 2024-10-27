require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require("express");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const loginRouter = require('./routes/loginRouter'); 
const homeRouter = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');
const signupRouter = require("./routes/signUpRouter");
const cryptoRouter = require("./routes/cryptoRouter");
const stockRouter = require('./routes/stockRouter');
const passwordResetRouter = require('./routes/passwordResetRouter'); 

const secret = process.env.JWT_SECRET;

const mongodbURL = process.env.MONGOLINK; // Use the connection string from the .env
const port = 3000;

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// View engine setup
app.set('view engine', 'ejs'); // Specify the view engine in the express app

app.use(express.urlencoded({ extended: true })); // Parsing user input
app.use(express.static('public')); // Serve static files from public directory

// Route setup
app.use('/', homeRouter);
app.use('/accounts', loginRouter);
app.use('/stocks', stockRouter);
app.use('/crypto', cryptoRouter);
app.use('/accounts', signupRouter); 
app.use('/accounts', passwordResetRouter);
app.use('/user', userRouter);


// Connect to MongoDB using Mongoose
mongoose.connect(mongodbURL)
  .then(() => {
    console.log('Successfully connected to online server');
  })
  .catch((error) => {
    console.error('Error connecting to online server:', error);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
