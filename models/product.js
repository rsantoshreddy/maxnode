const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');
module.exports = class Product {
  constructor({ productId, title, price, imageUrl, description, userId }) {
    this._id = productId ? new ObjectId(productId) : null;
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp.catch((err) => {
      console.log(err);
    });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new ObjectId(productId) })
      .next()
      .catch((err) => {
        console.log(err);
      });
  }
  static deleteById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new ObjectId(productId) })
      .catch((err) => {
        console.log(err);
      });
  }
};
