const fs = require('fs');
const path = require('path');
const rootDirectory = require('../utils/rootDir');
const cartFilePath = path.join(rootDirectory, 'data', 'cart.json');
module.exports = class Cart {
  constructor() {}
  static addProduct({ id, price }) {
    fs.readFile(cartFilePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
        let { products, totalPrice } = cart;
        const productIndex = products.findIndex((product) => product.id === id);
        if (productIndex >= 0) {
          products[productIndex].qty = products[productIndex].qty + 1;
        } else {
          products.push({ id, qty: 1 });
        }
        totalPrice = totalPrice + +price;
        cart = { products, totalPrice };
      }
      fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct({ id, price }) {
    fs.readFile(cartFilePath, (err, fileContent) => {
      const { products, totalPrice } = JSON.parse(fileContent);
      const deleteProduct = products.find((product) => product.id === id);

      if (deleteProduct) {
        const updatedProducts = products.filter((product) => product.id !== id);
        const updatedCart = {
          products: updatedProducts,
          totalPrice: totalPrice - deleteProduct.qty * price,
        };

        fs.writeFile(cartFilePath, JSON.stringify(updatedCart), (err) => {
          console.log(err);
        });
      }
    });
  }

  static getCart(cb){
    fs.readFile(cartFilePath, (err, fileContent) => {
      cb(JSON.parse(fileContent));
    })
  }
};
