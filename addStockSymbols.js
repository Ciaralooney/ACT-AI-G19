const mongoose = require('mongoose');
const StockSymbol = require('./models/stocks'); // Import the model
require('dotenv').config();

// List of stock symbols
const stockSymbols = [
  'amzn', 'goog', 'googl', 'meta', 'tsla', 'nflx', 'intc', 'adbe', 'crm', 'orcl', 'amd', 'csco', 'shop'
];
const cryptoSymbols = [
    'BTC-USD',
    'ETH-USD',
    'USDT-USD',
    'SOL-USD',
    'BNB-USD',
    'XRP-USD',
    'DOGE-USD',
    'USDC-USD',
    'STETH-USD',
    'ADA-USD',
    'WTRX-USD',
    'TRX-USD',
    'SHIB-USD',
    'AVAX-USD',
    'WSTETH-USD',
    'WBTC-USD',
    'WETH-USD',
    'LINK-USD',
    'BCH-USD'
  ];
async function addStockSymbols() {
  try {
    // Connect to MongoDB (adjust the URL for your MongoDB instance)
    await mongoose.connect(process.env.MONGOLINK)

    // Convert each stock symbol to uppercase and create an array of objects to insert
    const stockDocs = stockSymbols.map(symbol => ({ symbol: symbol.toUpperCase() }));

    // Insert the stock symbols into the collection
    await StockSymbol.insertMany(stockDocs);

    console.log('Stock symbols added successfully!');
    mongoose.connection.close(); // Close the connection
  } catch (err) {
    console.error('Error adding stock symbols:', err);
  }
}

// Call the function to add symbols
addStockSymbols();
