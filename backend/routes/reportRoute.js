import express from "express"
import {createReport,displayReport,updateReport,deleteReport} from "../controllers/reportController.js"
import { autheticate } from "../middlewares/autheticateToken.js"

const reportRouter = express.Router();

reportRouter.post("/create_report",autheticate,createReport)
reportRouter.get("/display_report",displayReport)
reportRouter.put("/update_report/:id",autheticate,updateReport)
reportRouter.delete("/delete_report/:id",autheticate,deleteReport)

// export default reportRouter;
export default reportRouter;
