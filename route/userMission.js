const express= require('express');
const router=express.Router();
const {userMission,validateUserMission}= require('../model/userMission');
const{Mission}= require('../model/mission');
const {Experience}= require('../model/experience')
const{User}=require('../model/user');
const {sendMail}= require('../functionUse/sendMail');
const auth= require('../middleware/auth');
const asyncMiddleware= require('../middleware/async');
const mongoose=require('mongoose');
const winston =require('winston');
const { Categ } = require('../model/category');



router.post('/',auth,async(req,res)=>{
    const {error} = validateUserMission(req.body); 
    if(error) return res.status(400).send(error.details[0].message);
    
    const session =await mongoose.startSession();
    const transactionOptions = {
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' },
            readPreference: 'primary'
          };

    try{
        session.startTransaction(transactionOptions);
        const mission=await Mission.findById(req.body.missionId,null,{session});
        if(!mission) return res.status(400).send(`La mission n'existe pas ou bien elle a été supprimée.`);
        if(mission.availableForPersonn===0) return res.status(400).send(`La mission n'est plus disponible`);

         // Check if the user have add this experience pro?
        const aExperience = await Experience.findOne({'userExperience._id':req.user._id},null,{session});
        if(!aExperience) return res.status(404).send('Parlez nous un peu plus de vous pour pouvoir accepeter une mission.');

        const user= await User.findById(req.body.userId,null,{session});
         if(!user) return res.status(400).send('Invalid User');

         const aUserMission=await userMission.findOne({'mission._id':mission._id,'user._id':req.user._id},null,{session});
        if(aUserMission) return res.status(400).send('Tu as déja accepté la mission');
        

           let usermission=new userMission({
        mission:{
           _id:mission._id,
           details:mission.details,
           time:mission.time,
           nmbreJour:mission.nmbreJour,
           userCreateMission:mission.userCreateMission,
           availableForPersonn:mission.availableForPersonn,
           priceOfHours:mission.priceOfHours,
           when:mission.when,
           category:mission.category
        },
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber

        }
     
   });
   const totalPriceC=mission.calculateTotalPrice();
    usermission.mission.totalPrice=totalPriceC;
   await usermission.save();

   const updateMission=await Mission.updateOne({_id:mission._id},
    {$inc:{availableForPersonn:-1}},{session}
    );
    
    res.send(usermission);
       const writeHtml=`<html><p>Bonjour ${usermission.mission.userCreateMission.name} , ${usermission.user.name} a accepté une mission publiée par votre entreprise et il sera présent le jour convenu.  <p/>
   <p>Vous trouverez dans ce mail ces informations afin de mieux visualiser votre future intériamire.</p>
   <p>
   Ces informations:
   Nom: ${usermission.user.name},
   email: ${usermission.user.email},
   numéro de téléphone: ${usermission.user.phoneNumber}
   </p>
   </html>`

    //Use mailgun to send the email .
      sendMail(usermission.mission.userCreateMission.email,'Mission Accepté',writeHtml);
    
    await session.commitTransaction();
    session.endSession();
              

    }
    catch(e){
        await session.abortTransaction();
        session.endSession();
        winston.error(e.message,e);
        res.status(500).send('Nous rencontrons un problème réessayer ultérieurement.');

    }
        


});
router.get('/me',auth,asyncMiddleware(async(req,res)=>{
    // We want to return an array of all userMission(I accept) that belong to the authenticate user.
    const userMisss=await userMission.find({'user._id':req.user._id});

    res.send(userMisss);


}));
router.get('/:id',auth,asyncMiddleware(async(req,res)=>{
    // return a mission with a given Id.
    const aUserMission=await userMission.findById(req.params.id);
    if(!aUserMission) return res.status(404).send('The mission is not found');

    res.send(aUserMission);

}));

router.delete('/:id',auth,async(req,res)=>{

    const session =await mongoose.startSession();
    const transactionOptions = {
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' },
            readPreference: 'primary'
          };
          try{
            session.startTransaction(transactionOptions);
      //We want to delete only the mission Accept by the login User
    //const userMis= await userMission.findOneAndRemove({_id:req.params.id,'user._id':req.user._id });
            const condition={
                _id:req.params.id,
                'user._id':req.user._id
            }
            const userMis=await userMission.findOne(condition, null, {session}).exec();
             if(!userMis) return res.status(404).send('On a pas pu trouver la mission');
             const deleMission=await userMis.deleteOne(null,null,{session});
             
        
              const updateMission= await Mission.updateOne({_id:userMis.mission._id},  
                  {$inc:{availableForPersonn:+1}},{session}).exec();

            
                const writeHtml=`<html><p>Bonjour ${userMis.mission.userCreateMission.name} , ${userMis.user.name} a refuser la mission qu'il avait accepté.  <p/>
                <p>La mission sera de nouveau disponible et d'autre intérimaire pourront postuler à cette mission.</p>
                </html>`
            sendMail(userMis.mission.userCreateMission.email,'Mission Refusé',writeHtml);
             res.send(deleMission);
             await session.commitTransaction();
             session.endSession();

          }
          catch(e){
            await session.abortTransaction();
            session.endSession();
            winston.error(e.message,e);
            res.status(500).send('Nous rencontrons un problème réessayer ultérieurement.');
    

          }

   
});







module.exports=router;