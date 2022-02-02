const JWT = require('jsonwebtoken');

function verifyToken(req, res, next){
    const authHeader = req.headers.token;

    if(authHeader){
        try{
            const token = authHeader.split(" ")[1];
            console.log(token);
            const verification = JWT.verify(token, process.env.auth_key);

            console.log(verification);
            next();
        }catch(err){
            res.status(400).json(err);
        }
    }else{
        console.log(authHeader);
        return res.status(400).json("You are not authenticated");
    }
}

function TokenAndAdminVerification(req, res, next){
    const authHeader = req.headers.token;
     try{
         const token = authHeader.split(" ")[1];
         const verification = JWT.verify(token, process.env.auth_key);

         if(!verification.isAdmin){
             return res.status(400).json("You are not allowed to do that");
         }

         next();
     }catch(err){
         return res.status(400).json("couldn't verify user account try again later");
     }
}

module.exports = {verifyToken, TokenAndAdminVerification};