const Router = require('express').Router;
const adminController = require('../controllers/admin-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');


router.get('/registration', (req, res) => {
    res.render('registration');
})

router.get('/authorize', (req, res) => {
    res.render('authorize');
})

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    adminController.registration);

router.post('/authorize', adminController.login);
router.post('/logout', adminController.logout);
router.get('/activate/:link', adminController.activate);
router.get('/refresh', adminController.refresh);
router.get('/admins', authMiddleware, adminController.getAdmins);

module.exports = router