const userService = require('../services/link.service'); // Atau user.service jika dipisah
const { Storage } = require('@supabase/storage-js');

const getProfileDetails = async (req, res, next) => {
    try {
        // Asumsi: Anda memiliki fungsi di service untuk mendapatkan data profil user
        const userId = req.user.id;
        const profileDetails = await userService.getProfileDetails(userId);
        res.status(200).json({ message: "Profile retrieved successfully", data: profileDetails });
    } catch (error) {
        next(error);
    }
};

// Controller untuk mengupdate Full Name dan Username
const updateDetails = async (req, res, next) => {
    try {
        const { username, full_name } = req.body;
        const userId = req.user.id; // Diambil dari middleware token

        const updatedProfile = await userService.updateProfileDetails(userId, { 
            username, 
            full_name 
        });
        
        res.status(200).json({ 
            message: "Profile updated successfully", 
            data: updatedProfile 
        });
    } catch (error) {
        // Menangkap error dari service (misal: username sudah terpakai)
        if (error.message.includes("Username sudah digunakan")) {
            return res.status(409).json({ message: error.message }); // 409 Conflict
        }
        next(error);
    }
};

// Controller untuk mengubah password
const changePassword = async (req, res, next) => {
    try {
        // PENTING: Supabase updatePassword hanya membutuhkan new_password.
        // Verifikasi password lama biasanya dilakukan di sisi client atau ditangani oleh Supabase.
        const { new_password } = req.body; 
        const accessToken = req.token; // Asumsi: Middleware menyimpan token di req.token

        // Memanggil service update password
        await userService.updatePassword(new_password, accessToken);

        res.status(200).json({ 
            message: "Password changed successfully. Please re-login." 
        });
    } catch (error) {
        // Error Supabase (misal: password too weak)
        return res.status(400).json({ message: error.message });
    }
};

// src/controllers/user.controller.js

const uploadAvatar = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // --- PERBAIKAN: Check req.file secara eksplisit (Ini yang memicu 400) ---
        if (!req.file) {
            // Log ke console backend untuk debugging
            console.error("ERROR 400: Multer failed to find file named 'avatar'. Check frontend FormData field name."); 
            // Kirim 400 Bad Request
            return res.status(400).json({ message: "File upload required (field name 'avatar' is missing or file is too large)." });
        }
        
        // Lanjutkan hanya jika req.file ada
        const newAvatarUrl = await userService.uploadAndSetAvatar(userId, req.file, req.token); // Asumsi req.token ada

        return res.status(200).json({ 
            message: "Avatar updated successfully", 
            data: { avatar_url: newAvatarUrl } 
        });

    } catch (error) {
        // ... (Error handling)
        next(error);
    }
};

module.exports = {
    updateDetails,
    changePassword,
    getProfileDetails,
    uploadAvatar,
};