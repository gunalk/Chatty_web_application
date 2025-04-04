import jwt from "jsonwebtoken"
import user from "../models/user.model.js"


export const protectedRoute =async(req,res,next)=>{
    try{
    const token = req?.cookies?.jwt
    
    if(!token){
        return res.status(401).json({
            message:"Unauthorized - No Token Provided"
        })
    }
    const decoded =jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({
            message:"Unauthorized - Invalid Token "
        })

    }
    const userDetails =await user.findById(decoded.userId).select("-password")

    if(!userDetails){
        return res.status(404).json({
            message:"User not found "
        })
    }

    req.user=userDetails
    next()
    }
    catch(err){
    console.log("Protected Route err",err)
    return res.status(500).json({
        message: "Internal Server error",
      });
    }
}