const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
     nama: { type: String, required: true },
     username: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     phone: { type: String, required: true },
     address: { type: String, required: true },
     city: { type: String, required: true },
});

const Product = mongoose.model('Product', userSchema);
module.exports = [Product];