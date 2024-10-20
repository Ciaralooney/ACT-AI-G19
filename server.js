
const express = require("express")
const app = express()

app.get("/",(req,res)=>{
    console.log("hi gaes")
    res.send("Hi")
})

const port = 8000

app.listen(port)