const users= require('../route/user');
const mission = require('../route/mission');
const auth = require('../route/auth'); 
const userMission=require('../route/userMission');
const forgotPassword=require('../route/forgot-password');
const resetPassword= require('../route/reset-password');
const verifEmail=require('../route/verification-email');
const SearcMission=require('../route/searchMission');
const category=require('../route/category');
const experience=require('../route/experience');
const error= require('../middleware/error');
const express = require('express');

module.exports=function(app){
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,x-auth-token, Content-Type, Accept");
    res.header('Access-Control-Expose-Headers','x-auth-token');
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, DELETE");
    next();
});

app.use('/api',SearcMission);
app.use('/api/users', users);
app.use('/api/missions', mission);
app.use('/api/auth', auth);
app.use('/api/userMissions',userMission);
app.use('/api/forgotPassword', forgotPassword);
app.use('/api/resetPassword', resetPassword);
app.use('/api/verifyEmail',verifEmail);
app.use('/api/category',category);
app.use('/api/experienceInterim',experience);


app.use(error);
}