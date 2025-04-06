import express from "express";
import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";


app.use(
  cors({
    origin: ["http://localhost:5173","https://chatty-web-application-10.onrender.com/"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
dotenv.config();
const PORT = process.env.PORT;
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


server.listen(PORT || 5000, () => {
  console.log("server is listening on port " + PORT);
  connectDB();
});
