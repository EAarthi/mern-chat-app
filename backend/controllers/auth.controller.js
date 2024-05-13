import bcrypt from "bcryptjs";
import User from "../models/users.models.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup=async(req,res)=>{
    try{
        const {fullname,username,password,confirmpassword,gender}=req.body;
        if(password!=confirmpassword){
            return res.status(400).json({error:"Password do not match"})
        }
        const user=await User.findOne({username})
        if(user){
            return res.status(400).json({error:"Username Already Exits"})
        }

        //HASH PASSWORD
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);


        //https://avatar-placeholder.iran.liara.run/
        const boyprofilepic=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlprofilepic=`https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser=new User({
            fullname,
            username,
            password:hashedPassword,
            gender,
            profilepic:gender=="male"? boyprofilepic:girlprofilepic
        });
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            //201 successfully created
            res.status(201).json({
                    _id:newUser._id,
                    fullname:newUser.fullname,
                    username:newUser.username,
                    password:newUser.password,
                    gender:newUser.gender,
                    profilepic:newUser.profilepic
            });
            console.log("Stored Successfully");
        }
        else{
            res.status(400).json({error:"Invalid User details"});
        }
       
    }
    catch(error){
        console.log("Error in signup controller",error.message)
        res.status(500).json({error:"Internal server Error"})

    }

};
export const login=async(req,res)=>{
    try {
        const{username,password}=req.body;
        const user=await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});

        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilepic:user.profilepic
           
    });
       
        
    } catch (error) {
        console.log("Error in Login controller",error.message);
        res.status(500).json({error:"Internal server Error"});
        
    }   

    
};
export const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout Successfully"});
        
    } catch (error) {
        console.log("Error in Logout controller",error.message);
        res.status(500).json({error:"Internal server Error"});
        
    }
   
};