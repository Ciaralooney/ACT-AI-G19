const mongoose = require('mongoose');

// Define Client Portfolio Schema
const clientPortfolioSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientDescription: {
    type: String,
    required: true,
  },
  fundManagerEmail: {
    type: String,
    required: true,
  },
  stockSymbols: {
    type: [String], // Array of stock symbols (e.g., ["AAPL", "GOOGL"])
    default: [],
  },
  cryptoSymbols: {
    type: [String], // Array of crypto symbols (e.g., ["BTC", "ETH"])
    default: [],
  },
});

// Model
const ClientPortfolio = mongoose.model('ClientPortfolio', clientPortfolioSchema);

module.exports = ClientPortfolio;
