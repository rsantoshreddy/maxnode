const { Schema, model } = require('mongoose');

const orderSchema = Schema({
  id: {
    type: String,
  },
  items: [
    {
      product: {
        type: Object,
      },
      quantity: { type: Number, required: true },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = model('Order', orderSchema);
