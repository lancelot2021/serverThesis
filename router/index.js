const Router = require('express').Router;
const adminController = require('../controllers/admin-controller');
const router = new Router();

router.post('/registration', adminController.registration);
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/activate/:link', adminController.activate);
router.get('/refresh', adminController.refresh);
router.get('/admins', adminController.getAdmins);

module.exports = router