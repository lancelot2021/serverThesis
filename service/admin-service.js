const AdminModel = require('../models/admin_model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const AdminDto = require('../dtos/admin-dto');

class AdminService {
    async registration(login, email, password){
        const candidateLogin = await AdminModel.findOne({login});
        const candidateEmail = await AdminModel.findOne({email});
        if(candidateLogin){
            throw new Error(`Системний адміністратор з таким логіном ${login} вже існує`);
        }
        if(candidateEmail) {
            throw new Error(`Системний адміністратор з такою електронною поштою ${email} вже існує`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const admin = await AdminModel.create({login, email, password: hashPassword, activationLink});
        await mailService.sendActivationMail(email, activationLink);

        const adminDto = new AdminDto(admin); // id, email, isActivated
        const tokens = tokenService.generateTokens({...adminDto});
        await tokenService.saveToken(adminDto.id, tokens.refreshToken);

        return {
            ...tokens,
            admin: adminDto
        }
    }
}

module.exports = new AdminService();