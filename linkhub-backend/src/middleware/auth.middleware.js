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
        const {data: {user}, error} = await supabase.auth.getUser(token);

        // Jika token tidak valid, kirim respon 401 Unauthorized
        if (error) {
            throw new Error(error.message);
        }

        // Jika token valid, simpan informasi user ke req.user dan lanjut ke middleware berikutnya
        req.user = user;

        // Lanjut ke middleware berikutnya
        next();
    }
    catch (error) {
        res.status(401).json({message : 'Not authorized, token failed' });
    }
};

module.exports = { protectRoute };