const express = require('express');
const ClientPortfolio = require('../models/client')
var portfolioRouter = express.Router();

// Serve the Manage Portfolio
portfolioRouter.get('/portfolio', async (req, res) => {
  const portfolios = await ClientPortfolio.find();
  res.render('portfolio', { title: 'Manage Portfolios', portfolios });
});

// Serve page for new portfolio creation
portfolioRouter.get('/portfolio/new', (req, res) => {
  const message = req.query.message || '';
  res.render('portfolioNew', { title: 'Create New Portfolio', message });
});

// Handle new portfolio creation
portfolioRouter.post('/portfolio/new', async (req, res) => {
  const { clientName, clientDescription, fundManagerEmail } = req.body;
  try {
    const newPortfolio = new ClientPortfolio({
      clientName,
      clientDescription,
      fundManagerEmail,
      stockSymbols: [],
      cryptoSymbols: [],
    });

    await newPortfolio.save();
    console.log('Portfolio created with name:', clientName, 'and fund manager -', fundManagerEmail);
    // Redirect back to the creation form with a success message
    return res.redirect(`/portfolio/new?message=Portfolio created successfully for ${clientName}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating portfolio');
  }
});

portfolioRouter.get('/portfolio/:id/clientDetails', async (req, res) => {
  const portfolio = await ClientPortfolio.findById(req.params.id);
  const stockSymbols = ['AAPL', 'GOOGL', 'AMZN'];
  const cryptoSymbols = ['BTC', 'ETH', 'LTC'];
  res.render('clientDetails', { portfolio, stockSymbols, cryptoSymbols });
});

// Display and manage single portfolio
portfolioRouter.get('/portfolio/:id/manage', async (req, res) => {
  const portfolio = await ClientPortfolio.findById(req.params.id);
  const stockSymbols = ['AAPL', 'GOOGL', 'AMZN'];
  const cryptoSymbols = ['BTC', 'ETH', 'LTC'];
  res.render('portfolioManage', { portfolio, stockSymbols, cryptoSymbols });
});

// Update single portfolio
portfolioRouter.post('/portfolio/:id', async (req, res) => {
  const { clientName, clientDescription, fundManagerEmail, stockSymbols, cryptoSymbols } = req.body;
  await ClientPortfolio.findByIdAndUpdate(req.params.id, {
      clientName,
      clientDescription,
      fundManagerEmail,
      stockSymbols: Array.isArray(stockSymbols) ? stockSymbols : [stockSymbols],
      cryptoSymbols: Array.isArray(cryptoSymbols) ? cryptoSymbols : [cryptoSymbols],
  });
  res.redirect('/portfolio');
});

// Delete single portfolio
portfolioRouter.delete('/portfolio/:id', async (req, res) => {
  await ClientPortfolio.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

module.exports = portfolioRouter;