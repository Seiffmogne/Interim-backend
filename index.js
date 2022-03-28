const winston=require('winston');
const cors=require('cors');
const express = require('express');
const app= express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine', 'ejs');
require('dotenv').config();
require('./startup/prod')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/route')(app);

process.on('uncaughtException',(ex)=>{
winston.error(ex.message,ex);
process.exit(1);
});
process.on('unhandledRejection',(ex)=>{
  winston.error(ex.message,ex);
  process.exit(1);
  });
app.use(cors());

winston.add(new winston.transports.File({filename:'logfile.log'}));

require('./startup/prod')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/route')(app);


const port =process.env.PORT || 3000;
const LOCAL_ADRESS='0.0.0.0'

app.listen(port,LOCAL_ADRESS, ()=>{
    console.log(`Listening on Port ${port} ...`);
});