import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadArray } from "../middleware/upload.js";
import { addProduct, getProducts, getProductById, getUserProducts, searchProducts, getMaxPrice } from "../controller/productController.js";

const route = express.Router();

route.post("/product", authMiddleware, uploadArray, addProduct);
route.get("/products", getProducts);
route.get("/product/:id", getProductById);
route.get("/user-products/:userId", getUserProducts);
route.get("/search", searchProducts);
route.get("/max-price", getMaxPrice); // Убрали /api

export default route;