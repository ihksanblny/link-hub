const express = require('express');
const cors = require('cors');
//mengimpor route
const authRoutes = require('./routes/auth.routes');
const linkRoutes = require('./routes/link.routes');
const profileRoutes = require('./routes/profile.routes');
const errorHandler = require('./middleware/errorHandler');

//inisialisasi aplikasi express
const app = express();

//cors untuk mengizinkan request dari origin berbeda
app.use(cors());
//middleware untuk parsing JSON
app.use(express.json());

//menggunakan route
app.use('/auth', authRoutes);
app.use('/links', linkRoutes);
app.use('/profile', profileRoutes);

//middleware untuk menangani error
app.use(errorHandler);

app.get('/',(req, res)=>{
    res.json({message: "Welcome to LinkHub API"});
});

//Mengekspor app agar bisa digunakan di file server.js
module.exports = app;