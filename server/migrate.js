import mongoose from "mongoose";
import Product from "./model/productModel.js";
import dotenv from "dotenv";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Подключено к MongoDB");

    const products = await Product.find();
    for (const product of products) {
      if (product.image) {
        product.images = [product.image];
        delete product.image;
        await product.save();
      }
    }
    console.log("Миграция завершена");
  } catch (e) {
    console.error("Ошибка миграции:", e);
  } finally {
    await mongoose.disconnect();
  }
};

migrate();