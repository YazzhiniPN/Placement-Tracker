const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function verifyToken(req,res,next){
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({err:"Access Token required"});
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id); //to chcek if the user exists, because while deleting a user,
                                                 //  we don't remove his tokens, so we check here
        if(!user){
            return res.status(401).json({err: "User no longer exists"})
        }


        req.user = user;      //this stores the user's info who is logged in and 
                                // it adds it to req, so in the next step, 
                                // we can check if the user is allowed to do that function
        next();
    }
    catch(err){
        return res.status(403).json({err: err.message})
    }
}

module.exports = {verifyToken};