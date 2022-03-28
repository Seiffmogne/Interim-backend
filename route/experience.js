const express=require('express');
const router=express.Router();
const asyncMiddleware=require('../middleware/async');
const {validExperience,Experience}= require('../model/experience');
const {User}= require('../model/user');
const auth= require('../middleware/auth');
const validObjectId=require('../middleware/validObjectId');




router.get('/me',auth,asyncMiddleware(async(req,res)=>{
    //Should return the experience of a User who has login.
    const aExper= await Experience.find({'userExperience._id':req.user._id})
      .select({profession:1,nameOfCompagnie:1,localisation:1,actualJob:1,dateOfBeginning:1,dateofEnd:1,description:1});

      res.send(aExper);

}));

router.get('/:id',[validObjectId,auth],asyncMiddleware(async(req,res)=>{
const aExperience=await Experience.findOne({_id:req.params.id,'userExperience._id':req.user._id});
if(!aExperience) return res.status(404).send(`L'expérience n'existe pas.`);

res.send(aExperience);

}));


router.post('/',[auth],asyncMiddleware(async(req,res)=>{
    const {error}= validExperience(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const aUser=await User.findById(req.body.userId);
    if(!aUser) return res.status(400).send(`L'utilisateur n'est pas reconnue`);

    let experience= new Experience({
      profession:req.body.profession,
      nameOfCompagnie:req.body.nameOfCompagnie,
      localisation:req.body.localisation,
      dateOfBeginning:req.body.dateOfBeginning,
      actualJob:req.body.actualJob,
      dateofEnd:req.body.dateofEnd,
      description:req.body.description,
      userExperience:{
          _id:aUser._id,
          name:aUser.name,
          email:aUser.email,
          phoneNumber:aUser.phoneNumber
      }
    });

   experience= await experience.save();

    res.send(experience);



}));

router.put('/:id',[validObjectId,auth],asyncMiddleware(async(req,res)=>{
    const {error}= validExperience(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    const experience=await Experience.findOneAndUpdate({_id:req.params.id,'userExperience._id':req.user._id},{
        profession:req.body.profession,
        nameOfCompagnie:req.body.nameOfCompagnie,
        localisation:req.body.localisation,
        dateOfBeginning:req.body.dateOfBeginning,
        actualJob:req.body.actualJob,
        dateofEnd:req.body.dateofEnd,
        description:req.body.description

    },{new:true});

    if(!experience) return res.status(404).send(`Cette expérience n'existe pas!`);

    await experience.save();

    res.send(experience);

}));

router.delete('/:id',[validObjectId,auth],asyncMiddleware(async(req,res)=>{
    const experience= await Experience.findOneAndRemove({_id:req.params.id,'userExperience._id':req.user._id});

    if(!experience) return res.status(404).send(`Cette expérience existe plus!`);

    res.send(experience);

}));











module.exports=router;