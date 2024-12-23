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
    symbol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stocksymbol',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }
  }],
  cryptoSymbols: [{
    symbol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'cryptosymbol',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }
  }],
});

// Model
const ClientPortfolio = mongoose.model('ClientPortfolio', clientPortfolioSchema);

module.exports = ClientPortfolio;
