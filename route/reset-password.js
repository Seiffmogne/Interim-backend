const express=require('express');
const router= express.Router();
const {User}=require('../model/user');
const asyncMiddleware=require('../middleware/async');
const jwt=require('jsonwebtoken');
const config=require('config');
const Joi=require('joi');
const bcrypt= require('bcrypt');



router.get('/:id/:token',asyncMiddleware(async (req,res)=>{
   // const{id,token}=req.params;

//Check if this Id exist in the database

const user = await User.findById(req.params.id);
if(!user) return res.status(400).send(`L'utilisateur n'existe pas.`);

const secret =config.get('jwtPrivateKey') +user.password;
const payload=jwt.verify(req.params.token,secret);

res.render('reset-password',{email:user.email});
//res.send('Email est correcte');

   


}));


router.post('/:id/:token',asyncMiddleware(async(req,res)=>{
    //Check if this Id exist in the database
    const user = await User.findById(req.params.id);
   if(!user) return res.status(400).send(`L'utilisateur n'existe pas.`);
   


   const secret =config.get('jwtPrivateKey') +user.password;

   const payload=jwt.verify(req.params.token,secret);

   // VAlidate Password and password 2 should match;
   const {error} = validatePassword(req.body); 
   if(error) return res.status(400).send(error.details[0].message);

   //We can simply find the User with the Payload email and Id And finally update the newPassword
   //console.log(payload);
   const aUser=await User.findById(payload._id);
   if(!aUser) return res.status(400).send('On  ne parviens pas à trouver votre compte si cela persiste contactez-nous par mail.');
   
   const salt= await bcrypt.genSalt(10);
   aUser.password = await bcrypt.hash(req.body.password,salt);
   //Always hash the password before saving.

   await aUser.save();
   res.status(200).send('Votre mot de passe a bien été modifié');

}));


function validatePassword(req){
    const shema =Joi.object({
        password: Joi.string().min(5).max(1024).required(),
        confirmPassword:Joi.string().min(5).max(1024).required().valid(Joi.ref('password'))
    });
    return shema.validate(req);
}







module.exports=router;