import User from "../model/userModel.js";
import userService from "../service/userService.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/apiErrors.js";
import { UserDto } from "../dtos/userDto.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream"; // Добавляем импорт Readable

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка Валидации", errors.array()));
      }
      const { name, email, password, description } = req.body;

      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const userData = await userService.registration({ name, email, password, description });
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

async refresh(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    console.log("Refresh token from cookies:", refreshToken); // Логируем токен
    if (!refreshToken) {
      throw ApiError.UnauthorizedError("Токен отсутствует");
    }
    const userData = await userService.refresh(refreshToken);
    console.log("Refresh user data:", userData); // Логируем данные
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    console.error("Refresh error:", e.message); // Логируем ошибку
    next(e);
  }
}

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async checkAuth(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const userDto = new UserDto(user);
      res.json({ user: userDto });
    } catch (e) {
      next(e);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return next(ApiError.UnauthorizedError("Пользователь не аутентифицирован"));
      }

      if (!req.file) {
        return next(ApiError.BadRequest("Файл аватара не предоставлен"));
      }

      console.log("Avatar file:", req.file);
      console.log("Avatar buffer:", req.file.buffer);

      // Преобразуем Buffer в поток
      const stream = Readable.from(req.file.buffer);

      // Используем upload_stream для загрузки
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
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

      // Обновляем аватар пользователя
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { Avatar: result.secure_url },
        { new: true }
      );

      if (!user) {
        return next(ApiError.NotFound("Пользователь не найден"));
      }

      res.json({ message: "Аватар успешно загружен", user });
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id).select("name email Avatar description");
      if (!user) {
        return next(ApiError.NotFound("Пользователь не найден"));
      }
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();