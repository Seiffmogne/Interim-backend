const jwt=require('jsonwebtoken');
const {User}=require('../model/user');
const config=require('config');
const mongoose=require('mongoose');


describe('generateAuthToken',()=>{

 it('should return a valid token',async()=>{
     const payload={_id:mongoose.Types.ObjectId(),name:'Mogne'}
     const user= new User(payload);

     const token =user.generateAuthToken();
     const decoded=jwt.verify(token,config.get('jwtPrivateKey'));
      expect(decoded).toMatchObject(payload);


 });
});