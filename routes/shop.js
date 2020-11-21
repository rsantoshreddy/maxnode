const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDir');
const adminData = require('./admin');
const router = express.Router();

router.get('/', (req, res, next) => {
  //   res.send('<h1>Helo from express</h1>');
  //   res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
  // res.sendFile(path.join(rootDirectory, 'views', 'shop.html'));
  res.render('shop', {
    prods: adminData.products,
    title: 'Shop',
    path: '/',
    activeShop: true,
    hasProducts: adminData.products.length > 0,
  });
});

module.exports = router;
