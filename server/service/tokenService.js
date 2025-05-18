import jwt from 'jsonwebtoken';
import tokenModel from '../model/tokenModel.js';

class TokenService {
    generateTokens(payload) {  // Изменил на множественное число
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        };
    }

validationAccessToken(token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return userData;
    } catch (e) {
        return null;
    }
}
        validationRefreshToken(token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
    } catch (e) {
        return null;
    }
}

    async saveToken(userId, refreshToken) {  // Изменил на saveToken
        const tokenData = await tokenModel.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userId, refreshToken});
        return token;
    }
    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }
    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData
    }
}

export default new TokenService();