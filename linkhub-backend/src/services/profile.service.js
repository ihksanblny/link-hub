const supabase = require('../services/supabase.service');

/**
 * Memperbarui username untuk pengguna yang sedang login.
 * @param {string} userId - ID pengguna dari token JWT.
 * @param {string} newUsername - Username baru yang diinginkan.
 */
const updateUsername = async (userId, newUsername) => {
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ username: newUsername }) // Data yang akan diubah
    .eq('id', userId) // HANYA untuk baris yang ID-nya cocok
    .select()
    .single();

  if (error) {
    // Error '23505' adalah kode Postgres untuk pelanggaran 'unique constraint'
    if (error.code === '23505') {
      throw new Error('Username already taken.');
    }
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  updateUsername,
};