
const express = require("express")
const mongoose = require('mongoose')
const app = express()

app.get("/",(req,res)=>{
    console.log("hi gaes")
    res.send("Hi")
})
/// testing git
const port = 8000
app.listen(port)
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/loginRoute', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});