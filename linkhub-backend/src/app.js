const express = require('express');
const cors = require('cors');
//mengimpor route auth
const authRoutes = require('./routes/auth.routes');
//inisialisasi aplikasi express
const app = express();

//cors untuk mengizinkan request dari origin berbeda
app.use(cors());
//middleware untuk parsing JSON
app.use(express.json());

// Memberitahu Express untuk menggunakan authRoutes untuk setiap request
// yang dimulai dengan /auth
app.use('/auth', authRoutes);

app.get('/',(req, res)=>{
    res.json({message: "Welcome to LinkHub API"});
});

//Mengekspor app agar bisa digunakan di file server.js
module.exports = app;