const Joi=require('joi');
const mongoose= require('mongoose');
const Schema= mongoose.Schema;


const categorySchema=new Schema({
 name:{
     type:String,
     required:true,
     minlength:3,
     maxlength:255
 }
});

const Category= mongoose.model('Category',categorySchema);

 
function validateCategory(category){
   const schema= Joi.object({
     name:Joi.string().min(3).max(255).required()

   });

   return schema.validate(category);
}

exports.categorySch=categorySchema;
exports.Categ=Category;
exports.validateCateg=validateCategory;