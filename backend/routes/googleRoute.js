import express from "express"
import {googleLoginController} from "../controllers/googleLoginController.js";


const googleRouter  = express.Router();

googleRouter.post("/google-login",googleLoginController);

export default googleRouter;