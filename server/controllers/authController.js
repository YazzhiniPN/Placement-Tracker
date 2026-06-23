const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function userLogin(req,res){
    try{
        if(!req.body.username || !req.body.password){
            return res.json({err: "Invalid Creddentials"});
        }

        const found = await User.findOne({username: req.body.username});
        if(!found){
            return res.status(403).json({err: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(req.body.password, found.password);
        if(!isMatch){
            return res.status(403).json({
                err: "Invalid credentials"
            });
        }

        const accessToken = jwt.sign(
            {
                id: found._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m" 
            }
        );

        const refreshToken = jwt.sign(
           {
                id: found._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        });

        found.refreshToken = refreshToken;
        await found.save();

        return res.json({
            msg: "Login Successful",
            accessToken,
            user: {
                username: found.username, 
            }
        });
    }

    catch(err){
        return res.json({err: err.message})
    }

}

async function userRegister(req,res){
    try{
        if(!req.body.name|| !req.body.username || !req.body.password || !req.body.email || !req.body.branch || !req.body.year){
            return res.status(400).json({err: "Required fields missing"});
        }
        const found = await User.findOne({
            $or: [
                {username: req.body.username},
                {email: req.body.email}
            ]
        });
        if(found){
            return res.status(400).json({err: "Username or email already taken"});
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            branch: req.body.branch,
            year: req.body.year
        })

        await newUser.save();

        res.json({msg: "User created", 
            username: newUser.username});
    }
    catch(err){
        return res.json({err: err.message});
    }
}

async function userLogout(req,res){
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(400).json({err: "No refresh Token found"});
        }
        const user = await User.findOne({refreshToken: refreshToken});
        if(user){
            user.refreshToken = null;
            await user.save();
        }
    
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        return res.json({msg: "Logged Out"});
    }
    catch(err){
        return res.json({err: err.message});
    }
}

async function refreshAccessToken(req,res){
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(400).json({err: "No refresh token found"});
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ) // to check the refresh token is not expired/modified

        const user = await User.findOne({refreshToken: refreshToken});
        if(!user){
            return res.status(400).json({err: "User not found"});
        }

        //if(user.refreshToken !== refreshToken){ // not req because we are checking the db with the ref token , if it doesn't match we won't get any
           
        const accessToken = jwt.sign(
        {
            id: user._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        }
        );
        return res.json({accessToken});        
    }
    catch(err){
        return res.status(403).json({err: err.message});
    }
}


module.exports = {userRegister, userLogin, userLogout, refreshAccessToken};