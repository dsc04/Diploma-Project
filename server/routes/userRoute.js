import express from "express"
import {UserController} from "../controller/userController.js"
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const userController = new UserController();
const route = express.Router();

route.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3,max:32}),
    userController.registration);
route.post('/login',userController.login);
route.post('/logout',userController.logout);
route.get('/refresh',userController.refresh);
route.get('/users', authMiddleware, userController.getUsers);
route.get('/checkAuth', authMiddleware, userController.checkAuth);
route.put('/upload-avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);


export default route