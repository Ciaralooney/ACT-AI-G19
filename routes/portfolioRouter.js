const express = require('express');
const ClientPortfolio = require('../models/client')
const stockModel = require("../models/stocks")
const cryptoModel = require("../models/crypto")
const ensureAuthenticated = require("../public/javascripts/authMiddleware")

var portfolioRouter = express.Router();
portfolioRouter.use(ensureAuthenticated)
// Serve the Manage Portfolio
portfolioRouter.get('/portfolio', async (req, res) => {
  const userEmail = req.session.userEmail;
  try {
    // Fetch portfolios where the logged-in user is the fund manager
    const portfolios = await ClientPortfolio.find({ fundManagerEmail: userEmail });
    res.render('portfolio', { title: 'Manage Portfolios', portfolios });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching portfolios');
  }
});

// Serve page for new portfolio creation
portfolioRouter.get('/portfolio/new', (req, res) => {
  res.render('portfolioNew', { title: 'Create New Portfolio' });
});

// Handle new portfolio creation
portfolioRouter.post('/portfolio/new', async (req, res) => {
  const { clientName, clientDescription, fundManagerEmail } = req.body;

  try {
    const newPortfolio = new ClientPortfolio({
      clientName,
      clientDescription,
      fundManagerEmail
    });

    await newPortfolio.save();
    console.log('Portfolio created with name:', clientName, 'and fund manager -', fundManagerEmail);
    // Redirect back to the creation form with a success message
    return res.redirect(`/portfolio/`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating portfolio');
  }
});

portfolioRouter.get('/portfolio/:id/clientDetails', async (req, res) => {
  const portfolio = await ClientPortfolio.findById(req.params.id)
    .populate('stockSymbols') // Replace ObjectId with full stock symbol object
    .populate('cryptoSymbols');

  // Fetch all available stock and crypto symbols
  const stockSymbols = await stockModel.find();
  const cryptoSymbols = await cryptoModel.find();
  res.render('clientDetails', { title: portfolio.clientName, portfolio, stockSymbols, cryptoSymbols });
});

// Display and manage single portfolio
portfolioRouter.get('/portfolio/:id/manage', async (req, res) => {
  const portfolio = await ClientPortfolio.findById(req.params.id)
    .populate('stockSymbols') // Replace ObjectId with full stock symbol object
    .populate('cryptoSymbols');
    
    console.log('Stock Symbols:', portfolio.stockSymbols);
    console.log('Crypto Symbols:', portfolio.cryptoSymbols);
    // Fetch all available stock and crypto symbols
  const stockSymbols = await stockModel.find();
  const cryptoSymbols = await cryptoModel.find();
  res.render('portfolioManage', {title: "Manage Portfolio", portfolio, stockSymbols, cryptoSymbols });
});

// Update single portfolio
portfolioRouter.post('/portfolio/:id', async (req, res) => {
  let { clientName, clientDescription, fundManagerEmail, stockSymbols, cryptoSymbols } = req.body;

  // Normalize to arrays if they are strings (single selection)
  stockSymbols = Array.isArray(stockSymbols) ? stockSymbols : stockSymbols ? [stockSymbols] : [];
  cryptoSymbols = Array.isArray(cryptoSymbols) ? cryptoSymbols : cryptoSymbols ? [cryptoSymbols] : [];

  console.log('Request Body:', req.body);
  try {
    const stockIds = await stockModel.find({ symbol: { $in: stockSymbols } }).select('_id');
    const cryptoIds = await cryptoModel.find({ symbol: { $in: cryptoSymbols } }).select('_id');
    

    // Ensure stockIds and cryptoIds are arrays of ObjectIds, or null if empty
    const updatedStockSymbols = stockIds.length ? stockIds.map(stock => stock._id) : null;
    const updatedCryptoSymbols = cryptoIds.length ? cryptoIds.map(crypto => crypto._id) : null;

    console.log(req.params.id);
    await ClientPortfolio.findByIdAndUpdate(req.params.id, {
      clientName,
      clientDescription,
      fundManagerEmail,
      stockSymbols: updatedStockSymbols, // Use null if no stocks are selected
      cryptoSymbols: updatedCryptoSymbols,
  });
    const portfolio  = ClientPortfolio.findById(req.params.id);
    console.log(req.params.id);
    console.log('Stock Symbols:', portfolio.stockSymbols);
    console.log('Crypto Symbols:', portfolio.cryptoSymbols);

    res.redirect('/portfolio');
  } catch(error) {
    console.error(error);
    res.status(500).send('Error updating portfolio');
  }
});

// Delete single portfolio
portfolioRouter.delete('/portfolio/:id', async (req, res) => {
  await ClientPortfolio.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

module.exports = portfolioRouter;