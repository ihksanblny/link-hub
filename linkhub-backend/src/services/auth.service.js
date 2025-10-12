const supabase = require('./supabase.service');

//Fungsi untuk mendaftarkan user baru
const registerUser = async (email, password) => {
    //Menggunakan metode signUp dari supabase untuk mendaftarkan user baru
    const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
    });

    //jika ada error, lempar error tersebut
    if (error) {
        throw new Error(error.message);
    }
    //mengembalikan data user yang baru didaftarkan
    return data;
};

const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

module.exports = {
    registerUser,
    signInUser,
};

