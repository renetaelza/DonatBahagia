const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


 //NGEBUAT TOKEN SAAT LOGIN
 router.post('/login', async (req, res) => {
      try {
          const { email, password } = req.body;
        // Cek apakah pengguna ada
          const user = await User.findOne({ email });
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
        // Verifikasi password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return res.status(400).json({ message: 'Invalid credentials' });
          }
          const token = jwt.sign(
              { id: user._id, email: user.email },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_IN }
          );
        res.status(200).json({ message: 'Login successful', token });
      } catch (err) {
          res.status(500).json({ error: err.message }); } });

// User Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, city, address } = req.body;

        // Cek apakah pengguna sudah ada
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Buat user baru
        const newUser = new User({
            name,
            email,
            password,
            phone,
            city,
            address
        });

        // Simpan user ke database
        await newUser.save();

        // Buat token JWT
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Kirimkan respon dengan token
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
