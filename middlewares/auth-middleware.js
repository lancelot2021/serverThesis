const ApiError = require('../exception/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try{
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            console.log(1);
            return next(ApiError.UnathorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken) {
            console.log(2);
            return next(ApiError.UnathorizedError());
        }

        const adminData = tokenService.validateAccessToken(accessToken);
        if(!adminData) {
            console.log(3);
            return next(ApiError.UnathorizedError());
        }

        req.admin = adminData;
        console.log(4);
        next();
    }catch (e) {
        console.log(5);
        return next(ApiError.UnathorizedError());
    }
}