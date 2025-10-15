const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

//Route Publik, tidak perlu autentikasi untuk mengakses
router.get('/:username', profileController.getPublicProfile);

module.exports = router;