const Joi=require('joi');
const mongoose= require('mongoose');
const Schema= mongoose.Schema;


const experienceSchema=new Schema({
profession:{
    type:String,
    required:true,
    minlength:3,
    maxlength:300
    },
nameOfCompagnie:{
    type:String,
    required:true,
    minlength:2,
    maxlength:300

    },
localisation:{
    type:String,
    minlength:0,
    maxlength:2000,
    required:false

    },
dateOfBeginning:{
    type:Date,
    required:true
},
actualJob:{
    type:Boolean,
    required:true


 },
 dateofEnd:{
     type:Date,
     required:function(){return this.actualJob? false : true},
     default:Date.now()
 },
 description:{
     type:String,
     minlength:0,
     maxlength:10000000
 },
 userExperience:{
     type:new mongoose.Schema({
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
          maxlength:255
      },
      phoneNumber:{
          type:String,
          minlength:9,
          maxlength:10,
          required:true
      },
     }),
     required:true
 }

});


const Experience =mongoose.model('Experience', experienceSchema);


function validateExperience(experience){
    const schema=Joi.object({
        profession:Joi.string().min(3).max(300).required(),
        nameOfCompagnie:Joi.string().min(3).max(300).required(),
        localisation:Joi.string().min(0).max(2000).allow('').optional(),
        dateOfBeginning:Joi.date().raw().required(),
        actualJob:Joi.boolean().required(),
        dateofEnd:Joi.date().when('actualJob',{is:true, then:Joi.optional(), otherwise:Joi.required()}),
        description:Joi.string().min(0).max(10000000).allow('').optional(),
        userId:Joi.string().required()

    });
    return schema.validate(experience);
}
exports.validExperience=validateExperience;
exports.Experience=Experience;
exports.experienceSchema=experienceSchema;