const linksService = require('../services/link.service');

const handleRedirect = async (req, res, next) => {
    try {
        const { shortCode } = req.params;

        console.log(`[Controller] Menerima redirect request untuk shortCode: "${shortCode}"`);
        const originalUrl = await linksService.trackClickAndGetUrl(shortCode);
        
        console.log(`[Controller] URL Asli Ditemukan: ${originalUrl}`); // <--- LOG PENTING

        // PENTING: Periksa apakah URL benar-benar ada dan merupakan string.
        if (!originalUrl || typeof originalUrl !== 'string') {
            console.error(`[Controller] Redirect GAGAL: originalUrl tidak valid atau kosong untuk shortCode: ${shortCode}`);
            // Melempar error yang sama agar ditangkap di blok catch
            throw new Error('Link not found'); 
        }

        // Redirect ke URL asli (302 untuk pengalihan sementara)
        console.log(`[Controller] Redirecting to: ${originalUrl}`);
        res.redirect(302, originalUrl);
        
    } catch (error) {
        // Blok ini menangkap error yang dilempar dari service
        console.error(`[Controller] GAGAL REDIRECT: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    handleRedirect
};