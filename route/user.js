const _= require('lodash');
const bcrypt= require('bcrypt');
const asyncMiddleware= require('../middleware/async');
const express= require('express');
const router = express.Router();
const auth= require('../middleware/auth');
const {User,validateUser} = require('../model/user');
const {sendMail}= require('../functionUse/sendMail');
const config=require('config');
const jwt=require('jsonwebtoken');





router.get('/me',auth, asyncMiddleware(async(req,res)=>{
    const user = await User.findById(req.user._id).select({password:0,phoneNumber:0,siren:0});
    res.send(user);
  
}));

router.post('/',asyncMiddleware(async (req,res)=>{
 const {error} = validateUser(req.body); 
  if(error) return res.status(400).send(error.details[0].message);

let user= await User.findOne({email: req.body.email});
if(user) return res.status(400).send('Un compte avec cette adresse mail existe déjà.');


//user = new User(_.pick(req.body,["name","email","password","phoneNumber","isEntreprise","nameofEntreprise","locationofEntreprise"]));

user= new User({
  name:req.body.name,
  email:req.body.email,
  password:req.body.password,
  phoneNumber:req.body.phoneNumber,
  isEntreprise:req.body.isEntreprise,
  nameofEntreprise:req.body.nameofEntreprise,
  locationofEntreprise:req.body.locationofEntreprise,
  complementLocationofEntreprise:req.body.complementLocationofEntreprise,
  zipCode:req.body.zipCode,
  siren:req.body.siren
});
  


const salt= await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password,salt);

//User exists and now create a one time link valid in 15 minutes.
const secret= config.get('jwtPrivateKey') + user.password;
const payload={
    email:user.email,
    _id:user._id
}
const token = jwt.sign(payload,secret,{expiresIn:'15m'});

const link = `http://${req.headers.host}/api/verifyEmail/${user._id}/${token}`;

const writeHtml= `<html><p>Bonjour ${user.name} , bienvenu sur la nouvelle plateforme Habere.</p>
<p>Cette version de l'application est une version Beta.</p>
<p>Nous venons de lancer un nouveau projet en espérant que ce concept va vous plaire.</p>
<p>Pour nous aider à améliorer l'application vous pouvez nous faire un retour d'expérience de moins de 5 minutes.</p>
<h3>Vérifier son adresse mail.</h3>
<p>Pour vérifier votre adresse mail vous pouvez cliquer sur ce lien :<a href="${link}">Vérifier mon mail.</a> </p>

    </html>`;
 //Use mailgun to send the emailLink.

  sendMail(user.email,'Vérification email',writeHtml);
    

 

await user.save();

res.send(_.pick(user,["name","email","phoneNumber","isEntreprise","nameofEntreprise","locationofEntreprise","complementLocationofEntreprise","zipCode","siren"]));

}));








module.exports= router;