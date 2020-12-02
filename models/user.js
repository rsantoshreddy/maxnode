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

// const { ObjectId } = require('mongodb');
// const { getDb } = require('../utils/database');
// module.exports = class User {
//   constructor({ name, email, cart, _id }) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = new ObjectId(_id);
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection('users')
//       .insertOne(this)
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getCart() {
//     const db = getDb();
//     const quantitiesMap = {};
//     const productIds = this.cart.items.map((item) => {
//       quantitiesMap[item.productId.toString()] = item.quantity;
//       return item.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         const cartWithProducts = [];
//         products.forEach((product) => {
//           if (quantitiesMap[product._id.toString()]) {
//             cartWithProducts.push({
//               ...product,
//               quantity: quantitiesMap[product._id.toString()],
//             });
//           }
//         });
//         return cartWithProducts;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(
//       (p) => p.productId.toString() === product._id.toString()
//     );
//     let updateCart = { items: [...(this.cart.items || [])] };
//     if (cartProductIndex >= 0) {
//       const cartItem = updateCart.items[cartProductIndex];
//       cartItem.quantity = cartItem.quantity + 1;
//     } else {
//       updateCart.items.push({ productId: product._id, quantity: 1 });
//     }
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updateCart } });
//   }

//   deleteCartItem(productId) {
//     const items = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId
//     );
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: { items } } });
//   }

//   addOrder() {
//     return this.getCart().then((items) => {
//       const db = getDb();
//       return db
//         .collection('orders')
//         .insertOne({
//           items,
//           user: {
//             _id: this._id,
//             name: this.name,
//           },
//         })
//         .then(() => {
//           this.cart.items = [];
//           return db
//             .collection('users')
//             .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//         });
//     });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': this._id })
//       .toArray()
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// };
