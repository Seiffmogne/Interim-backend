const express=require('express');
const app= express();
require('dotenv').config();
require('./startup/prod')(app);


app.get('/',(req,res)=>{
res.send("True");
});

const port =process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listening on Port ${port} ...`);
});