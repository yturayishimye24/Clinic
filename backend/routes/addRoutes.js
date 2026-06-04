import express from "express"
import { getAllPatients,getOnePatient,createPatient,deletePatient,updatePatient,hPatient,dispenseMedicineToPatient } from "../controllers/addController.js";  
import { requireRole } from "../middlewares/roleMiddleware.js";
import {autheticate} from "../middlewares/autheticateToken.js"
import {uploadPatientImage} from "../middlewares/upload.js";

const addRouter = express.Router();

addRouter.get("/displayPatients", getAllPatients);
addRouter.get("/:id", autheticate, getOnePatient);
addRouter.post(
  "/create",
  autheticate,
  requireRole(["nurse", "admin"]),
  uploadPatientImage.single("patientImage"),
  createPatient,
);
addRouter.put(
  "/:id",
  autheticate,
  requireRole(["nurse", "admin"]),
  uploadPatientImage.single("patientImage"),
  updatePatient,
);
addRouter.delete(
  "/:id",
  autheticate,
  requireRole(["nurse", "admin"]),
  deletePatient,
);
addRouter.patch(
  "/:id/hospitalize",
  autheticate,
  requireRole(["nurse", "admin"]),
  hPatient,
);

addRouter.post(
  "/dispense-medicine",
  autheticate,
  requireRole(["nurse", "admin"]),
  dispenseMedicineToPatient
);
export default addRouter

