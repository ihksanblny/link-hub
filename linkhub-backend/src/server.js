//Mengimpor konfigurasi dari file app.js
const app = require('./app');

//mengimpor dan mengkonfigurasi dotenv untuk mengelola variabel lingkungan
require('dotenv').config();

//Menentukan port dari variabel lingkungan atau default ke 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});