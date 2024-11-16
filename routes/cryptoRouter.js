const express = require('express');
const axios = require('axios')

const router = express.Router();
const flaskDomain = "https://yfianance-api-904c5fa45cd2.herokuapp.com";
router.get('/',async(req,res)=>{
    var listSymbols = ["BTC-USD","ETH-USD","BNB-USD","XRP-USD","ADA-USD","SOL-USD", "DOGE-USD", "MATIC-USD", "DOT-USD","LTC-USD", "SHIB-USD","AVAX-USD"];
    try {
        const response = await axios.post(`${flaskDomain}/get_crypto_data`, 
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
router.get('/detail/:symbol', async(req,res)=>{
    var symbol = req.params.symbol
    try{
        const response = await axios.post(`${flaskDomain}/api/stockGraph`,{
            params: {symbol}
        });
        const graphHtml = response.data.graph_html;
        const stockInfo = response.data.stockData;
        res.render('../views/cryptoView',{graphHtml:graphHtml,symbol : symbol, stockInfo:stockInfo})
    }catch(error){
        console.error('Error fetching graph HTML:', error);
        res.status(500).send('Error fetching graph data');
    }
})

module.exports = router
