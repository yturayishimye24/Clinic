import express from "express"
import {addMedicine} from "../controllers/medicinesController.js"


const MedicineRouter = express.Router();


MedicineRouter.post("/create",addMedicine);