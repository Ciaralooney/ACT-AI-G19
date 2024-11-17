const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
})

const cryptoModel = mongoose.model('cryptosymbol',cryptoSchema);

module.exports = cryptoModel;