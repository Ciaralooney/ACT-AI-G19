const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
})

const stockModel = mongoose.model('stocksymbol',stockSchema);

module.exports = stockModel;