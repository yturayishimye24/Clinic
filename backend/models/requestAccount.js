

import mongoose from "mongoose"

const accountSchema = new mongoose.Schema({
    name:{
        type:String,
        email:String,
        message:String
    }
},{timestamps:true});


export default mongoose.model("RequestAccount",accountSchema);