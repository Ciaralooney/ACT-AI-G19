const express = require('express');
const axios = require('axios');
const stock = require('../models/stocks');

const router = express.Router();
const flaskDomain = "https://yfianance-api-904c5fa45cd2.herokuapp.com";

router.get('/',async (req,res)=>{
    var listDBSymbols = await stock.find({},'symbol -_id');
    const symbolArray = listDBSymbols.map(doc => doc.symbol);
    // console.log(symbolArray);
    // var listSymbols = ['aapl','msft','amzn','goog','googl','meta','nvda','tsla','nflx','intc','adbe','crm','orcl','amd','csco','shop']
    // console.log(listSymbols)
    // var pm = JSON.stringify(listSymbols)
    try {
        const response = await axios.post(`${flaskDomain}/get_stock_data`, 
            {array: symbolArray},
            { headers: { 'Content-Type': 'application/json' }}
        )
        stockData = response.data;
        res.render('../views/stockList',{'stockList':stockData});
    } catch(error){
        res.status(500);
    }
})
//Gets a detailed page of the selected stock
router.get('/detail/:symbol', async(req, res)=>{
    const symbol = req.params.symbol
    try{
        const response = await axios.post(`${flaskDomain}/api/stockGraph`,{
            params: {symbol}
        });
        const graphHtml = response.data.graph_html;
        const stockInfo = response.data.stockData;
        const financial = response.data.financial;
        res.render('../views/stockView',
            {
                graphHtml:graphHtml,
                symbol : symbol, 
                stockInfo:stockInfo, 
                financial:financial
            })
    }catch(error){
        console.error('Error fetching graph HTML:', error);
        res.status(500).send('Error fetching graph data');
    }
})
// router.get('/search/:symbol', async (req, res) => {
//     const symbol = req.params.symbol;
//     try {
//         const response = await axios.get(`http://localhost:5000/api/stocks`, {
//             params: { symbol }
//         });
//         console.log(response.data);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching stock data' });
//     }
// });


module.exports = router;
