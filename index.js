const express=require('express');
const app= express();
require('dotenv').config();
require('./startup/prod')(app);


app.get('/',(req,res)=>{
res.send("This is the new app.");
});

const port =process.env.PORT || 3000;
const LOCAL_ADRESS='0.0.0.0'

app.listen(port,LOCAL_ADRESS, ()=>{
    console.log(`Listening on Port ${port} ...`);
});