const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    product_name: { type: String, required: true, unique: true },
    product_category: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true }, 
    product_image: { type: String, required: true },
});

const Products = mongoose.model('Products', ProductSchema);

module.exports = Products;
