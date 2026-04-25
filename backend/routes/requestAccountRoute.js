import express from "express";
import { createRequestAccount} from "../controllers/requestAccountController.js";

const requestAccountRouter = express.Router();

requestAccountRouter.post("/",createRequestAccount);


export default requestAccountRouter;