const winston =require('winston');
const mongoose= require('mongoose');
const { MongoError, MongoClient } = require('mongodb');

module.exports=function(){
   // const db=config.get('db');
   //const client= new MongoClient(process.env.DB);
    mongoose.connect(process.env.DB)
.then(()=> winston.info(`Connected to mongodb...`));
}