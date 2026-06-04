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
  image: {
    type: String,
    default: "",
  },

  prescriptions: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine" 
      },
      quantityGiven: {
        type: Number,
        required: true
      },
      dateGiven: {
        type: Date,
        default: Date.now
      },
      dosingSchedule: {
        morning: {
          type: String,
          default: "0"
        },
        afternoon: {
          type: String,
          default: "0"
        },
        evening: {
          type: String,
          default: "0"
        }
      },
      notes: {
        type: String,
        default: ""
      }
    }
  ]
},{timestamps:true});
const addedPatient = mongoose.model("addedPatient", addSchema);
export default addedPatient;
