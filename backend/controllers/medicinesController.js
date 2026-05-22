import Medicine from "../models/medicinesModel.js";

export const addMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      category,
      dosage,
      quantity,
      expiryDate,
      instructions,
      sideEffects,
      medicineType,
      medicineUnits,
    } = req.body;

    const CreatedMedicine = await Medicine.create({
      medicineName,
      category,
      dosage,
      instructions,
      sideEffects,
      expiryDate,
      medicineUnits,
      quantity,
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
    const medicine = (await Medicine.find()).toSorted({createdAt: -1});
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
    const medicineExist = await Medicine.find();
    if (medicineExist) {
      const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
    } else {
    }

    if (!deletedMedicine) {
      console.log("Error deleting medicine");
      res
        .status(500)
        .json({ success: false, message: "Error deleting medicines" });
    }
  } catch (error) {
    console.log("Error deleting medicnies!");
    res.status(500).json({ success: false, msg: "Error deleting medicine" });
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
        quantity,
        instructions,
        sideEffects,
        medicineType,
        medicineUnits,
      },
      { new: true },
    );
    if (!updatedMedicine) {
      res.status(500).json({ message: "Error updating", success: false });
    } else {
      res.json({ updatedMedicine });
    }
  } catch (error) {
    console.log("Error updating medicine");
    res.status(500).json({ success: false, msg: "Error deleting mecidines" });
  }
};
