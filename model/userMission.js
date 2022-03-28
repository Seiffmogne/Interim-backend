const mongoose=require('mongoose');
const Joi=require('joi');
const {missionSchema}= require('./mission');
const Schema= mongoose.Schema;

const userMissionSchema=new Schema({
    mission:{
      type:missionSchema,
      required:true
    },
    user:{
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
                maxlength:255,
            },
            phoneNumber:{
                type:String,
                minlength:9,
                maxlength:10,
                required:true
            }
        }),
        required:true
    }



});
const userMission=mongoose.model('UserMission',userMissionSchema);

function validateUserMission(userMission){
    const schema=Joi.object({
        missionId:Joi.string().required(),
        userId:Joi.string().required()
    });
    return schema.validate(userMission);
}

exports.userMission=userMission;
exports.validateUserMission=validateUserMission;