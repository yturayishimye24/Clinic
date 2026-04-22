import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ONLINE_MONGO_URI);
    console.log("MongoDB connected Successfully!")
  } catch (error) {
    console.log("Error connecting", error);
  }
};

export default connectDB;
