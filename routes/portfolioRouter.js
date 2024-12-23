const express = require('express');
const ClientPortfolio = require('../models/client')
const stockModel = require("../models/stocks")
const cryptoModel = require("../models/crypto")
const axios = require('axios');
const flaskDomain = "https://yfianance-api-904c5fa45cd2.herokuapp.com";
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
    .populate('stockSymbols.symbol') // Replace ObjectId with full stock symbol object
    .populate('cryptoSymbols.symbol')
    .exec();

  // // Fetch all available stock and crypto symbols
  // const boughtStockSymbols = portfolio.stockSymbols.map(stock => stock.symbol.symbol);
  // const boughtCryptoSymbols = portfolio.cryptoSymbols.map(crypto => crypto.symbol.symbol);

  res.render('clientDetails', { title: portfolio.clientName, portfolio });
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
    console.log('Stock Symbols:', updatedStockSymbols);
    console.log('Crypto Symbols:', updatedCryptoSymbols);

    res.redirect('/portfolio');
  } catch(error) {
    console.error(error);
    res.status(500).send('Error updating portfolio');
  }
});

// Trade crypto for client
portfolioRouter.get('/portfolio/:id/trade/crypto', async (req, res) => {
  try {
    // Fetch portfolio details to get bought symbols
    const portfolio = await ClientPortfolio.findById(req.params.id)
      .populate('cryptoSymbols.symbol') 
      .exec();

    if (!portfolio) {
      return res.status(404).send('Portfolio not found'); // Handle case where portfolio is not found
    }

    // Ensure cryptoSymbols is not null or undefined before calling map
    const boughtSymbols = portfolio.cryptoSymbols && portfolio.cryptoSymbols.length > 0 
      ? portfolio.cryptoSymbols.map(stock => stock.symbol.symbol)
      : [];

    const response = await axios.post(`${flaskDomain}/get_stock_data`,
      { array: boughtSymbols }, // Send the bought symbols to the API
      { headers: { 'Content-Type': 'application/json' } }
    );

    const cryptoDataBought = response.data;

    // Fetch all available stock symbols
    const allSymbols = await cryptoModel.find({}, 'symbol -_id');
    const availableSymbols = allSymbols
      .map(doc => doc.symbol)
      .filter(symbol => !boughtSymbols.includes(symbol)); // Exclude bought symbols

    // Call API with available symbols only
    const response1 = await axios.post(`${flaskDomain}/get_stock_data`,
      { array: availableSymbols },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const cryptoData = response1.data;
    console.log("Crypto Data", cryptoData)
    console.log("Crypto Data Bought", cryptoDataBought)
    res.render('portfolioTradeCrypto', {
      title: "Trade",
      portfolio,
      cryptoList: cryptoData,
      boughtListData: cryptoDataBought,
      boughtCrypto: portfolio.cryptoSymbols
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Buy specific crypto page
portfolioRouter.get('/portfolio/:id/trade/crypto/:symbol', async (req, res) => {
  const { id, symbol } = req.params;
  try {
    // Fetch portfolio details
    const portfolio = await ClientPortfolio.findById(id);
    // Fetch crypto data for the selected symbol
    const response = await axios.post(`${flaskDomain}/api/cryptoGraph`, {
      params: { symbol }
    });

    const cryptoData = response.data.stockData;
    console.log('Crypto Data:', cryptoData);
  
    res.render('portfolioCryptoBuy', {
      title: `Buy ${symbol.toUpperCase()}`,
      symbol,
      portfolio,
      cryptoData
    });
  } catch (error) {
    console.error('Error fetching crypto data for buying:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle buying crypto
portfolioRouter.post('/portfolio/:id/trade/crypto/:symbol/buy', async (req, res) => {
  const { id, symbol } = req.params;
  const { quantity, price } = req.body;

  try {
    // Look up the crypto symbol in the database
    const crypto = await cryptoModel.findOne({ symbol: symbol.toUpperCase() });

    if (!crypto) {
      return res.status(404).send('Stock symbol not found');
    }

    // Ensure that quantity and price are numbers
    const quantityNumber = parseFloat(quantity);
    const priceNumber = parseFloat(price);

    if (isNaN(quantityNumber) || isNaN(priceNumber)) {
      return res.status(400).send('Invalid quantity or price');
    }

    // Calculate the total amount
    const totalPrice = priceNumber * quantityNumber;

    // Update portfolio to reflect the purchased crypto
    await ClientPortfolio.findByIdAndUpdate(
      id,
      {
        $push: {
          cryptoSymbols: {
            symbol: crypto._id, // Use the ObjectId of the crypto
            quantity: quantityNumber,
            price: priceNumber
          }
        }
      }
    );

    res.redirect(`/portfolio/${id}/clientDetails`);
  } catch (error) {
    console.error('Error processing crypto purchase:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Trade stock for client
portfolioRouter.get('/portfolio/:id/trade/stock', async (req, res) => {
  try {
    // Fetch portfolio details to get bought symbols
    const portfolio = await ClientPortfolio.findById(req.params.id)
      .populate('stockSymbols.symbol') 
      .exec();

    if (!portfolio) {
      return res.status(404).send('Portfolio not found'); // Handle case where portfolio is not found
    }

    // Ensure stockSymbols is not null or undefined before calling map
    const boughtSymbols = portfolio.stockSymbols && portfolio.stockSymbols.length > 0 
      ? portfolio.stockSymbols.map(stock => stock.symbol.symbol)
      : [];

    const response = await axios.post(`${flaskDomain}/get_stock_data`,
      { array: boughtSymbols }, // Send the bought symbols to the API
      { headers: { 'Content-Type': 'application/json' } }
    );

    const stockDataBought = response.data;

    // Fetch all available stock symbols
    const allSymbols = await stockModel.find({}, 'symbol -_id');
    const availableSymbols = allSymbols
      .map(doc => doc.symbol)
      .filter(symbol => !boughtSymbols.includes(symbol)); // Exclude bought symbols

    // Call API with available symbols only
    const response1 = await axios.post(`${flaskDomain}/get_stock_data`,
      { array: availableSymbols },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const stockData = response1.data;

    res.render('portfolioTradeStock', {
      title: "Trade",
      portfolio,
      stockList: stockData,
      boughtListData: stockDataBought,
      boughtStocks: portfolio.stockSymbols
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Buy specific stock page
portfolioRouter.get('/portfolio/:id/trade/stock/:symbol', async (req, res) => {
  const { id, symbol } = req.params;
  try {
    // Fetch portfolio details
    const portfolio = await ClientPortfolio.findById(id);
    // Fetch stock data for the selected symbol
    const response = await axios.post(`${flaskDomain}/api/stockGraph`, {
      params: { symbol }
    });

    const stockData = response.data.stockData;
    console.log('Stock Data:', stockData);
  
    res.render('portfolioStockBuy', {
      title: `Buy ${symbol.toUpperCase()}`,
      symbol,
      portfolio,
      stockData
    });
  } catch (error) {
    console.error('Error fetching stock data for buying:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle buying stocks
portfolioRouter.post('/portfolio/:id/trade/stock/:symbol/buy', async (req, res) => {
  const { id, symbol } = req.params;
  const { quantity, price } = req.body;

  try {
    // Look up the stock symbol in the database
    const stock = await stockModel.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).send('Stock symbol not found');
    }

    // Ensure that quantity and price are numbers
    const quantityNumber = parseFloat(quantity);
    const priceNumber = parseFloat(price);

    if (isNaN(quantityNumber) || isNaN(priceNumber)) {
      return res.status(400).send('Invalid quantity or price');
    }

    // Calculate the total amount
    const totalPrice = priceNumber * quantityNumber;

    // Update portfolio to reflect the purchased stock
    await ClientPortfolio.findByIdAndUpdate(
      id,
      {
        $push: {
          stockSymbols: {
            symbol: stock._id, // Use the ObjectId of the stock
            quantity: quantityNumber,
            price: priceNumber
          }
        }
      }
    );

    res.redirect(`/portfolio/${id}/clientDetails`);
  } catch (error) {
    console.error('Error processing stock purchase:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle selling stock
portfolioRouter.post('/portfolio/:portfolioId/sell/stock', async (req, res) => {
  const { portfolioId } = req.params; // Portfolio ID from the URL
  const { symbol } = req.body; // Stock symbol from the form data
  const { Types } = require('mongoose'); // Import mongoose.Types
  
  try {
      // Convert symbol to ObjectId
      const symbolId = new Types.ObjectId(symbol); // Use `new` to create ObjectId
      
      // Find the portfolio
      const portfolio = await ClientPortfolio.findById(portfolioId);

      if (!portfolio) {
          return res.status(404).send('Portfolio not found');
      }
      console.log('Symbol to sell:', symbol);
      console.log('Current stockSymbols before filter:', portfolio.stockSymbols);

      // Filter out the stock to be sold
      portfolio.stockSymbols = portfolio.stockSymbols.filter(
        stock => !stock.symbol.equals(symbolId)
      );
      
      // Save the updated portfolio
      const updatedPortfolio = await portfolio.save();
      console.log('Updated Portfolio:', updatedPortfolio);

      // Redirect back to the portfolio page
      res.redirect(`/portfolio/${portfolioId}/trade/stock`);
  } catch (error) {
      console.error('Error while selling stock:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Delete single portfolio
portfolioRouter.delete('/portfolio/:id', async (req, res) => {
  await ClientPortfolio.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

module.exports = portfolioRouter;