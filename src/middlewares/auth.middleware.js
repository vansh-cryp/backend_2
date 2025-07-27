import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiErros";
import { asyncHandler } from "../utils/asyncHandler";
import { jwt } from "jsonwebtoken";

// this verifies it is a user or not
export const verifyJWT = asyncHandler(async(req, _,next)=>{
    //second check is done that if the user is a mobile application user or custion header is used
    try {
        const token = req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process
            .env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?.
            _id.select("-password -refreshToken"));
        if(!user){
            //discussion for frontend
            throw new ApiError(401,"Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message ||"Invalid access token")
    }
}) 