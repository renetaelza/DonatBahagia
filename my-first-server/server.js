const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Memuat variabel lingkungan dari .env
dotenv.config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Rute untuk autentikasi
app.use('/auth', authRoutes);

// Rute untuk endpoint yang dilindungi
app.use('/protected', protectedRoutes);

const PORT = 3000;

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/cobain_user', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.log(err));
