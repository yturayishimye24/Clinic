import express from "express"
import {getRequests,createRequests,removeRequests,changeRequests,approveRequests} from "../controllers/requestController.js"
import { autheticate } from "../middlewares/autheticateToken.js"
const requestRouter = express.Router();

requestRouter.get("/showRequests",autheticate,getRequests)
requestRouter.post("/createRequests",createRequests)
requestRouter.delete("/removeRequests/:id",autheticate,removeRequests)
requestRouter.put("/changeRequests/:id",autheticate,changeRequests)
requestRouter.patch("/approve/:id",autheticate,approveRequests)
export default requestRouter;
