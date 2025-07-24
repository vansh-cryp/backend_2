// file handling majority work is here
import { v2 as cloudinary } from "cloudinary";
// files system from node js
import fs from "fs";

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    // Upload an image
    //this is the code seen from chai aur code 
    //their is one original one on the cloudinary
     const uploadOnCloudinary = async (localFilePath)=>{
        try {
            if(!localFilePath) return null;
            //upload file from cloudinary 
           const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            //file has been uploaded
            //console.log("file has been uploaded on cloudinary",response.url);
            fs.unlinkSync(localFilePath);
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath);
            // remove the locally saved temorary file as the upload operation got failed
            return null;
        }
     }
   export {uploadOnCloudinary};
