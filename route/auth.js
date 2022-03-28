const bcrypt= require('bcrypt');
const express= require('express');
const router = express.Router();
const Joi= require('joi');
const asyncMiddleware= require('../middleware/async');
const {User} = require('../model/user');
const _= require('lodash');

router.post('/',asyncMiddleware(async (req,res)=>{
 const {error} = validate(req.body); 
  if(error) return res.status(400).send(error.details[0].message);

let user= await User.findOne({email: req.body.email});
if(! user) return res.status(400).send(`L'adresse mail ou le mot de passe est invalide`);
 
 const validPassword= await bcrypt.compare(req.body.password,user.password);
  if(!validPassword) return res.status(400).send(`L'adresse mail ou le mot de passe est invalide`);
  
  const token = user.generateAuthToken();

  res
     .header('x-auth-token',token)
     .send(_.pick(user,["name","email","_id"]));
}));


function validate(req){
    const shema =Joi.object({
        email: Joi.string().min(5).required().email(),
        password:Joi.string().min(5).max(1024).required()
    });
    return shema.validate(req);
}


module.exports= router;