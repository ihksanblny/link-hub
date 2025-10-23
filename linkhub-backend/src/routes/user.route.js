const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protectRoute } = require('../middleware/auth.middleware');
const multer = require('multer');

// Semua route di sini memerlukan autentikasi (Token)

//Konfigurasi multer untuk upload file
const upload = multer({ storage: multer.memoryStorage() });

// 1. GET DETAIL USER YANG SEDANG LOGIN (/user/me)
// Ini adalah endpoint yang digunakan ProfileDetailsForm untuk memuat data awal
router.get('/me', protectRoute, userController.getProfileDetails); 

// 2. PATCH UPDATE DETAIL PROFIL (/user/details)
router.patch('/details', protectRoute, userController.updateDetails);

// 3. PATCH UBAH PASSWORD (/user/password)
router.patch('/password', protectRoute, userController.changePassword); 

router.post('/avatar', protectRoute, upload.single('avatar'), userController.uploadAvatar);

//4. Hapus Akun
router.delete('/', protectRoute, userController.deleteAccount);

module.exports = router;