require('./db');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const PORT = 3000;

dotenv.config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected')

const app = express();

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
})

// Middleware untuk parsing JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

//DATABASE
const mongoose = require('mongoose');
const Products = require('./models/Product');

// READ PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const products = await Products.find(); 
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', authRoutes); // Menambahkan prefix /api/auth untuk route auth

// Rute untuk endpoint yang dilindungi
app.use('/protected', protectedRoutes);

const User = require('./models/User');
const Cart = require('./models/Cart'); // Tambahkan ini
const authMiddleware = require('./middlewares/authMiddleware');

// Rute untuk mendapatkan data pengguna yang sedang login
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Jangan kirim password
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rute buat nambahin produk ke cart
app.post('/api/cart', authMiddleware, async (req, res) => {
  try {
    const { product_id, product_name, product_image, product_price, product_quantity } = req.body;

    // Validasi input
    if (!product_id || !product_name || !product_image || !product_price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Ambil email user dari middleware
    const userEmail = req.user.email;

    // Periksa apakah produk sudah ada di keranjang pengguna
    const existingCartItem = await Cart.findOne({
      user_id: req.user.id,
      product_id,
    });

    if (existingCartItem) {
      // Update jumlah jika produk sudah ada
      existingCartItem.product_quantity += product_quantity;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Cart updated successfully.', cartItem: existingCartItem });
    }

    // Buat item keranjang baru
    const newCartItem = new Cart({
      user_id: req.user.id,
      user_email: userEmail,
      product_id,
      product_name,
      product_image,
      product_price,
      product_quantity,
    });

    await newCartItem.save();
    res.status(201).json({ message: 'Product added to cart.', cartItem: newCartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});
