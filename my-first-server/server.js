require('./db');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const PORT = 3000;

dotenv.config();

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