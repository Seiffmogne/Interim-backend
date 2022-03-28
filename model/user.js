const mongoose= require('mongoose');
const Joi = require('joi');
const config= require('config');
const jwt = require('jsonwebtoken');
const Schema= mongoose.Schema;


const userSchema= new Schema({
  name:{
      type:String,
      minlength:5,
      maxlength:200,
      required:true
  },
  email:{
    type:String,
    required:true,
    minlength:5,
    maxlength:255,
},
phoneNumber:{
    type:String,
    minlength:9,
    maxlength:10,
    required:true
},
password:{
   type: String,
   required: true,
   minlength:5,
   maxlength:1054
},
isEntreprise:{
    type:Boolean,
    required:true,

},
locationofEntreprise:{
    type:String,
    required:function(){return this.isEntreprise},
    minlength:5,
    maxlength:10000
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
    max:1000000
},
nameofEntreprise:{
    type:String,
  required:function(){return this.isEntreprise},
    minlength:3,
    maxlength:1000
},
siren:{
    type:String,
    required:function(){return this.isEntreprise},
    minlength:6,
    maxlength:14

},
isVerified:{
    type:Boolean,
    default:false,
    required:true
},
canAccept:{
    type:Boolean,
    default:true,
    required:true
}

});

userSchema.methods.generateAuthToken= function(){
    const token = jwt.sign({_id: this._id, isEntreprise: this.isEntreprise,name:this.name}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const shema= Joi.object({
        name: Joi.string().min(5).max(200).required(),
        email: Joi.string().min(5).required().email(),
        phoneNumber:Joi.string().min(9).max(10).required(),
        password:Joi.string().min(5).max(1024).required(),
        isEntreprise:Joi.boolean().required(),
        locationofEntreprise:Joi.string().min(5).max(10000).when('isEntreprise',{is:true, then:Joi.required(), otherwise:Joi.optional()}),
        complementLocationofEntreprise:Joi.string().min(5).max(10000).when('isEntreprise',{is:true, then:Joi.required(), otherwise:Joi.optional()}),
        zipCode:Joi.number().min(0).max(1000000).when('isEntreprise',{is:true, then:Joi.required(), otherwise:Joi.optional()}),
        siren:Joi.string().min(6).max(14).when('isEntreprise',{is:true, then:Joi.required(), otherwise:Joi.optional()}),
        nameofEntreprise:Joi.string().min(3).max(1000).when('isEntreprise',{is:true, then:Joi.required(), otherwise:Joi.optional()})

    });
    return  shema.validate(user);

}

exports.User=User;
exports.validateUser=validateUser;