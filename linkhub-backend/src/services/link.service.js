const { link } = require('../app');
const supabase = require('../services/supabase.service');

/**
 * Membuat link baru di database
 * @param {object} linkData - Data link yang akan dibuat
 */

const createlink = async (linkData) => {
    const { data, error } = await supabase
        .from('links')
        .insert({
            title: linkData.title,
            url: linkData.url,
            user_id: linkData.userId,
        })
        .select() // .select() digunakan untuk mengembalikan data yang baru dibuat
        .single() // .single() agar hasilnya berupa objek, bukan array

    if (error) {
        throw new Error(error.message);
    }
    
    return data;
};

/**
 * Mengambil semua link milik user tertentu
 * @param {string} userId - ID user yang sedang login
 */

const getLinksByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('links')
        .select('*') // Mengambil semua kolom
        .eq('user_id', userId); // Filter berdasarkan user_id

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

/**
 * Mengupdate link berdasarkan ID dan user yang sedang login
 * @param {string} linkId - ID link yang akan diupdate
 * @param {string} userId - ID user yang sedang login
 * @param {object} newData - Data baru untuk link (title, url)
 */

const updateLinkById = async (linkId, userId, newData) => {
    const { data, error } = await supabase
        .from('links')
        .update(newData) // Data baru untuk diupdate
        .eq('id', linkId) // Targetkan berdasarkan ID link
        .eq('user_id', userId) // Pastikan hanya bisa mengupdate link milik user tersebut
        .select() // Mengembalikan data yang sudah diupdate
        .single(); // Hasilnya berupa objek, bukan array
    
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

/**
 * Menghapus link berdasarkan ID nya
 * @param {string} linkId - ID link yang akan dihapus
 * @param {string} userId - ID user yang sedang login
 */

const deleteLinkById = async (linkId, userId) => {
    const { data, error } = await supabase
        .from('links')
        .delete() // Menghapus data
        .eq('id', linkId) // Targetkan berdasarkan ID link
        .eq('user_id', userId) // Pastikan hanya bisa menghapus link milik user tersebut
        .select()
        .single();
    
    if (error) {
        throw new Error(error.message);
    }
    return data;
};

module.exports = {
    createlink,
    getLinksByUserId,
    updateLinkById,
    deleteLinkById,
}