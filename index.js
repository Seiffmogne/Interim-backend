const express=require('express');
const app= express();


app.get('/',(req,res)=>{
res.send("True");
});

const port =process.env.Port || 3000;

app.listen(port, ()=>{
    console.log(`Listening on Port ${port} ...`);
});