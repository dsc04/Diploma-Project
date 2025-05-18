import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", route);

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
