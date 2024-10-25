const express = require('express');
const axios = require('axios')

var router = express.Router();

router.get('/',async(req,res)=>{
    var listSymbols = ["BTC-USD","ETH-USD","BNB-USD","XRP-USD","ADA-USD","SOL-USD", "DOGE-USD", "MATIC-USD", "DOT-USD","LTC-USD", "SHIB-USD","AVAX-USD"];
    try {
        const response = await axios.post("http://localhost:5000/get_crypto_data", 
            { array: { listSymbols } },
            { headers: { 'Content-Type': 'application/json' }}
        );
        const stockData = response.data;
        res.render('../views/cryptoList',{'stockList':stockData});
        // res.json(stockData)
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Error fetching stock data" }); // Return error as JSON
    }
})

module.exports = router
