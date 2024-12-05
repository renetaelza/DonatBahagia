const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: { type: Number, required: true, unique: true },
    order_date: { type: Date, default: Date.now },
    order_cost: { type: Number, required: true },
    order_status: { type: String, default: 'Paid' },
    user_id: { type: String, required: true },
    user_phone: { type: String, required: true },
    user_address: { type: String, required: true },
    user_city: { type: String, required: true },
    products: [{
        product_id: { type: String, required: true },
        product_name: { type: String, required: true },
        product_image: { type: String, required: true },
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true }
    }]
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
