import express from "express";
import { autheticate } from "../middlewares/autheticateToken.js";
import { uploadProfileImage } from "../middlewares/upload.js";
import { loginController, signupController, getNurses, getCurrentUser, deleteNurses, updateNurse } from "../controllers/userController.js";
const nurseRouter = express.Router();

nurseRouter.post("/login", loginController);
nurseRouter.post("/signup", signupController);
nurseRouter.get("/nurses", getNurses);
nurseRouter.get("/current", autheticate, getCurrentUser);
nurseRouter.delete("/nurses/:id", deleteNurses);
nurseRouter.put("/nurses/:id", autheticate, uploadProfileImage.single("image"), updateNurse);

export default nurseRouter;
