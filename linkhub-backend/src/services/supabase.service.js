//Meingmpor Library
require('dotenv').config();
const { createClient } = require ('@supabase/supabase-js');

//Mengambil variabel lingkungan dari file .env
const SupabaseUrl = process.env.SUPABASE_URL;
const SupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

//Membuat instance supabase
const supabase = createClient(SupabaseUrl, SupabaseKey);

//mengekspor client agar bisa digunakan di file lain
module.exports = supabase;