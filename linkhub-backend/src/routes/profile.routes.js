const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { protectRoute } = require('../middleware/auth.middleware');

//Route Publik, tidak perlu autentikasi untuk mengakses
router.get('/:username', profileController.getPublicProfile);

// Rute privat untuk mengupdate profil sendiri
router.patch('/me', protectRoute, profileController.updateMyProfile);

module.exports = router;