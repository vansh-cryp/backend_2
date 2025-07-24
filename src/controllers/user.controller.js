import { asyncHandler } from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiErros.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse}from "../utils/ApiResponse.js"
// used to reduce boilerplate code in async route handlers


const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontend
    //validation - not empty
    //check if user already exists
    //check for images and avater then upload to cloudinary
    //create user object-create entry in db
    //remove password and refrech token field from response
    //check for user creation 
    //return user

    const{username,fullname,email,password} = req.body;
    //console.log("email: ",email);
    //either use if else for each field otherwise use th below mehtod
    if(
        [fullname,email,username,password].some((field)=>field?.trim() === "")
        //some accepts 3 arguments and applies a function given to each filed
    ){
        throw new ApiError(400,"All field Required");
    }
    // check id user exists or not
    const existedUser = await User.findOne({
        //operater
        $or:[{email},{username}]
    });
    if(existedUser){
        throw new ApiError(409,"User with email or username exists");
    }
    //? is used  to check is we have access or not [0] is used to acess first property 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    //this gives the path of the document uploaded by multer
    //for can not read properties of undefined
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    } 
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage :coverImage?.url||"",
        email,
        password,
        username : username.toLowerCase(),
    })
    //used to remove field from the user while returning
    const userCheck = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!userCheck){
        throw new ApiError(400,"Something went wrong while registering user");
    }
    return res.status(201).json(
        new ApiResponse(200,userCheck,"User registered successfully")
    )
}
);

export {registerUser};