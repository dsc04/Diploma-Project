import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoute.js"; // Add this import
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api", userRoutes);
app.use("/api", productRoutes); // Add product routes

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

const start = async () => {
  try {
    await mongoose.connect(MONGOURL);
    console.log("Подключено к MongoDB");

    app.listen(PORT, () => {
      console.log(`Сервер работает на порту: ${PORT}`);
    });
  } catch (e) {
    console.error("Ошибка при запуске:", e);
  }
};

start();