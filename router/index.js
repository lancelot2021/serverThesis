const Router = require('express').Router;
const adminController = require('../controllers/admin-controller');
const router = new Router();


router.get('/registration', (req, res) => {
    res.render('registration');
})

router.get('/authorize', (req, res) => {
    res.render('authorize');
})

router.post('/registration', adminController.registration);
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/activate/:link', adminController.activate);
router.get('/refresh', adminController.refresh);
router.get('/admins', adminController.getAdmins);

module.exports = router