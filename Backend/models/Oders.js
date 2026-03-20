const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: String,
  customer: {
    name: String, address: String,
    city: String, pincode: String, phone: String
  },
  items: Array,
  total: Number,
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);