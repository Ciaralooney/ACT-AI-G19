const mongoose = require('mongoose');
const StockSymbol = require('./models/stocks'); // Import the model
const CryptoSymbol = require('./models/crypto'); // Import the model
require('dotenv').config();

// List of stock symbols
const stockSymbols = [
  'amzn', 'goog', 'googl', 'meta', 'tsla', 'nflx', 'intc', 'adbe', 'crm', 'orcl', 'amd', 'csco', 'shop'
];
const cryptoSymbols = [
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
async function addCryptoSymbols() {
  try {
    // Connect to MongoDB (adjust the URL for your MongoDB instance)
    await mongoose.connect(process.env.MONGOLINK)

    // Convert each stock symbol to uppercase and create an array of objects to insert
    const stockDocs = cryptoSymbols.map(symbol => ({ symbol: symbol.toUpperCase() }));

    // Insert the stock symbols into the collection
    await CryptoSymbol.insertMany(stockDocs);

    console.log('Crypto symbols added successfully!');
    mongoose.connection.close(); // Close the connection
  } catch (err) {
    console.error('Error adding stock symbols:', err);
  }
}

// Call the function to add symbols
// addCryptoSymbols();

async function deleteCryptoSymbols() {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGOLINK);
  
      // Delete the crypto symbols from the Stock collection
      await StockSymbol.deleteMany({
        symbol: { $in: cryptoSymbols }
      });
  
      console.log('Crypto symbols deleted successfully!');
      mongoose.connection.close(); // Close the connection
    } catch (err) {
      console.error('Error deleting crypto symbols:', err);
    }
  }
  
  // Call the function to delete symbols
deleteCryptoSymbols();
  