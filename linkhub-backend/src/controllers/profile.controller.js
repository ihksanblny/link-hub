const { get } = require('../app');
const linkService = require('../services/link.service');

const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params; // Ambil username dari parameter URL

        console.log(`[Controller] Mencari username: "${username}"`); 
        const profileData = await linkService.getPublicProfileWithLinks(username);
        
        res.status(200).json({message : 'Public profile retrieved successfully', data: profileData});
    } catch (error) {
        // Jika profil tidak ditemukan , service akan melempar error
        if (error.message === 'Profile not found') {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getPublicProfile
};