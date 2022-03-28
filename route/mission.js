const asyncMiddleware=require('../middleware/async');
const express=require('express');
const _= require('lodash');
const router= express.Router();
const {Mission,validateMission}= require('../model/mission');
const {Categ}=require('../model/category');
const {User} = require('../model/user');
const auth = require('../middleware/auth');
const isEntreprise= require('../middleware/entreprise');
const {sendMail}= require('../functionUse/sendMail');
const validObjectId=require('../middleware/validObjectId');


router.get('/',asyncMiddleware(async (req, res)=>{
const mission =await Mission.find()
.select({time:1,details:1,name:1,date:1,_id:1,nmbreJour:1,userCreateMission:1,availableForPersonn:1,priceOfHours:1,totalPrice:1,category:1,when:1})
.sort({date:-1});
res.send(mission);
}));

router.get('/me',auth,asyncMiddleware(async(req,res)=>{
    //Should return only mission create by user Login.

   //console.log(aUser);
    const amission= await Mission.find({
        'userCreateMission._id':req.user._id
    });
    res.send(amission); 
 }));

router.get('/:id',validObjectId, asyncMiddleware(async(req,res)=>{
    const missionID= await Mission.findById(req.params.id)
    .select({time:1,details:1,name:1,date:1,_id:1,nmbreJour:1,userCreateMission:1,availableForPersonn:1,priceOfHours:1,totalPrice:1,category:1,when:1});

    if(!missionID) return res.status(404).send('The mission notFound');

    res.send(missionID);

}));




router.post('/',[auth,isEntreprise],asyncMiddleware(async(req,res)=>{
const {error}= validateMission(req.body);
if (error) return res.status(400).send(error.details[0].message);


const auser= await User.findById(req.body.userId);
if(!auser) return res.status(400).send('Invalid User');

const category= await Categ.findById(req.body.categoryId);
if(!category) return res.status(400).send(`La catégory n'existe pas.`);


//let mission= new Mission(_.pick(req.body,["name","time","details","nmbreJour"]));

let mission= new Mission({
  name:req.body.name,
  time:req.body.time,
  details:req.body.details,
  nmbreJour:req.body.nmbreJour,
  availableForPersonn:req.body.availableForPersonn,
  when:req.body.when,
  priceOfHours:req.body.priceOfHours,
  userCreateMission:{
      _id:auser._id,
      isEntreprise:auser.isEntreprise,
      locationofEntreprise:auser.locationofEntreprise,
      complementLocationofEntreprise:auser.complementLocationofEntreprise,
      zipCode:auser.zipCode,
      nameofEntreprise:auser.nameofEntreprise,
      email:auser.email,
      name:auser.name
  },
  category:{
      _id:category._id,
      name:category.name
  }
});

const totalPriceC=mission.calculateTotalPrice();
mission.totalPrice=totalPriceC;


mission= await mission.save();
res.send(mission);
//Send Email

//find all User

  const user= await User.find()
 .select({email:1,isEntreprise:1,name:1});
 
 //Send mail that a new Mission was published.
 const link='www.habere.fr'
 const aDate= mission.when;
  const date=`${aDate.getUTCDate()}:${aDate.getMonth() +1}:${aDate.getFullYear()} heure:${aDate.getHours()}H`;
 
  for(let theUser of user ){ 
     const writeHtml= `<html><p>Bonjour ${theUser.name} ,${mission.userCreateMission.nameofEntreprise} a publié une nouvelle mission.</p>
      <p>La mission aura lieu le :${date}</p>
        <p>
      connecte toi  sur habere pour voir si la mission t'intéresse.
      <p/>
      <a href="${link}">Le lien pour se connecter!</a>
    </html>`;

      if(theUser && !theUser.isEntreprise){
            
     //Use mailgun to send Email
     
       sendMail(theUser.email,`Une nouvelle mission pourrait t'intéresser `,writeHtml);
    
       
      }
  }

 
// End Send Email.

}));


router.put('/:id',[validObjectId,auth,isEntreprise],asyncMiddleware(async(req,res)=>{
    const {error}= validateMission(req.body);
   if (error) return res.status(400).send(error.details[0].message);

  // const mission =await  Mission.findOneAndUpdate({_id:req.params.id,'userCreateMission._id':req.user._id},{
   // name:req.body.name,
    // time:req.body.time,
    // nmbreJour:req.body.nmbreJour,
    // details:req.body.details,
    // availableForPersonn:req.body.availableForPersonn,
    // priceOfHours:req.body.priceOfHours
   // },
   // {new:true});

   const mission= await Mission.findOne({_id:req.params.id,'userCreateMission._id':req.user._id});
    if (!mission)  return res.status(404).send('The Mission not found');

    const category= await Categ.findById(req.body.categoryId);
    if(!category) return res.statu(400).send(`La catégory n'existe pas.`);

    mission.set({
    name:req.body.name,
     time:req.body.time,
     nmbreJour:req.body.nmbreJour,
     details:req.body.details,
     availableForPersonn:req.body.availableForPersonn,
     when:req.body.when,
     priceOfHours:req.body.priceOfHours,
     category:{
         _id:category._id,
         name:category.name

     }
     
    });
    const totalPriceC=mission.calculateTotalPrice();
     mission.totalPrice=totalPriceC;
     
    await mission.save();
    res.send(mission);
}));

router.delete('/:id',[validObjectId,auth,isEntreprise],asyncMiddleware(async(req,res)=>{
    const mission = await Mission.findOneAndRemove({_id:req.params.id, 'userCreateMission._id':req.user._id});

    if(!mission) return res.status(404).send(`La mission n'existe pas!`);

    res.send(mission);
 
}));

module.exports= router;