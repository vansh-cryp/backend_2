import mongoose, {Schema,model} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        //the one who is subscribing
        type : Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        //one to which hte user subscribes
        type : Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export const Subscription = mongoose.model("Subscription",subscriptionSchema);