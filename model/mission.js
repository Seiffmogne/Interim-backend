const Joi= require('joi');
const mongoose= require('mongoose');
const {categorySch}= require('../model/category');
const Schema= mongoose.Schema;


const missionSchema= new Schema({
details:{
    type:String,
    minlength:0,
    maxlength:1024,

},
time:{
    required:true,
    type:Number,
    min:1,
    max:200

},
nmbreJour:{
    required:true,
    type:Number,
    min:1,
    max:200

},
availableForPersonn:{
    type:Number,
    required:true,
    min:0,
    max:255
},
priceOfHours:{
    type:Number,
    required:true,
    min:0,
    max:10000


},
date:{
    type:Date,
    default:Date.now
},
userCreateMission:{
    type:new mongoose.Schema({
        isEntreprise:{
            type:Boolean,
            required:true,
        
        },
        email:{
            type:String,
            required:true,
            minlength:5,
            maxlength:255,
            
        },
        name:{
            type:String,
            minlength:5,
            maxlength:200,
            required:true
        },
      locationofEntreprise:{
          type:String,
          required:function(){return this.isEntreprise},
          minlength:5,
          maxlength:1500
      },
      complementLocationofEntreprise:{
        type:String,
        required:function(){return this.isEntreprise},
        minlength:5,
        maxlength:10000
    },
    zipCode:{
        type:Number,
        required:function(){return this.isEntreprise},
        min:0,
        max:10000000
    },
      nameofEntreprise:{
        type:String,
      required:function(){return this.isEntreprise},
        minlength:3,
        maxlength:1000
    }
    }),
    required:true
},
totalPrice:{
    type:Number,
    required:true

},
isAccepted:{
    type:Boolean,
    required:true,
    default:false

},
category:{
    type:categorySch,
    required:true
},
when:{
    type:Date,
    required:true
}
});
missionSchema.methods.calculateTotalPrice=function(){
    return (this.time * this.priceOfHours) * this.nmbreJour;

}

const Mission= mongoose.model('Mission',missionSchema);


function validateMision(mission){
   const schema= Joi.object({
     details:Joi.string().min(0).max(1024).allow('').optional(),
     time:Joi.number().min(1).max(200).required(),
     nmbreJour:Joi.number().min(1).max(200).required(),
     availableForPersonn:Joi.number().min(0).max(255).required(),
     priceOfHours:Joi.number().min(0).max(10000).required(),
     when:Joi.date().raw().required(),
     userId:Joi.string().required(),
     categoryId:Joi.string().required()
   });

   return schema.validate(mission);
}

exports.validateMission= validateMision;
exports.missionSchema=missionSchema;
exports.Mission= Mission;