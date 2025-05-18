import UserModel from "../model/userModel.js";
import tokenService from "../service/tokenService.js";
import { UserDto } from "../dtos/userDto.js";  // Именованный импорт
import bcrypt from 'bcrypt';
import ApiError from "../exceptions/apiErrors.js";
import tokenModel from "../model/tokenModel.js";

class UserService {
    async registration({name, email, password, description}) { 
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
        throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }
    
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await UserModel.create({ 
        name, 
        password: hashPassword, 
        email, 
        description 
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({
        email: userDto.email,
        id: userDto.id
    });
    
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {
        ...tokens,
        user: userDto
    };
}

async login(email,password){
    const user = await UserModel.findOne({email})
    if(!user){
        throw ApiError.BadRequest(`Пользователь с таким email не найден`)
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if(!isPassEquals){
        throw ApiError.BadRequest('Неверный Пароль')
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {
        ...tokens,
        user: userDto
    };
}
async logout(refreshToken){
    const token = await tokenService.removeToken(refreshToken);
    return token;
}

async refresh(refreshToken){
    if(!refreshToken){
        throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validationRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if(!userData || !tokenFromDb){
        throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {
        ...tokens,
        user: userDto
    };
}

 async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

export default new UserService();
