const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config({path: './config.env'});
require('./conn')

const User = require('./model/userSchema')

const PORT = process.env.PORT;






//middleware

// const middleware = (req, res, next) =>{
//    console.log('middleware')

//    next();
// }


// middleware();

app.get('/',(req, res) => {
  res.send("hello")
})
app.get('/about',(req, res) => {
  res.send("hello about")
})
app.get('/contact',(req, res) => {
  res.send("hello contact") 
})
app.listen(PORT,()=>{
    console.log(`listening on port http://localhost:${PORT}`)
})