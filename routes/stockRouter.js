const express = require('express');
const axios = require('axios')

var router = express.Router();

router.get('/search', (req,res)=>{
    res.render('../views/stockSearch')
})

router.get('/',async (req,res)=>{
    var listDBSymbols = await stock.find({},'symbol -_id');
    const symbolArray = listDBSymbols.map(doc => doc.symbol);
    
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
})

//Gets a detailed page of the selected stock
router.get('/detail/:symbol', async(req, res)=>{
    const symbol = req.params.symbol
    try{
        const response = await axios.post('http://localhost:5000/api/stockGraph',{
            params: {symbol}
        });
        const graphHtml = response.data.graph_html;
        const stockInfo = response.data.stockData;
        res.render('../views/stockView',{graphHtml:graphHtml,symbol : symbol, stockInfo:stockInfo})
    }catch(error){
        console.error('Error fetching graph HTML:', error);
        res.status(500).send('Error fetching graph data');
    }
})


module.exports = router;
