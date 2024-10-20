
const express = require("express")
<<<<<<< HEAD
const mongoose = require('mongoose')
=======
>>>>>>> af82a7f2ecee0021d79d4c1cc98efde4c3c72445
const app = express()

app.get("/",(req,res)=>{
    console.log("hi gaes")
    res.send("Hi")
})

const port = 8000
<<<<<<< HEAD
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
=======

app.listen(port)
>>>>>>> af82a7f2ecee0021d79d4c1cc98efde4c3c72445
