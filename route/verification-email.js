const express=require('express');
const router=express.Router();
const asyncMiddleware= require('../middleware/async');
const {User}= require('../model/user');
const config=require('config');
const jwt=require('jsonwebtoken');
const auth= require('../middleware/auth');
const {sendMail}= require('../functionUse/sendMail');






router.get('/:id/:token',asyncMiddleware(async(req,res)=>{
     //Check if this Id exist in the database
     const user = await User.findById(req.params.id);
     if(!user) return res.status(400).send(`L'utilisateur n'existe pas.`);
     
  
  
     const secret =config.get('jwtPrivateKey') +user.password;
  
     const payload=jwt.verify(req.params.token,secret);

      //We can simply find the User with the Payload email and Id and change IsVerified to true;

  const aUser=await User.findById(payload._id);
   if(!aUser) return res.status(400).send('On  ne parviens pas à trouver votre compte si cela persiste contactez-nous par mail.');


    aUser.isVerified=true;

    await aUser.save();
    
    

    res.render('Email-Verif',{email:user.email});


}));


router.post('/',[auth],asyncMiddleware(async(req,res)=>{
    //Find the User
    const user= await User.findById(req.user._id);
    


    //User exists and now create a one time link valid in 15 minutes.
 const secret= config.get('jwtPrivateKey') + user.password;

 const payload={
    email:user.email,
    _id:user._id
}
const token = jwt.sign(payload,secret,{expiresIn:'15m'});

const link = `http://${req.headers.host}/api/verifyEmail/${user._id}/${token}`;

const writeHtml=`<html>
<p>Bonjour ${user.name}, ce mail a pour but de vous fournir un lien qui va vous permettre de vérifier votre adresse mail.</p>
<p>
<a href="${link}">Le lien pour faire vérifier mon adresse. <a/>
<p/>
<p>P.S:Ce lien est valable pendant 15 minutes.</p>
</html>`

// console.log(link);

  //Use mailgun to send the emailLink.
  sendMail(user.email,'Vérification email',writeHtml);
    

res.send('Un lien vient de vous être envoyé');


}));











module.exports=router;