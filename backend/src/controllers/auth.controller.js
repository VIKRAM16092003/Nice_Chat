import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signup=async (req,res)=>
    {
        const {fullName,email,password}=req.body
        console.log(req.body);
        
        try {
            if(!fullName||!email||!password)
            {
                return res.status(400).json({messsage:"all fields required!!!"})
            }
            //hash password and checking
            if(password.length<6)
            {
                return res.status(400).json({messsage:"password must be at least 6 characters!!!"})
            }
            const user=await User.findOne({email})
            if(user)
            {
                return res.status(400).json({messsage:"Email already exist!!!"})
            }
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt)
            const newUser=new User({
                fullName:fullName,
                email:email,
                password:hashedPassword
            })
            if(newUser)
            {
                generateToken(newUser._id,res)
                await newUser.save();
                res.status(201).json({
                    _id:newUser._id,
                    fullName:newUser.fullName,
                    email:newUser.email,
                    profilePic:newUser.profilePic
                })
            }
            else{
                return res.status(400).json({messsage:"invalid user data!!!"})
        }
            }
        catch (error) {
            return res.status(500).json({messsage:"internal server error"});
        }
    };
export const login=async (req,res)=>
    {
        const {email,password}=req.body;
        try {
            const user=await User.findOne({email})
            if(!user)
            {
                return res.status(400).json({
                    message:"invalid credentials"
                })
            }
            const ispasswordCorrect=await bcrypt.compare(password,user.password);
            if(!ispasswordCorrect)
                {
                   return res.status(400).json(
                    {
                        message:"invalid credentials"
                    }
                   );
                }
            generateToken(user._id,res)
            res.status(200).json(
                {
                    _id:user._id,
                    fullName:user.fullName,
                    email:user.email,
                    profilePic:user.profilePic,
                }
            )
        } catch (error) {
            console.log("error in login controller",error.messsage);
            res.status(500).json({
                message:"Internal server error"
            });
            
        }

    };
export const logout=(req,res)=>
    {
        try {
            res.cookie("jwt","",{maxAge:0});
            res.status(200).json({
                message:"loggedout successfully"
            });
        } catch (error) {
            res.status(500).json({
                message:"Internal Server Error"
            });
        }
    };
export const updateProfile=async (req,res)=>
{ 
   try {
    
    
    const{profilePic}=req.body;
    const userId=req.user._id;
    if(!profilePic)
    {
        return res.status(400).json({
            message:"Profilepic required!!!"
        })
    }
    const uploadResponse=await cloudinary.uploader.upload(profilePic)
    const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

    if (!updateUser) {
        return res.status(404).json({ message: "User not found!" });
      }
    res.status(200).json(updateUser);
    }
 catch (error) {
    res.status(500).json({
        message:"Internal Server Error"
    });
   }
}
export const checkAuth=async (req,res)=>
{
    //console.log("User in checkAuth:", req.user);
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        //console.log("User in checkAuth:", req.user);
        
        res.status(200).json(req.user);
    } catch (error) {

        res.status(500).json({
        message:"Internal Server Error"
    });
    }
}