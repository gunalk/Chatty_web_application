import express from "express"
import authRoutes from "../src/routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"

const app =express()

app.use(express.json())
dotenv.config()
const PORT =process.env.PORT
app.use("/api/auth",authRoutes)
app.listen(PORT ||5000,()=>{
  console.log("server is listening on port " + PORT)
  connectDB()
})