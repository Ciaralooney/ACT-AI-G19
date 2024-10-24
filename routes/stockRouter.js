const express = require('express');
const axios = require('axios')

var stockRouter = express.Router();

stockRouter.get('/search', (req,res)=>{
    res.render('../views/stockSearch')
})

stockRouter.get('/',async (req,res)=>{
    var listSymbols = ['aapl','msft','amzn','goog','googl','meta','nvda','tsla','nflx','intc','adbe','crm','orcl','amd','csco','shop']
    // var pm = JSON.stringify(listSymbols)
    try {
        const response = await axios.post("http://localhost:5000/get_stock_data", 
            {array: {listSymbols}},
            { headers: { 'Content-Type': 'application/json' }}
        )
        stockData = response.data;
        res.render('../views/stockList',{'stockList':stockData});
    } catch(error){
        res.status(500);
    }
    // res.render("../views/stockList",{'stockList':listSymbols})
})
// stockRouter.post('/', ())
// stockRouter.get('/', async (req, res) => { 
//     const listSymbols = req.params.symbols
//     try{
//         const response = await axios.get("http://localhost:5000/get_stock_data", {
//             params : {listSymbols}
//         });
//         res.json(response.data)
//     } catch(error){
//         res.status(500).json({ error: 'Error fetching stock data' });
//     }
// })
    
stockRouter.get('/search/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await axios.get(`http://localhost:5000/api/stocks`, {
            params: { symbol }
        });
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stock data' });
    }
});


module.exports = stockRouter;