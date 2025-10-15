const linkService = require('../services/link.service');
const profileService = require('../services/profile.service.js');

const getPublicProfile = async (req, res, next) => {
    try {
        const { username } = req.params; // Ambil username dari parameter URL

        // console.log(`[Controller] Mencari username: "${username}"`); 
        const profileData = await linkService.getPublicProfileWithLinks(username);
        
        res.status(200).json({message : 'Public profile retrieved successfully', data: profileData});
    } catch (error) {
        // Jika profil tidak ditemukan , service akan melempar error
        if (error.message === 'Profile not found') {
            return next(error); // Lanjut ke middleware 404
        }
        next(error); // Lanjut ke middleware error global
    }
};

const updateMyProfile = async (req, res, next) => {
  // console.log('Menjalankan tes bypass. Jika ini berhasil, masalah ada di pemanggilan service.');

  // res.status(200).json({ message: 'Tes bypass berhasil!' });
  try {

    const { username } = req.body;
    const userId = req.user.id; // Diambil dari middleware, jadi ini aman

    if (!username) {
      return res.status(400).json({ message: 'Username is required.' });
    }

    const updatedProfile = await profileService.updateUsername(userId, username);
    res.status(200).json({ message: 'Username updated successfully', data: updatedProfile });
  } catch (error) {
    // Kirim pesan error yang lebih spesifik jika username sudah ada
    if (error.message === 'Username already taken.') {
      next(error); // 409 Conflict
    }
    next(error); // Lanjut ke middleware error global
  }
};

module.exports = {
    getPublicProfile,
    updateMyProfile
};