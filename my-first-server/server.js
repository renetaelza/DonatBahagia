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
const Cart = require('./models/Cart');
const Order = require('./models/Order');
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

app.post('/api/checkout', async (req, res) => {
    const { order_cost, user_id, user_phone, user_address, user_city, products } = req.body;

    try {
        // Cek jika semua field ada
        if (!order_cost || !user_id || !user_phone || !user_address || !user_city || !products) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate order_id incrementally
        const lastOrder = await Order.findOne().sort({ order_id: -1 }).limit(1); // Ambil order_id terakhir
        const newOrderId = lastOrder ? lastOrder.order_id + 1 : 1; // Increment order_id

        // Menambahkan order_date
        const orderDate = new Date().toISOString();

        // Buat objek order baru
        const newOrder = new Order({
            order_id: newOrderId,
            order_date: orderDate,
            order_cost: order_cost,
            order_status: 'Paid', // Atur status default menjadi 'Paid'
            user_id: user_id, // Simpan user_id langsung dari request body
            user_phone: user_phone,
            user_address: user_address,
            user_city: user_city,
            products: products // Produk dikirimkan langsung dalam request body
        });

        // Simpan order ke database
        await newOrder.save();

        // Kirim response sukses
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/orders/history', authMiddleware, async (req, res) => {
  try {
    // Find user by ID, excluding password field
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch orders for the user and sort by order date (most recent first)
    const orders = await Order.find({ user_id: user._id }).sort({ order_date: -1 });

    // Check if the user has any orders
    if (orders.length === 0) {
      return res.status(200).json({ message: 'No orders found for this user.' });
    }

    // Prepare the order data to send back
    const orderHistory = orders.map(order => ({
      order_id: order.order_id,
      order_date: order.order_date,
      products: order.products.map(product => ({
        product_name: product.product_name,
        product_image: product.product_image,
        product_price: product.product_price,
        product_quantity: product.product_quantity,
      })),
      order_cost: order.order_cost,
      order_status: order.order_status,
    }));

    // Send the order history back in the response
    res.json(orderHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
