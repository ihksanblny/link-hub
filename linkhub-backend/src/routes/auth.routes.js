const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

//Route untuk registrasi user baru
router.post ('/register', authController.register);

module.exports = router;