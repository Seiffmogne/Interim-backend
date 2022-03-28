const jwt= require('jsonwebtoken');
const config=require('config');

function auth(req,res,next){
    const token = req.header('x-auth-token');

    if(!token) return res.status(401).send(`Vous devez d'abord vous connecter!`);
    
     try{
      const decoded= jwt.verify(token,config.get('jwtPrivateKey'));
      req.user=decoded;
      next();
     }
     catch(ex){
         res.status(400).send('Nous ne parvenons pas à vous connecter.Si le problème persiste contacter le support client.');
     }

}

module.exports= auth;