const AdminModel = require('../models/admin_model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const AdminDto = require('../dtos/admin-dto');
const ApiError = require('../exception/api-error');

class AdminService {
    async registration(login, email, password) {
        const candidateLogin = await AdminModel.findOne({login});
        const candidateEmail = await AdminModel.findOne({email});
        if (candidateLogin) {
            throw ApiError.BadRequest(`Системний адміністратор з таким логіном ${login} вже існує`);
        }
        if (candidateEmail) {
            throw ApiError.BadRequest(`Системний адміністратор з такою електронною поштою ${email} вже існує`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const admin = await AdminModel.create({login, email, password: hashPassword, activationLink});
        await mailService.sendActivationMail(email, `http://localhost:5000/api/activate/${activationLink}`);

        const adminDto = new AdminDto(admin); // id, email, isActivated
        const tokens = tokenService.generateTokens({...adminDto});
        console.log(tokens);
        await tokenService.saveToken(adminDto.id, tokens.refreshToken);

        return {
            ...tokens,
            admin: adminDto
        }
    }

    async activate(activationLink) {
        const admin = await AdminModel.findOne({activationLink});
        if (!admin) {
            throw ApiError.BadRequest('Uncorrected link of activation')
        }
        admin.isActivated = true;
        await admin.save();
    }

    async login(email, password) {
        const admin = await AdminModel.findOne({email});
        console.log(admin);
        if(!admin) {
            throw ApiError.BadRequest("Admin with this email wasn't found");
        }
        const isPassEquals = await bcrypt.compare(password, admin.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Uncorrected password');
        }
        const adminDto = new AdminDto(admin);
        const tokens = tokenService.generateTokens({...adminDto});
        console.log(tokens);
        await tokenService.saveToken(adminDto.id, tokens.refreshToken);

        return {
            ...tokens,
            admin: adminDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnathorizedError();
        }
        const adminData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!adminData || !tokenFromDb) {
            throw ApiError.UnathorizedError();
        }
        const admin = await AdminModel.findById(adminData.id);
        const adminDto = new AdminDto(admin);
        const tokens = tokenService.generateTokens({...adminDto});

        await tokenService.saveToken(adminDto.id, tokens.refreshToken);
        return {...tokens, admin: adminDto}
    }

    async getAllAdmins() {
        const admins = await AdminModel.find();
        return admins;
    }
}

module.exports = new AdminService();