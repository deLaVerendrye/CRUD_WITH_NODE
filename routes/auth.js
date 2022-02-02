const route = require('express').Router();
const JWT = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const userModel = require('../models/user');
const CryptoJs = require('crypto-js');

route.post('/login', async (req, res) => {
    try{
        const user = await userModel.findOne(
            {
                username: req.body.username
            }
        )

        if(!user){
            return res.status(400).json("user not found");
        }
        
        const sdecrypt = CryptoJs.AES.decrypt(user.password, process.env.skey).toString(CryptoJs.enc.Utf8);

        if(sdecrypt != req.body.password){
            return res.status(200).json("wrong password");
        }
        
        console.log(JWT.sign(
            {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            },
            process.env.auth_key,
            {expiresIn: "1d"}
        ));
        return res.status(400).json("successfully logged in");

    }catch(err){
        return res.status(500).json(err);
    }
})

module.exports = route;

