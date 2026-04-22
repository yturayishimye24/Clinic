import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  Status: {
    type: String,
    enum: ["pending", "rejected", "approved"],
  },
  status: {
  type: String,
  enum: ["pending", "rejected", "approved"],
  default: "pending"
},
  requestType: {
    type: String,
    enum: ["Medicine", "Equipment", "Supply", "Blood", "Lab"],
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  patientCount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  urgency: {
    type: String,
    enum: ["low", "high", "medium"],
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Nurse",
  }
});

const request = mongoose.model("request", requestSchema);
export default request;
