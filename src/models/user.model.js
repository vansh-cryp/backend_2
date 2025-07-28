import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    
    username:{
        required: true,
        type : String,
        unique : true,
        lowercase : true,
        trim :true,
        index :true
    },
    email:{
        required: true,
        type : String,
        unique : true,
        lowercase : true,
        trim :true
    },
    fullname:{
        required: true,
        type : String,
        lowercase : true,
        trim :true,
        index :true
    },
    avatar :{
        type : String,
        required : true,
    },
    coverImage:{
        type :String
    },
    watchHistory :[
        {
            type : Schema.Types.ObjectId,
            ref : "Videos"
        }
    ],
    password :{
        type : String,
        required : [true,"Password is required"]
    },
    refreshToken:{
        type : String
    }

},{timestamps:true});
//jwt is a berarer token like a master key it gives data to any person who has this token
//run this code only if password is changed
// pre hook is used just before the saving of payload
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
      this.password = await bcrypt.hash(this.password,10);
      next()
    }else{
        return next();
    }
});
// to check is password correct
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken= function(){

    return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User",userSchema);