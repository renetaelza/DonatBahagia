const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     phone: { type: String, required: true },
     address: { type: String, required: true },
     city: { type: String, required: true },
});
 // Hash password sebelum menyimpan ke database
userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 10);
     next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
