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

const expense=require('./model-routing/expenses')
const user=require('./model-routing/user')
const groups=require('./model-routing/group')

app.use('/user',user)
app.use('/groups',groups)
app.use('/expenses',expense)


app.get('/',(req,res)=>{

    res.send('Welcome to Expenses Management Systsem')
})

app.listen(PORT,()=>{
        console.log('Application Started on Port No:'+PORT);
        
})