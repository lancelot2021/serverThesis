const adminService = require('../service/admin-service');

class AdminController{
    async registration(req, res, next) {
        try {
            // const {login, email, password} = req.body;
            const login = req.body.login;
            const email = req.body.email;
            const password = req.body.password;
            const adminData = await adminService.registration(login, email, password);
            res.cookie('refreshToken', adminData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
            return res.json(adminData);
        }catch (e){

        }
    }

    async login(req, res, next) {
        try {

        }catch (e){

        }
    }

    async logout(req, res, next) {
        try {

        }catch (e){

        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await adminService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }catch (e){
            console.log(e);
        }
    }

    async refresh(req, res, next) {
        try {

        }catch (e){

        }
    }

    async getAdmins(req, res, next) {
        try {
            res.json(['123', '456'])
        }catch (e){

        }
    }
}

module.exports = new AdminController();