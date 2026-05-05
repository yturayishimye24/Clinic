
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
        type:Selection,
        required:true,
    },
    quantity:{
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
})

const Medecine = mongoose.model("Medecine",newMedicinesSchema);
export default Medecine;