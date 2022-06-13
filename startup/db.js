const winston =require('winston');
const mongoose= require('mongoose');
const config=require('config');

module.exports=function(){
    const db=config.get('db');
   //const client= new MongoClient(process.env.DB);
    mongoose.connect(db)
.then(()=> winston.info(`Connected to ${db}...`));
}