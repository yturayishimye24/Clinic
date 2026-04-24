import express from "express"
import {loginController,signupController,getNurses,getCurrentUser,deleteNurses,updateNurse} from "../controllers/userController.js"
const nurseRouter=express.Router();

nurseRouter.post("/login",loginController);
nurseRouter.post("/signup",signupController)
nurseRouter.get("/nurses",getNurses);
nurseRouter.get("/current",getCurrentUser);
nurseRouter.delete("/nurses/:id",deleteNurses);
nurseRouter.put("/nurses/:id",updateNurse);

export default nurseRouter;
