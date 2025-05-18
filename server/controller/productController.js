// controller/productController.js
import Product from "../model/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({ name, price, description, image: imagePath });
    const saved = await newProduct.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const data = await Product.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};
