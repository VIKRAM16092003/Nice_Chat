import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
export const protectRoute=async (req,res,next) => {
    try {
        //console.log("Cookies received:", req.cookies);
        const token=req.cookies.jwt;
        if(!token)
        {
            return res.status(401).json({
                message:"unAuthorised -no token provided"
            });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        
        if(!decoded)
        {
            return res.status(401).json({
                meessage:"unAuthorised -no token provided"
            });
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user)
        {
            return res.status(404).json({
                message:"User Not Found"
            });
        }
        
        req.user=user;
        next()
    } catch (error) {
        return res.status(500).json({
            meessage:"Internal error"
        });
    }
}