const authService = require('../services/auth.service');

const register = async (req, res) => {
    //Mengambil email dan password dari body request
    const {email, password} = req.body;

    //validasi sederhana
    if (!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }

    try {
        //Memanggil service untuk mendaftarkan user baru
        const data = await authService.registerUser(email, password);
        //mengirim respon sukses
        res.status(201).json({message: "User registered successfully", data: data});
    }
    catch (error) {
        //menangani error dan mengirim respon gagal
        res.status(400).json({message: error.message});
    }

};

module.exports = {
    register,
}