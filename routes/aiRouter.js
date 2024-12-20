const express = require("express");
const axios = require("axios");

const route = express.Router();
const domain = process.env.AI_ENGINE_API

route.post("/crypto/:symbol", async(req,res)=>{
    var symbol = req.params.symbol;
    try{
        const response = await axios.post(`${domain}/analyze_crypto`,
            {
                "ticker_symbol" : symbol
            }
        )
        const ticker = response.data.ticker_symbol
        const result = response.data.analysis
        console.log(response)
        res.render("../views/cryptoReccomendation", { ticker, result });
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
        const ticker = response.data.ticker_symbol
        const result = response.data.analysis
        console.log(response)
        res.render("../views/stockReccomendation", { ticker, result });
    }catch(error){

    }
})

module.exports = route
