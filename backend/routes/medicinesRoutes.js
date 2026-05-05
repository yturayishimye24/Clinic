import express from "express"
import {addMedicine,deleteMedicine,updateMedicine,getMedicine} from "../controllers/medicinesController.js"
import {autheticate} from "../middlewares/autheticateToken.js"

const MedicineRouter = express.Router();


MedicineRouter.post("/create",addMedicine);
MedicineRouter.delete("/delete/:id",deleteMedicine);
MedicineRouter.put("/update/:id",updateMedicine);
MedicineRouter.get("/display",autheticate,getMedicine);

export default MedicineRouter;