import express from "express";
import { createRequestAccount} from "../controllers/requestAccountController.js";

const requestAccountRouter = express.Router();

requestAccountRouter.post("/request-account",createRequestAccount);

export default requestAccountRouter;