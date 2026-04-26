import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Nurse from "../models/userModel.js";
import dotenv from "dotenv";
import {io} from "../server.js"

dotenv.config();
const userToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "10d" });
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Nurse.findOne({ email });
    if (!email || !password) {
      return res.json({ success: false, message: "Please provide email" });
    }
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }
    const isMatch = await user.verifyPassword(password);
    if (isMatch) {
      const token = userToken(user._id, user.role);
      res.json({
        success: true,
        message: "Login successful!",
        token,
        user,
        role: user.role,
        
      });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error.message)
    return res.json({ success: false, message: error.message })
  }
};

export const signupController = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    const exists = await Nurse.findOne({ email});
    if (exists) {
      return res.json({
        success: false,
        message: "User already exists. Try different email.",
      })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Nurse({
      username,
      email,
      role,
      password: hashedPassword,
    });
    const user = await newUser.save();
    io.to("admins").emit("newNurse",user);
    const token = userToken(user._id, user.role);
    
    res.json({
      success: true,
      message: "Account created Successfully!",
      token,
      username: user.username,
      password:user.password,
      role: user.role,
    });
  } catch (error) {
    console.log("Error registering", error);
    res.json({ success: false, message: error.message || "Error registering" });
  }
};

export const getNurses = async (req, res) => {
  try {
    const nurses = await Nurse.find({ role: "nurse" });
    if (!nurses || nurses.length === 0) {
      return res.status(404).json({ success: false, message: "No nurses Found" });
    }
    const nurseEmails = nurses.map(nurse => nurse.email);
    const userName = nurses.map(nurse => nurse.username);
    const role = nurses.map(nurse => nurse.role);
    const hireDate= nurses.map(nurse => nurse.hireDate)
    res.status(200).json({ success: true,nurses,hireDate, emails: nurseEmails, usernames: userName, roles: role });
  } catch (error) {
    console.log("Error getting nurses", error.message);
    res.status(500).json({ success: false, message: error.message || "Error getting nurses" });
};
};

export const deleteNurses = async (req, res) =>{
  const {id}=req.params;
  try{
 const deletedNurse = await Nurse.findByIdAndDelete(id);
 if(!deletedNurse){
  return res.status(404).json({success:false,message:"Nurse not found!"})
 }
 io.to("admins").emit("nurseDeleted",id);
 res.status(200).json({success:true,message:"Nurse deleted successfully!"});
  }catch(error){
    console.log("Error deleting nurse", error.message);
    res.status(500).json({ success: false, message: error.message
      || "Error deleting Nurse!"
    })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // from autheticate middleware
    const user = await Nurse.findById(userId).select('email username role image');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      email: user.email,
      username: user.username,
      role: user.role,
      image: user.image
    });
  } catch (error) {
    console.log("Error getting current user", error.message);
    res.status(500).json({ success: false, message: error.message || "Error getting user" });
  }
};

export const updateNurse = async (req, res) => {

  try{
    const { id } = req.params;

    const { username, email, role } = req.body;

    const updatedNurse = await Nurse.findByIdAndUpdate(
      id,
      {username, email, role},
      { new: true}
    )
    if(!updatedNurse){
      return res.status(404).json({ success: false, message: "Nurse not found!" });
    }

    const payload = updatedNurse.toObject ? updatedNurse.toObject() : updatedNurse;
    io.to("admins").emit("nurseUpdated", payload);
    res.status(200).json({ success: true, message: "Nurse updated successfully!", nurse: payload });

  }catch(error){
    console.log("Error updating nurse", error.message);
    res.status(500).json({ success: false, message: error.message || "Error updating nurse"})
  }
}