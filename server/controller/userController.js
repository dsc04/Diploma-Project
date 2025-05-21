
import User from "../model/userModel.js";
import userService from "../service/userService.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/apiErrors.js";
import { UserDto } from "../dtos/userDto.js";

export class UserController {
    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка Валидации', errors.array()))
            }
            const {name,email,password,description}=req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

            const userData = await userService.registration({name, email, password, description});
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 *60 * 1000, httpOnly:true})
            return res.json(userData)
        }catch(e){
            console.log(e);
            next(e);
        }
    }
    async login(req, res, next){
        try{
            const {email, password} = req.body;
            const userData = await userService.login(email,password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 *60 * 1000, httpOnly:true})
            return res.json(userData)
        }catch(e){
            next(e);
        }
    }
    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }catch(e){
            next(e);
        }
    }
    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 *60 * 1000, httpOnly:true})
            return res.json(userData)
        }catch(e){
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
    const userId = req.user.id; // From middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const userDto = new UserDto(user); // Use UserDto
    res.json({ user: userDto });
  } catch (e) {
    next(e);
  }
}

async uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }
    
    const userId = req.user.id;
    const avatarPath = `/uploads/${req.file.filename}`; // Include /uploads/ in the path

    const user = await User.findByIdAndUpdate(
      userId,
      { Avatar: avatarPath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const userDto = new UserDto(user); // Use UserDto to format the user data
    res.json({ user: userDto }); // Return the full user object
  } catch (e) {
    next(e);
  }
}

    
    }

export default new UserController();

