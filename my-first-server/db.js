const mongoose = require('mongoose');

 mongoose.connect(process.env.MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
 }).then(() => {
      console.log('MongoDB connected 🎉');
 }).catch((err) => {
      console.error('Connection error:', err);
 });