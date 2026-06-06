import Medicine from "../models/medicinesModel.js";
import Notification from "../models/notificationsModal.js";
import { io } from "../server.js";

export const addMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      category,
      dosage,
     
      expiryDate,
      instructions,
      sideEffects,
      medicineType,
      units,
    } = req.body;

    const CreatedMedicine = await Medicine.create({
      medicineName,
      category,
      dosage,
      instructions,
      sideEffects,
      expiryDate,
      units,
    
      medicineType,
    });

    if (!CreatedMedicine) {
      res
        .status(500)
        .json({
          success: false,
          msg: "Erroring creating a medicine! Please try again later",
        });
    } else {
      const notification = await Notification.create({
        title: "New medicine added",
        message: `${CreatedMedicine.medicineName} (${CreatedMedicine.dosage}) was added to inventory.`,
        type: "medicine",
      });

      io.to("admins").emit("newNotification", notification);

      res
        .status(201)
        .json({
          success: true,
          msg: "Medicine created successfully!",
          medicine: CreatedMedicine,
          CreatedMedicine,
        });
    }
  } catch (error) {
    console.log("Error creating medicine!", error.message);
    res
      .status(501)
      .json({ success: false, message: "Server error creating medicine" });
  }
};

export const getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.find().sort({createdAt: -1});
    if (medicine) {
      res
        .status(200)
        .json({ success: true, msg: "Success in getting medicine", medicine });
    } else {
      res
        .status(404)
        .json({
          success: false,
          msg: "Error fetching medicines, please try again later!",
        });
    }
  } catch (error) {
    console.log("Error fetching medicines");
    res.status(501).json({ success: false, msg: "Error fetching medicines!" });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!deletedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }
    const notification = await Notification.create({
      title: "Medicine deleted",
      message: `${deletedMedicine.medicineName} (${deletedMedicine.dosage}) was removed from inventory.`,
      type: "medicine",
    });
    io.to("admins").emit("deletedMedicine", req.params.id);
    io.to("admins").emit("newNotification", notification);
    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      deletedMedicine,
    });
  } catch (error) {
    console.log("Error deleting medicines!", error.message);

    return res.status(500).json({
      success: false,
      msg: "Error deleting medicine",
    });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const updatedMediciine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        medicineName,
        category,
        dosage,
        expiryDate,
        instructions,
        sideEffects,
        medicineType,
        units,
      },
      { new: true },
    );
    if (!updatedMedicine) {
      res.status(500).json({ message: "Error updating", success: false });
    } else {
      io.to("admins").emit("newNotification", notification);
      res.json({ updatedMedicine });
    }
  } catch (error) {
    console.log("Error updating medicine");
    res.status(500).json({ success: false, msg: "Error deleting mecidines" });
  }
};
