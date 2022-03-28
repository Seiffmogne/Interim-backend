const express=require('express');
const router= express.Router();
const {User}=require('../model/user');
const asyncMiddleware=require('../middleware/async');
const config= require('config');
const jwt=require('jsonwebtoken');
const {sendMail}= require('../functionUse/sendMail');

router.post('/',asyncMiddleware(async(req,res)=>{
    //Make sure user exist in the database.
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send(`L'adresse mail n'est pas reconnue`);


    //User exists and now create a one time link valid in 15 minutes.
    const secret= config.get('jwtPrivateKey') + user.password;
    const payload={
        email:user.email,
        _id:user._id
    }
    const token = jwt.sign(payload,secret,{expiresIn:'15m'});
    const link=`http://${req.headers.host}/api/resetPassword/${user._id}/${token}`;
    
    const writeHtml=`<html>
    <p>Bonjour ${user.name}, ce mail à pour but de vous fournir un lien qui va vous permettre de modifier votre mot de passe.</p>
    <p>Vous trouverez dans ce mail  un lien qui va vous permettre de modifier votre mot de passe:
    <a href="${link}">Le lien <a/>
    <p/>
    <p> P.S:Ce lien est disponible pendant 15 minutes.</p>
    </html>`
    

     //Use mailgun to send the emailLink.
   
      sendMail(user.email,'Mot de passe oublié',writeHtml);

    res.send('Un mail vous a été envoyé pour réinitialiser votre mot de passe.');


}));







module.exports= router;
