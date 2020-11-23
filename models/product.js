const fs = require('fs');
const path = require('path');
const rootDirectory = require('../utils/rootDir');
const mathUtils = require('../utils/mathUtils');
const Cart = require('./cart');
const productFile = path.join(rootDirectory, 'data', 'products.json');

const getFilecontent = (cb) => {
  fs.readFile(productFile, (err, fileContent) => {
    let products = [];
    if (!err) {
      products = JSON.parse(fileContent);
    }
    cb(products);
  });
};

module.exports = class Product {
  constructor({ id, title, imageUrl, price, description }) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getFilecontent((products) => {
      console.log(this.id);
      if (this.id) {
        const productIndex = products.findIndex(
          (product) => product.id == this.id
        );
        products[productIndex] = this;
      } else {
        this.id = mathUtils.getRandomInt(100).toString();
        products.push(this);
      }
      fs.writeFile(productFile, JSON.stringify(products), (err) => {});
    });
  }

  static fetchAll(cb) {
    getFilecontent(cb);
  }

  static fetchById(productId, cb) {
    getFilecontent((products) => {
      const product = products.find((prod) => prod.id === productId);
      cb(product);
    });
  }
  
  static delete(productId, cb) {
    getFilecontent((products) => {
      const productToDelete = products.find((prod) => prod.id === productId);
      Cart.deleteProduct({...productToDelete})
      const updateProducts = products.filter((prod) => prod.id !== productId);
      fs.writeFile(productFile, JSON.stringify(updateProducts), (err) => {
        cb();
      });
    });
  }
};
