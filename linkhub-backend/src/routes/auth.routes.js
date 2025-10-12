const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protectRoute } = require('../middleware/auth.middleware');

//Route untuk registrasi user baru
router.post ('/register', authController.register);

//Route untuk login user
router.post('/login', authController.login);

//Route untuk mendapatkan profil user yang sedang login
router.get('/me', protectRoute, authController.getProfile);

module.exports = router;