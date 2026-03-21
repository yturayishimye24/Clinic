import mongoose from "mongoose";

const addSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurse",
  },
  isHospitalized: {
    type: Boolean,
    default: false,
  },
  Status: {
    type: String,
    enum: ["active", "hospitalized", "released"],
  },
  // Image: { type: String, default: "" },
},{timestamps:true});
const addedPatient = mongoose.model("addedPatient", addSchema);
export default addedPatient;
