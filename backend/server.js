const express= require('express');
const app=express();
const bodyparser=require("body-parser");
const cors=require('cors');
const dotenv = require('dotenv');
dotenv.config();
const PORT=process.env.PORT;




app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));

const user=require('./model-routing/user')
app.use('/user',user)


app.get('/',(req,res)=>{

    res.send('Welcome to Expenses Management Systsem')
})

app.listen(PORT,()=>{
        console.log('Application Started on Port No:'+PORT);
        
})