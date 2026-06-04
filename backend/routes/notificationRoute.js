import express from "express";
import { getNotifications } from "../controllers/notificationController.js";

const Notificationrouter = express.Router();

Notificationrouter.get("/", getNotifications);

export default Notificationrouter;