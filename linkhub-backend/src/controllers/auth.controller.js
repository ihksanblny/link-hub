const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    //Mengambil email dan password dari body request
    const {email, password, username} = req.body;

    //validasi sederhana
    if (!email || !password || !username) {
        return res.status(400).json({message: "Email, password, and username are required"});
    }

    try {
        //Memanggil service untuk mendaftarkan user baru
        // Asumsi: Service mengembalikan { user, session }
        const result = await authService.registerUser(email, password, username); 

        return res.status(201).json({
            message: "User registered successfully.",
            data: { 
                // Kirim properti session dan user yang diambil dari hasil service
                session: result.session, 
                user: result.user 
            }
        });
    }
    catch (error) {
        //menangani error dan mengirim respon gagal
        next(error);
    }

};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    //validasi input
    if (!email || !password){
        return next(new Error("Email and password are required"));
    }

    try {
        const data = await authService.signInUser(email, password);
        res.status(200).json({message: "User signed in successfully", data: data});
    }
    catch (error){
        next(error);
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        message: "User profile retrieved successfully",
        data: req.user,
    });
};

module.exports = {
    register,
    login,
    getProfile,
}