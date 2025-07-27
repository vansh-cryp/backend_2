import { asyncHandler } from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiErros.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse}from "../utils/ApiResponse.js"
import cookieParser from "cookie-parser";
// used to reduce boilerplate code in async route handlers
const generateAccessAndRefreshToken = async(userId){
    try {
       const user = await User.findById(userId);
       const accessToken =  user.generateAccessToken();
       const refreshToken = user.generateAccessToken();
       // generate the refresh token and save it in the database
       user.refreshToken = refreshToken;
       // before saving clarify that no other fileds are required
       //i mean if i am saving this filed dont validate other fields like password
       await user.save({validateBeforeSave : false});
       return {accessToken,refreshToken};



    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
};

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
)
const loginUser = asyncHandler(async(req,res)=>{
    // take data from req body
    //username or email presenet any will work its up to you
    //find the user
    //password check 
    //generate acess and refresh token ang give to user
    //send the token in cookies
    const {username,email,password} = req.body;
    if(!username || !email){
        throw new ApiError(400,"Username and password is required");
    }
    const user = await User.findOne({
        $or:[{email},{username}]
    });
    if(!user){
        throw new ApiError(404,"user does not exist");
    }

    const isPasswordValid =await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Credentials");
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
    //send the data in the cookies 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    //this step make the cookies only server side modifiable
    const options = {
        httpOnly :true,
        secure : true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200,{
            user : loggedInUser,accessToken,refreshToken
        },"User logged in successfully")
    );
}
)


const logOutUser = asyncHandler(async(req,res)=>{
    //remove the cookies got loging out
    // and reset the refresh token in the database
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{refreshToken:undefined}
        },{
            new : true
        }
    );
    //new true is used so that the updated data is send
    const options = {
        httpOnly :true,
        secure : true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User loged out"))
})
export {registerUser,loginUser,logOutUser};