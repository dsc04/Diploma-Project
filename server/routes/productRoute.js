// routes/productRoute.js
import express from "express";
import { addProduct, getAllProducts } from "../controller/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/product", upload.single("image"), addProduct);
router.get("/products", getAllProducts);

export default router;
