import Product from "../model/productModel.js";
import ApiError from "../exceptions/apiErrors.js";

export const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    if (!req.file) {
      return next(ApiError.BadRequest("Изображение обязательно"));
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const userId = req.user.id; // From authMiddleware

    const product = await Product.create({
      name,
      description,
      price,
      image: imagePath,
      user: userId,
      category
    });

    res.json({ message: "Товар добавлен", product });
  } catch (e) {
    next(e);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('user', 'name email');
    res.json(products);
  } catch (e) {
    next(e);
  }
};