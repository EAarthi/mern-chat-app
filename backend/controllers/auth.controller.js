import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import generateTokenAndSetCookie from '../utils/generateTokens.js';

export const signup = async(req,res) => {
    try{
        const {fullname,username,password,confirmpassword,gender} = req.body;
        if (!fullname || !username || !password || !confirmpassword || !gender) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        if(password !== confirmpassword){
            return res.status(400).json({error:"Passwords don't match"});
        }

        const user = await User.findOne({username});

        if(user){
            return res.status(400).json({error:"Username already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newuser = await User({
            fullname,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender == "male" ? boyProfilePic : girlProfilePic
        });


        if(newuser){
            
            generateTokenAndSetCookie(newuser._id,res);
            await newuser.save();

            res.status(201).json({
                _id: newuser._id,
                fullname: newuser.fullname,
                username: newuser.username,
                profilePic: newuser.profilePic
            });
        } else{
            res.status(400).json({error:"Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Internal Servor Error"});
    }
}

export const login = async (req,res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid credentials"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
                fullname: user.fullname,
                username: user.username,
                profilePic: user.profilePic
        });//profilepic

    } catch (error) {
        console.log("Error in Login controller",error.message);
        res.status(500).json({error:"Internal Servor Error"});
    }
}

export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in Login controller",error.message);
        res.status(500).json({error:"Internal Servor Error"});
    }
}