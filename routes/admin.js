const express = require('express');
const router = express.Router();
const path = require('path');
const rootDirectory = require('../utils/rootDir');

const products = [];

router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDirectory, 'views', 'add-product.html'));
  res.render('add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCss: true,
  });
});

router.post('/product', (req, res, next) => {
  products.push({ ...req.body });
  res.redirect('/');
});

exports.productRouter = router;
exports.products = products;
