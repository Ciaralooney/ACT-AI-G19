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
  stockSymbols: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stocksymbol',
    required: false,
  }],
  cryptoSymbols: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'cryptosymbol',
    required: false,
  }],
});

// Model
const ClientPortfolio = mongoose.model('ClientPortfolio', clientPortfolioSchema);

module.exports = ClientPortfolio;
