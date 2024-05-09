import jwt from "jsonwebtoken";

const generateTokenAndSetCookie=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SCERET,{
        expiresIn:"15d",
    });
    res.cookie("jwt",token,{
        maxAge:15 * 24 * 60 * 60 * 1000,
        httpOnly:true,//prevent  XSS attack
        sameSite:"strict",//CSRF attack
        secure:process.env.NODE_ENV !=="development",
    });
};
export default generateTokenAndSetCookie;
