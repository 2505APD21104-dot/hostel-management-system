const mongoose = require('mongoose');
const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Boys', 'Girls'], required: true },
  totalRooms: { type: Number, required: true },
  address: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Hostel', hostelSchema);
