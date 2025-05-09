import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import caseRoutes from "./routes/caseRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cases", caseRoutes);

export default app;