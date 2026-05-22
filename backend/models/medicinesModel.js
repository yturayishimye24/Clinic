
import mongoose from "mongoose"


const newMedicinesSchema = new mongoose.Schema({
    medicineName:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:["pain","antibiotics","relief","vitamins"],
        required:true,
    },
    dosage:{
        type:String,
        required:true,
    },
    medicineType:{
        type: String,
        enum: ["tablet","capsule","syrup","suspensions"],
        required:true,  
    },
    quantity:{
        type:Number,
        required:true,
    },
    medicineUnits:{
        type:Number,
        required:true,
    },
    expiryDate:{
        type:Date,
        required:true,
    },
    instructions:{
        type:String,
        required:true,
    },
    sideEffects:{
        type:String,
        required:true,
    }
},{timestamps:true})

const Medecine = mongoose.model("Medecine",newMedicinesSchema);
export default Medecine;