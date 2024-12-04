const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_email: { type: String, required: true },
  product_id: { type: String, required: true }, // Ubah ke String
  product_name: { type: String, required: true },
  product_image: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model('Cart', CartSchema);
