import mongoose from "mongoose"


const reportSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    body:{
        type:String,
        required:true,
    },
    conclusion:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Nurse",
        required: true,
    },
    createdAt:{
        type: Date,
        default:Date.now(),
    }
})

const Report = mongoose.model("Report",reportSchema);
export default Report;