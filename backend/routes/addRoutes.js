import express from "express"
import { getAllPatients,getOnePatient,createPatient,deletePatient,updatePatient,hPatient } from "../controllers/addController.js";  
import { requireRole } from "../middlewares/roleMiddleware.js";
import {autheticate} from "../middlewares/autheticateToken.js"
import {uploadPatientImage} from "../middlewares/upload.js";

const addRouter = express.Router();

addRouter.get("/displayPatients",getAllPatients);
addRouter.get("/:id",autheticate,requireRole("nurse"),getOnePatient);
addRouter.post("/create",autheticate,requireRole("nurse"),createPatient);
addRouter.put("/:id",autheticate,requireRole("nurse"),updatePatient);
addRouter.delete("/:id",autheticate,requireRole("nurse"),deletePatient);
addRouter.patch("/:id/hospitalize",autheticate,requireRole("nurse"),hPatient);
export default addRouter

