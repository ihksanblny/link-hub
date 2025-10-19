const supabase = require('../services/supabase.service');
const { nanoid } = require('nanoid');

/**
 * Membuat link baru di database
 * @param {object} linkData - Data link yang akan dibuat
 */

const createlink = async (linkData) => {
  const shortCode = nanoid(8); // Buat kode acak 8 karakter
  const { data, error } = await supabase
    .from('links')
    .insert({
      title: linkData.title,
      url: linkData.url,
      user_id: linkData.userId,
      short_code: shortCode, // Simpan kode unik
      clicks: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Mengambil semua link milik user tertentu
 * @param {string} userId - ID user yang sedang login
 */

const getLinksByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('links')
        .select('*, clicks, short_code') // Ambil semua kolom termasuk clicks dan short_code
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
        .update(newData) 
        .eq('id', linkId) 
        .eq('user_id', userId) 
        .select(); // HAPUS .single()
    
    if (error) {
        throw new Error(error.message);
    }
    
    // Pemeriksaan KRUSIAL: Pastikan satu baris dikembalikan
    if (!data || data.length === 0) {
        // Ini berarti link tidak ditemukan atau user_id tidak cocok (Unauthorized/Not Found)
        // Kita lempar error untuk ditangkap di controller (biasanya mengembalikan 404/403)
        throw new Error('Link not found or unauthorized to update.');
    }

    // Karena kita tidak menggunakan .single(), data adalah array. Kita kembalikan elemen pertama.
    return data[0]; 
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
        // Hapus .select() dan .single() untuk hasil yang paling aman
        // Jika Anda perlu tahu data apa yang dihapus, hapus HANYA .single()
        .select(); // Kembalikan array (mungkin kosong atau berisi 1 item)
        // .single(); <--- DIHAPUS

    if (error) {
        throw new Error(error.message);
    }
    
    // Periksa apakah ada data yang benar-benar dihapus (opsional)
    if (!data || data.length === 0) {
        // Ini berarti link tidak ditemukan atau user_id tidak cocok
        throw new Error('Link not found or unauthorized.');
    }
    
    // Kembalikan data[0] atau hanya true/status sukses
    return data[0]; 
};

/**
 * @param {string} username - Username dari profil publik
 */

const getPublicProfileWithLinks = async (username) => {
    
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, username') // Ambil kolom yang diperlukan
        .eq('username', username)
        .single();
    
        if (profileError || !profile) {
        throw new Error('Profile not found');
    }
    
    //Setelah mendapatkan user Id dari profil, cari semua link milik user tersebut
    const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, title, url, clicks, short_code') //Ambil hanya data link yang relavan
        .eq('user_id', profile.id)
    
        if (linksError) {
        throw new Error (linksError.message);
    }
    return { ...profile, links };
};

const trackClickAndGetUrl = async (shortCode) => {
  console.log(`[Service] Mencari di DB untuk shortCode: "${shortCode}"`);

  // 1. Cari link berdasarkan kode uniknya
  const { data: linkData, error } = await supabase
    .from('links')
    .select('id, url')
    .eq('short_code', shortCode)
    .single();

  if (error || !linkData) {
    // Jika tidak ditemukan, lempar error yang akan ditangkap di controller
    throw new Error('Link not found'); 
  }

  // 2. ISOLASI LOGIKA TRACKING CLICK DENGAN TRY/CATCH
  try {
    // Panggilan RPC Anda yang mungkin gagal karena nama fungsi/parameter
    const { error: rpcError } = await supabase.rpc('increment_clicks', { link_id: linkData.id });
    
    if (rpcError) {
      // PENTING: Log error tapi JANGAN melempar error utama
      console.error("[Service] WARNING: Gagal mengincrement click (RPC Error):", rpcError.message);
    }

  } catch (rpcError) {
      console.error("[Service] WARNING: Error saat memanggil RPC:", rpcError.message);
  }
  
  // 3. Ambil URL dan tambahkan protocol jika hilang
  let url = linkData.url;
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
  }

  return url; 
};

module.exports = {
    createlink,
    getLinksByUserId,
    updateLinkById,
    deleteLinkById,
    getPublicProfileWithLinks,
    trackClickAndGetUrl,
}