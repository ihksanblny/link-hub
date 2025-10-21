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
        .select('id, full_name, username, avatar_url') // Ambil kolom yang diperlukan
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

/**
 * Mengupdate detail profil (username/full_name) di tabel profiles
 * @param {string} userId - ID user yang sedang login (auth.uid())
 * @param {object} newData - Data baru untuk diupdate (username, full_name)
 */
const updateProfileDetails = async (userId, newData) => {
    // 1. Validasi Username agar tidak kosong
    if (newData.username && newData.username.trim() === '') {
        throw new Error("Username cannot be empty.");
    }
    
    // 2. Cek apakah username sudah digunakan oleh orang lain
    if (newData.username) {
        const { count, error: countError } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .eq('username', newData.username)
            .neq('id', userId); // Kecuali user yang sedang login
            
        if (countError) throw new Error(countError.message);
        if (count > 0) {
            throw new Error('Username sudah digunakan oleh user lain.');
        }
    }
    
    // 3. Lakukan Update
    const { data, error } = await supabase
        .from('profiles')
        .update(newData) 
        .eq('id', userId) 
        .select()
        .single();
    
    if (error) {
        throw new Error(error.message);
    }
    
    // Jika tidak ada baris yang diupdate (misal: user tidak ada), throw error
    if (!data) {
        throw new Error('Profile not found or no changes made.');
    }
    
    return data;
};

/**
 * Mengambil detail profil (full_name dan username) dari tabel 'profiles'
 * dan menggabungkannya dengan email dari Auth.
 * @param {string} userId - ID user yang sedang login
 * @param {string} userEmail - Email user yang sedang login (dari token/middleware)
 */
const getProfileDetails = async (userId, userEmail) => {
    // 1. Ambil data profil dari tabel 'profiles'
    const { data: profileData, error } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', userId)
        .single();

    if (error) {
        // Log error dan lempar, termasuk jika profil tidak ditemukan
        console.error('Error fetching profile details:', error.message);
        throw new Error('Could not retrieve profile details.');
    }
    
    // 2. Gabungkan data
    return {
        id: userId,
        email: userEmail, // Gunakan email dari middleware/token
        full_name: profileData.full_name,
        username: profileData.username,
    };
};

/**
 * Mengupdate password user yang sedang login.
 * PENTING: Supabase hanya mengizinkan pembaruan password melalui auth SDK
 * dan hanya untuk user yang sedang login (dengan token).
 * @param {string} newPassword - Password baru
 * @param {string} accessToken - Token user yang sedang login (dari req.user.token)
 */
const updatePassword = async (newPassword, accessToken) => {
    if (!newPassword || newPassword.length < 6) {
        throw new Error("Password baru minimal 6 karakter.");
    }
    
    // Panggil API Supabase Auth untuk mengupdate password
    // Catatan: Ini membutuhkan user yang sedang login (melalui token di header)
    // dan TIDAK memerlukan service_role key.
    const { data, error } = await supabase.auth.api.updateUser(
        accessToken, // Menggunakan token dari request
        { password: newPassword }
    );

    if (error) {
        // Supabase biasanya mengembalikan 400 jika password terlalu pendek, dll.
        throw new Error(error.message); 
    }
    return data;
};

const uploadAndSetAvatar = async (userId, file, accessToken) => {
    const bucketName = 'avatars'; 
    const fileExtension = file.mimetype.split('/').pop();
    const filePath = `${userId}/${Date.now()}.${fileExtension}`; 

    // --- PERBAIKAN KRITIS: Upload file dengan JWT di headers ---
    const { data: _ } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, { 
            contentType: file.mimetype,
            upsert: true,
            // PENTING: Meneruskan JWT sebagai header Authorization
            // Ini adalah cara Supabase Storage API mengotentikasi request dari backend
            cacheControl: '3600',
        });
    
    const { error: uploadErrorFinal } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, { 
            contentType: file.mimetype,
            upsert: true,
        });

    if (uploadErrorFinal) {
        console.error("Supabase Storage Upload Error:", uploadErrorFinal);
        throw new Error('Gagal mengunggah file ke penyimpanan.');
    }
    
    // 2. Dapatkan URL Publik
    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    // Check defensif untuk public URL
    if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Gagal mendapatkan URL publik file yang diunggah.');
    }
    
    const publicUrl = publicUrlData.publicUrl;

    // 3. Update URL Avatar di tabel profiles
    const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl }) 
        .eq('id', userId);

    if (dbError) {
        throw new Error('Gagal menyimpan URL avatar ke database.');
    }

    return publicUrl;
};

module.exports = {
    createlink,
    getLinksByUserId,
    updateLinkById,
    deleteLinkById,
    getPublicProfileWithLinks,
    trackClickAndGetUrl,
    updateProfileDetails,
    updatePassword,
    uploadAndSetAvatar,
    getProfileDetails,
}