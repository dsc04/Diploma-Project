import Product from "../model/productModel.js";
import ApiError from "../exceptions/apiErrors.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import { Readable } from "stream"; // Добавляем модуль для создания потока

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const addProduct = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(ApiError.UnauthorizedError("Пользователь не аутентифицирован"));
    }

    const { name, description, price, category } = req.body;
    if (!req.files || req.files.length === 0) {
      return next(ApiError.BadRequest("Хотя бы одно изображение обязательно"));
    }

    console.log("Files received:", req.files);

    // Загружаем изображения на Cloudinary
    const imagePaths = [];
    for (const file of req.files) {
      console.log("File buffer:", file.buffer);

      // Преобразуем Buffer в поток
      const stream = Readable.from(file.buffer);

      // Используем upload_stream для загрузки
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.pipe(uploadStream);
      });

      imagePaths.push(result.secure_url);
    }

    const userId = req.user.id;

    const product = await Product.create({
      name,
      description,
      price,
      images: imagePaths,
      user: userId,
      category,
    });

    res.json({ message: "Товар добавлен", product });
  } catch (e) {
    if (e instanceof multer.MulterError) {
      return next(ApiError.BadRequest(`Ошибка загрузки файлов: ${e.message}`));
    }
    next(e);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("user", "name Avatar");
    
    const categories = [
      "Electronics",
      "Clothing",
      "Books",
      "Furniture",
      "Other",
    ];

    const groupedProducts = {};
    categories.forEach((category) => {
      groupedProducts[category] = products.filter(
        (product) => product.category === category
      );
    });

    const filteredGroupedProducts = Object.fromEntries(
      Object.entries(groupedProducts).filter(([_, items]) => items.length > 0)
    );

    res.json(filteredGroupedProducts);
  } catch (e) {
    next(e);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { query, category, sortOrder, minPrice, maxPrice } = req.query;

    let searchConditions = {};

    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      searchConditions.category = category;
    }

    if (minPrice || maxPrice) {
      searchConditions.price = {};
      if (minPrice) searchConditions.price.$gte = Number(minPrice);
      if (maxPrice) searchConditions.price.$lte = Number(maxPrice);
    }

    let sort = {};
    if (sortOrder) {
      sort.price = sortOrder === "asc" ? 1 : -1;
    }

    const products = await Product.find(searchConditions)
      .populate("user", "name Avatar")
      .sort(sort);

    const categories = ["Electronics", "Clothing", "Books", "Furniture", "Other"];
    const groupedProducts = {};
    categories.forEach((cat) => {
      groupedProducts[cat] = products.filter((product) => product.category === cat);
    });

    const filteredGroupedProducts = Object.fromEntries(
      Object.entries(groupedProducts).filter(([_, items]) => items.length > 0)
    );

    res.json(filteredGroupedProducts);
  } catch (e) {
    next(e);
  }
};

export const getMaxPrice = async (req, res, next) => {
  try {
    const maxPriceProduct = await Product.findOne().sort({ price: -1 });
    if (!maxPriceProduct) {
      return res.json({ maxPrice: 0 });
    }
    res.json({ maxPrice: maxPriceProduct.price });
  } catch (e) {
    next(e);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user",
      "name Avatar email"
    );
    if (!product) {
      return next(ApiError.NotFound("Товар не найден"));
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
};

export const getUserProducts = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId || userId === "undefined") {
      return next(ApiError.BadRequest("Неверный идентификатор пользователя"));
    }

    const products = await Product.find({ user: userId }).populate(
      "user",
      "name Avatar"
    );
    res.json(products);
  } catch (e) {
    next(e);
  }
};