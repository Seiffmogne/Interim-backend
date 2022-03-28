const Joi=require('joi');
const mongoose=require('mongoose');
const Schema= mongoose.Schema;


const locationSchema= new Schema({
    address:{
        type:String,
        required:true,
        minlength:5,
        maxlength:355
    },
    adressComplement:{
        type:String,
        minlength:5,
        maxlength:355
    },
    zip:{
        type:Number,
        required:true,
        min:0,
        max:10000
    }
});

const Locations= mongoose.model('Location',locationSchema);

function validateLocation(location){
    const shema=Joi.object({
        address:Joi.string().min(5).max(355).required(),
        adressComplement:Joi.string().min(5).max(355).required(),
        zip:Joi.number().min(0).max(10000).required()

    });
    return shema.validate(location);
} 

exports.Location=Locations;
exports.validateLoca=validateLocation;
exports.LocaShema=locationSchema;