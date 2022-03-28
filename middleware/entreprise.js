module.exports= function(req,res,next){
    if(!req.user.isEntreprise) return res.status(403).send('Vous devez être une entreprise pour effectuer cette action.');

    next();

}