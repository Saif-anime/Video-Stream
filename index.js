const express = require('express')
const port = 8000;
const path = require('path');
const app = express();
const cors = require('cors');


require('./conn');

// you use app.use 
app.use(require('./Controller/VideoController'))
app.use(cors());

app.get("/", (req, res) =>{
    res.send("helo world");
})




app.listen(port, ()=>{
    console.log("your server run is port ", port)
})

