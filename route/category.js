const express=require('express');
const router=express.Router();
const asyncMiddleware=require('../middleware/async');
const {validateCateg,Categ,}=require('../model/category');
const _= require('lodash');
const auth=require('../middleware/auth');
const isEntreprise=require('../middleware/entreprise');
const { MongoError, MongoClient } = require('mongodb');


router.get('/',asyncMiddleware(async(req,res)=>{
   const category=await Categ.find()
   .sort({name:1});

    res.send(category);

}));



router.post('/',[auth,isEntreprise],asyncMiddleware(async(req,res)=>{
    const {error}= validateCateg(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const category= await Categ.findOne({name:req.body.name});
    if(category) return res.status(400).send('Cette catégorie existe déja.');

    let categ=new Categ(_.pick(req.body,["name"]));

    categ=await categ.save();

    res.send(categ);



}));

module.exports=router;