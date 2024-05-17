import jwt, { decode } from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt; //Retreive a token.
        
        if(!token){
            return res.status(401).json({error: "Unauthorized - No Token Provided"}); //Validate the token.
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET); //Decode the Token.

        if(!decoded){
            return res.status(401).json({error: "Unauthorized - Invalid Token"}); //Validation of Decoding.
        }

        const user = await User.findById(decoded.userId).select("-password"); //Looking for existing user.

        if(!user){
            return res.status(404).json({error: "User not found"}); //Validating the user.
        }

        req.user = user; //Getting the user.

        next() //Calling the next function either get or send message.

    } catch(error){
        console.log("Error in protectRoute middleware:",error.message);
        res.status(500).json({error: "Internal server error"}); //Handling the error.
    }
}

export default protectRoute;