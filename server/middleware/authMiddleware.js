import ApiError from "../exceptions/apiErrors.js";
import tokenService from "../service/tokenService.js";

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    console.log("Authorization Header:", authorizationHeader);
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    console.log("Access Token:", accessToken);
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validationAccessToken(accessToken);
    console.log("User Data:", userData);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    console.error("Auth Middleware Error:", e);
    return next(ApiError.UnauthorizedError());
  }
}