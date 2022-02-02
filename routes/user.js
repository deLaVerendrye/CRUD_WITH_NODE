const router = require('express').Router();
const CryptoJs = require('crypto-js');
const userModel = require('../models/user');
const dotenv = require('dotenv').config();
const {verifyToken, TokenAndAdminVerification} = require('./tokenVerification');


/////---------------------------------------CREATE ACCOUNT-----------------------------------------

router.post('/register', async (req, res) => {

    const newUser = new userModel(
        {
            username: req.body.username,
            password: CryptoJs.AES.encrypt(req.body.password, process.env.skey).toString(),
            email: req.body.email
        }
    )

    try{
        await newUser.save();
        return res.status(201).json("user successfully saved");
    }catch(err){
        return res.status(500).json("an error occured");
    }
})


/////---------------------------------------UPDATE ACCOUNT-----------------------------------------

router.put('/:id', verifyToken, async (req, res) => {
    if(req.body.password){
        req.body.password = CryptoJs.AES.encrypt(req.body.password, process.env.skey).toString();
    }

    try{
        const updated = await userModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {new: true}
        );

        return res.status(200).json(updated);

    }catch(err){
        return res.status(400).json(err);
    }
})

/////---------------------------------------DELETE ACCOUNT-----------------------------------------

router.delete('/:id', verifyToken, async (req, res) => {
    try{
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).json("Account deleted");
    }catch(err){
        return res.json(500).json(err);
    }
})

/////---------------------------------------JUST SOME RANDOM STUFFS-----------------------------------------

//////////////////////////  GET USER
 router.get('/find/:id', verifyToken, async (req, res) => {
     try{
         const User = await userModel.findById(req.params.id);

         if(!User){
             return res.status(400).json("user not found");
         }

         const {password, ...others} = User._doc;

         res.status(200).json(others);
     }catch(err){
         res.status(500).json("an error occured");
     }
 })

 //////////////////////////  GET ALL USERs

 router.get('/findAll', TokenAndAdminVerification, async (req, res) => {
     try{
        const allUser = await userModel.find({}, "-_id -__v -password -isAdmin");
        return res.status(200).json(allUser);
     }catch(err){
         return res.status(500).json("an error occured when attempting to fetch resources");
     }
 })


 //////////////////////////  DELETE OTHER USER
 router.delete('/delete', TokenAndAdminVerification, async (req, res) => {
     try{
        await userModel.findByIdAndDelete(req.body.username);
        return res.status(200).json("successfully deleted the account");
     }catch(err){
        return res.status(500).json("An error occured when attempting to delete the resource")
     }
 })


module.exports = router;