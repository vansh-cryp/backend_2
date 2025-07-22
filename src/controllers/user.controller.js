import { asyncHandler } from "../utils/asyncHandler.js";
// used to reduce boilerplate code in async route handlers


const registerUser = asyncHandler(async(req,res)=>{
    res.status(200).json({
        message :"ok"
    })
}
);

export {registerUser};