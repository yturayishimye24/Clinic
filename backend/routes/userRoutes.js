import express from "express";
import { autheticate } from "../middlewares/autheticateToken.js";
import { loginController, signupController, getNurses, getCurrentUser, deleteNurses, updateNurse } from "../controllers/userController.js";
const nurseRouter = express.Router();

nurseRouter.post("/login", loginController);
nurseRouter.post("/signup", signupController);
nurseRouter.get("/nurses", getNurses);
nurseRouter.get("/current", autheticate, getCurrentUser);
nurseRouter.delete("/nurses/:id", autheticate, deleteNurses);
nurseRouter.put("/nurses/:id", autheticate, updateNurse);

export default nurseRouter;
