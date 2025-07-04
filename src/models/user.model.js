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
    coverimage:{
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

//run this code only if password is changed
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
      this.password = bcrypt.hash(this.password,10);
      next()
    }else{
        return next();
    }
});
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User",userSchema);