const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  services: {
    type: [String],
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  pickupDate: {
    type: String,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Diterima', 'Dijemput', 'Dicuci', 'Disetrika', 'Siap Antar', 'Selesai'],
    default: 'Diterima'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'non-cash'],
    default: 'cash'
  },
  paymentType: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  paymentProof: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
