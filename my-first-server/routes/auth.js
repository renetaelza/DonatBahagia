const express = require('express');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 const User = require('../models/User');
 
 const router = express.Router();

 // Registrasi pengguna
 router.post('/register', async (req, res) => {
      try {
        const { username, password } = req.body;
 // Cek apakah username sudah digunakan
          const existingUser = await User.findOne({ username });
          if (existingUser) {
              return res.status(400).json({ message: 'Username already exists' });
          }
          // Buat pengguna baru
          const newUser = new User({ username, password });
          await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
 });
 module.exports = router;


 //Login pengguna
 
//  router.post('/login', async (req, res) => {
//       try {
//           const { username, password } = req.body;
//           // Cek apakah pengguna ada
//           const user = await User.findOne({ username });
//         if (!user) {
//               return res.status(404).json({ message: 'User not found' });
//           }
//           // Verifikasi password
//           const isMatch = await bcrypt.compare(password, user.password);
//           if (!isMatch) {
//               return res.status(400).json({ message: 'Username atau password salah' });
//           }
//           res.status(200).json({ message: 'Login successful' });
//       } catch (err) {
//           res.status(500).json({ error: err.message });
//       }
//  });

 //NGEBUAT TOKEN SAAT LOGIN
 router.post('/login', async (req, res) => {
      try {
          const { username, password } = req.body;
        // Cek apakah pengguna ada
          const user = await User.findOne({ username });
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
        // Verifikasi password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return res.status(400).json({ message: 'Invalid credentials' });
          }
          const token = jwt.sign(
              { id: user._id, username: user.username },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_IN }
          );
        res.status(200).json({ message: 'Login successful', token });
      } catch (err) {
          res.status(500).json({ error: err.message }); } });

