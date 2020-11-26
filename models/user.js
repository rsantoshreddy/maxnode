const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');
module.exports = class User {
  constructor({ name, email, cart, _id }) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = new ObjectId(_id);
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .catch((err) => {
        console.log(err);
      });
  }

  getCart() {
    const db = getDb();
    const quantitiesMap = {};
    const productIds = this.cart.items.map((item) => {
      quantitiesMap[item.productId.toString()] = item.quantity;
      return item.productId;
    });
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        const cartWithProducts = [];
        products.forEach((product) => {
          if (quantitiesMap[product._id.toString()]) {
            cartWithProducts.push({
              ...product,
              quantity: quantitiesMap[product._id.toString()],
            });
          }
        });
        return cartWithProducts;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
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
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updateCart } });
  }

  deleteCartItem(productId) {
    const items = this.cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: { items } } });
  }

  addOrder() {
    return this.getCart().then((items) => {
      const db = getDb();
      return db
        .collection('orders')
        .insertOne({
          items,
          user: {
            _id: this._id,
            name: this.name,
          },
        })
        .then(() => {
          this.cart.items = [];
          return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
        });
    });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': this._id })
      .toArray()
      .catch((err) => {
        console.log(err);
      });
  }
};
