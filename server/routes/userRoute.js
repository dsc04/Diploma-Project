import express from "express";
import { UserController } from "../controller/userController.js";
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadSingle, uploadArray } from "../middleware/upload.js"; // Импортируем оба метода

const userController = new UserController();
const route = express.Router();

route.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
route.post("/login", userController.login);
route.post("/logout", userController.logout);
route.get("/refresh", userController.refresh);
route.get("/users", authMiddleware, userController.getUsers);
route.get("/users/:id", userController.getUserById);
route.get("/checkAuth", authMiddleware, userController.checkAuth);
route.put("/upload-avatar", authMiddleware, uploadSingle, userController.uploadAvatar); // Используем uploadSingle


export default route;