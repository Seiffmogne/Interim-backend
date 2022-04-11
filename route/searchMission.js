const express= require('express');
const router= express.Router();
const {Mission}= require('../model/mission');
const asyncMiddleware=require('../middleware/async');


// router.get('/',async(req,res)=> {

//   const searchString=req.query.name;
//   const searchLocation=req.query.zipCode;
//   //console.log(searchLocation);
//   //console.log(searchString);
  

//   const missionSearch= await Mission.find()
//   .or([{'userCreateMission.zipCode':searchLocation},{name:searchString}]);
  
  
//   if(!missionSearch)return res.status(400).send(`La mission n'existe pas.`);

//   res.send(missionSearch);
 
// });

router.get('/',asyncMiddleware(async(req,res)=>{
  const searchString=req.query.name;
   const searchLocation=req.query.zipCode;

   if(searchString){
     const sarchMission= await Mission.find({'category.name':{$regex:searchString,$options:'i'}})
     .sort({date:-1});
     res.send(sarchMission);
   }
   else if(searchLocation){
     const searchMission=await Mission.find({'userCreateMission.zipCode':searchLocation})
     .sort({date:-1});;
     res.send(searchMission);
   }
   else if(searchLocation && searchString){
     const theMissionSearch=await Mission.find()
     .or([{'category.name':searchString},{'useruserCreateMission.zipCode':searchLocation}])
     .sort({date:-1});;
     res.send(theMissionSearch);
   }

 
   

  
 
    
   
   
 }));











module.exports=router;