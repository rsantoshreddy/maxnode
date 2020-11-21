const fs = require('fs');
const path = require('path');
const rootDirectory = require('../utils/rootDir');
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
  constructor({ title }) {
    this.title = title;
  }

  save() {
    getFilecontent((products) => {
        products.push(this);
        fs.writeFile(productFile, JSON.stringify(products), (err) => {
          console.log(err);
        });
    });
  }

  static fetchAll(cb) {
    getFilecontent(cb);
  }
};
