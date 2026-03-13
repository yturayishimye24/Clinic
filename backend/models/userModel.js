import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    role:{
      type:String,
      enum:["admin","nurse","user"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    hireDate:{
      type: Date,

    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = function(enteredPassword){
return bcrypt.compare(enteredPassword,this.password)

}
const Nurse = mongoose.models.Nurse || mongoose.model("Nurse", userSchema);
export default Nurse;