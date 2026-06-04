import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import nurseRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import addRouter from "./routes/addRoutes.js";
import { seed } from "./userSeed.js";
import requestRouter from "./routes/requestRoutes.js";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import Nurse from "./models/userModel.js";
import emailRouter from "./routes/getEmail.js";
import router from "./routes/verifyRoute.js";
import reportRouter from "./routes/reportRoute.js";
import path from "path";
import MedicineRouter from "./routes/medicinesRoutes.js";
import requestAccountRouter from "./routes/requestAccountRoute.js";
import Notificationrouter from "./routes/notificationRoute.js";
dotenv.config();

const port = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://asyvvillageclinic.vercel.app",
  process.env.CORS_ORIGIN,
].filter(Boolean);

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/accounts", nurseRouter);
app.use("/api/patients", addRouter);
app.use("/api/requests", requestRouter);
app.use("/api/infos", emailRouter);
app.use("/api/verify", router);
app.use("/api/report", reportRouter);
app.use("/api/request-account", requestAccountRouter);
app.use("/api/medicines",MedicineRouter);
app.use("/api/notifications", Notificationrouter);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Nurse.findById(payload.id).select("-password");
    if (!user) return next(new Error("No user found"));
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Error authenticating: " + error.message));
  }
});

io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id,
    "user:",
    socket.user.username,
    socket.user.role,
  );

  if (socket.user.role === "admin") {
    socket.join("admins");
    console.log(`${socket.user.username} joined admins room`);
  }
  if (socket.user.role === "nurse") {
    socket.join("nurses");
    console.log(`${socket.user.username} joined nurses room`);
  }

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

connectDB();
seed();

// Register GraphQL routes after `app` is created
// app.get("/playground", (req, res) => {
//   res.type("html");
//   res.end("<html><body><h2>GraphQL endpoint available at /graphql</h2></body></html>");
// });

// app.all("/graphql", createHandler({ schema, rootValue }));

server.listen(port, () => {
  console.log(`API and Socket.io server listening on port ${port}`);
});
