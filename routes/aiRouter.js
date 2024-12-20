const express = require("express");
const axios = require("axios");

const route = express.Router();
const domain = "http://127.0.0.1:5000"

route.post("/crypto/:symbol", async(req,res)=>{
    var symbol = req.params.symbol;
    try{
        const response = await axios.post(`${domain}/analyze_crypto`,
            {
                "ticker_symbol" : symbol
            }
        )
        const ticker = response.ticker_symbol
        const result = response.analysis
        res.json({ticker, result})
    }catch(error){

    }
})
route.post("/stock/:symbol", async(req,res)=>{
    var symbol = req.params.symbol;
    try{
        const response = await axios.post(`${domain}/analyze_stock`,
            {
                "ticker_symbol" : symbol
            }
        )
        const ticker = response.ticker_symbol
        const result = response.analysis
        res.json({ticker, result})
    }catch(error){

    }
})

module.exports = route
