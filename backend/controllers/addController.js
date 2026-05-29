import { trusted } from "mongoose";
import addedPatient from "../models/addModel.js";
import {io} from "../server.js"

export const getOnePatient = async (req, res) => {
  try {
    const user = await addedPatient.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not Found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error finding one patient:", error.message);
    res.status(500).json({ message: "Error finding one patient." });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await addedPatient.find().populate("createdBy","username email").sort({createdAt: -1}).lean();
    if (!patients || patients.length === 0) {
      return res
        .status(200)
        .json([]);
    }
    res.status(200).json(patients);
  } catch (error) {
    console.log("Error fetching all users:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all patients." });
  }
};

export const createPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      date,
      disease,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !date ||
      !disease
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const createdPatient = await addedPatient.create({
      firstName,
      lastName,
      gender,
      date: new Date(date),
      disease,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      // store the creator's ObjectId so populate() works correctly
      createdBy: req.user._id,
    });
    
    const payload = await addedPatient.findById(createdPatient.id).populate("createdBy","username role");

    io.to("admins").emit("patientCreated",payload);
    
    res.status(201).json({patient: payload});

  }  catch (error) {
    console.log("Error creating patient:", error.message);
    res.status(500).json({ success: false, message: "Error creating patient." },error.message);
  }
};

export const deletePatient = async (req, res) => {
  try{
    const deletedPatient = await addedPatient.findByIdAndDelete(req.params.id)
    if(deletedPatient){
      io.to("admins").emit("deletePatient",req.params.id)
      res.status(200).json({message:"Deleted Succesfully!"})
    }else{
      res.status(500).json({message:"Error deleting!"})
    }

  }catch(error){
    console.log("Error",error.message)
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { firstName, lastName, gender, date, disease } = req.body;
    const updatePayload = {
      firstName,
      lastName,
      gender,
      date: date ? new Date(date) : undefined,
      disease,
    };

    if (req.file) {
      updatePayload.image = `/uploads/${req.file.filename}`;
    }

    const updatedPatient = await addedPatient.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true },
    );

    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.log("Threw an error updating", error);
    res.status(500).json({ success: false, message: "Error updating patient." });
  }
};

export const hPatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await addedPatient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found!" });
    }

    if (patient.isHospitalized) {
      return res.status(400).json({ message: "Patient is already hospitalized!" });
    }

    patient.isHospitalized = true;
    patient.Status = "hospitalized";

    await patient.save();

    
    io.to("admins").emit("patientHospitalized", patient);

    return res.status(200).json({
      message: "Patient hospitalized successfully",
      patient,
    });

  } catch (error) {
    console.log("Error hospitalizing patient:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
