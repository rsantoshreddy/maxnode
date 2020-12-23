const { Schema, model } = require('mongoose');

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpire: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // cant use arrow function here
  console.log(this);
  const cartProductIndex = this.cart.items.findIndex(
    (p) => p.productId.toString() === product._id.toString()
  );
  let updateCart = { items: [...(this.cart.items || [])] };
  if (cartProductIndex >= 0) {
    const cartItem = updateCart.items[cartProductIndex];
    cartItem.quantity = cartItem.quantity + 1;
  } else {
    updateCart.items.push({ productId: product._id, quantity: 1 });
  }
  this.cart = updateCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
  const items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.cart.items = items;
  return this.save();
};

module.exports = model('User', userSchema);
