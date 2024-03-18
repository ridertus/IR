const mongoose = require('mongoose');

const orderListSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    enum: ['Queue', 'Cook', 'Delivery', 'Complete'],
    default: 'Queue'
  }
});

module.exports = mongoose.model('OrderList', orderListSchema);
