const supabase = require ('../services/supabase.service');

const protectRoute = async (req, res, next) => {
    // Ambil token dari header Authorization
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Jika token tidak ada, kirim respon 401 Unauthorized
    if (!token) {
        return res.status(401).json({message : 'Not authorized, no token provided' });
    }

    try {
        // Verifikasi token ke Supabase
        // Catatan: Anda menggunakan klien Service Role di sini.
        const {data: {user}, error} = await supabase.auth.getUser(token); 

        // Jika token tidak valid, kirim respon 401 Unauthorized
        if (error) {
            // Supabase client error message di sini sering kali sudah mencakup pesan "Invalid JWT"
            throw new Error(error.message); 
        }

        // Jika token valid, simpan informasi user ke req.user dan LAKUKAN INI:
        req.user = user;
        // 🟢 PERBAIKAN KRITIS: Simpan token mentah (string) agar bisa diakses di controller
        req.token = token; 

        // Lanjut ke middleware berikutnya
        next();
    }
    catch (error) {
        // Jika token kadaluarsa atau error lainnya dari Supabase
        res.status(401).json({message : 'Not authorized, token failed' });
    }
};

module.exports = { protectRoute };