const express = require('express');
const ClientPortfolio = require('../models/client')

var portfolioRouter = express.Router();

portfolioRouter.route('/portfolio').get((req, res, next) => {
    res.render('portfolio', { title: 'Portfolio' });
})
.post(async (req, res) => {
    const { clientName, clientDescription, fundManagerEmail } = req.body;
    
    try {
      // // Find the fund manager (you can add a check to create the user if they don't exist)
      // const fundManager = await User.findOne({ email: fundManagerEmail });
  
      // if (!fundManager) {
      //   return res.status(404).send('Fund manager not found');
      // }
  
      // Create a new portfolio
      const newPortfolio = new ClientPortfolio({
        clientName,
        clientDescription,
        fundManagerEmail,  // or fundManagerEmail if using a single schema
        stockSymbols: [],
        cryptoSymbols: [],
      });
  
      await newPortfolio.save();
      res.send('Portfolio created successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating portfolio');
    }
  });

portfolioRouter.put('/portfolio/:id/stocks', async (req, res) => {
    const { id } = req.params;
    const { stockSymbols } = req.body;
  
    try {
      const portfolio = await ClientPortfolio.findById(id);
      if (!portfolio) {
        return res.status(404).send('Portfolio not found');
      }
  
      portfolio.stockSymbols.push(...stockSymbols); // Add new stock symbols
      await portfolio.save();
      res.send('Stock symbols added');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding stock symbols');
    }
});

portfolioRouter.put('/portfolio/:id/cryptos', async (req, res) => {
    const { id } = req.params;
    const { cryptoSymbols } = req.body;
  
    try {
      const portfolio = await ClientPortfolio.findById(id);
      if (!portfolio) {
        return res.status(404).send('Portfolio not found');
      }
  
      portfolio.cryptoSymbols.push(...cryptoSymbols); // Add new crypto symbols
      await portfolio.save();
      res.send('Crypto symbols added');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding crypto symbols');
    }
  });
  
  
module.exports = portfolioRouter;