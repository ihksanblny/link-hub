const userService = require('../services/link.service'); // Atau user.service jika dipisah
const { Storage } = require('@supabase/storage-js');

const getProfileDetails = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email; 
        
        // PERBAIKAN: Panggil fungsi dengan nama yang diekspor oleh service
        // Ganti getProfileDetailsByUserId dengan getProfileDetails
        const profileDetails = await userService.getProfileDetails(userId, userEmail); 
        
        res.status(200).json({ message: "Profile retrieved successfully", data: profileDetails });
    } catch (error) {
        next(error);
    }
};

// Controller untuk mengupdate Full Name dan Username
const updateDetails = async (req, res, next) => {
    try {
        const { username, full_name, avatar_url } = req.body;
        const userId = req.user.id; // Diambil dari middleware token

        const updatedProfile = await userService.updateProfileDetails(userId, { 
            username, 
            full_name,
            avatar_url 
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
        // Ambil data yang dikirim dari frontend
        // old_password diambil, tetapi diabaikan karena service menggunakan Supabase Auth SDK
        const { old_password, new_password } = req.body; 
        
        // Asumsi: Token sudah ditambahkan ke req.token oleh middleware protectRoute
        const userToken = req.token; 
        
        // CRITICAL CHECK: Pastikan newPassword ada di body
        if (!old_password || !new_password) {
            // Kita tetap memerlukan old_password untuk UX/keamanan, meskipun service mengabaikannya.
            return res.status(400).json({ message: "Password lama dan baru wajib diisi." });
        }
        
        // 🟢 PERBAIKAN: Panggil service HANYA DENGAN new_password dan token
        await userService.updatePassword(new_password, userToken); 
        
        // Jika sukses, Supabase akan menonaktifkan token lama.
        res.status(200).json({ message: "Password changed successfully. Please re-login." });
    }
    catch (error) {
        // Menangkap error validasi dari service (misal: password minimal)
        if (error.message.includes("minimal") || error.message.includes("salah") || error.message.includes("Gagal")) {
            return res.status(400).json({ message: error.message });
        }
        
        // 🚨 Penting: Meneruskan error ke global handler jika bukan 400
        console.error('GLOBAL ERROR during changePassword:', error);
        next(error); 
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

const deleteAccount = async (req, res, next) => {
    try {
        const accessToken = req.token; // Token dari auth.middleware

        // Panggil service untuk menghapus data dan user
        await userService.deleteUserAndData(accessToken); 
        
        // Kirim respon sukses
        res.status(200).json({ message: "Akun dan semua data berhasil dihapus secara permanen." });
    }
    catch (error) {
        console.error('GLOBAL ERROR during deleteAccount:', error);
        // Mengembalikan 500 jika gagal
        next(error); 
    }
};

module.exports = {
    updateDetails,
    changePassword,
    getProfileDetails,
    uploadAvatar,
    deleteAccount
};