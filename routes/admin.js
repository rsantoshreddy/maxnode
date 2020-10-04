const express = require('express');
const router = express.Router();
const path = require('path');
const rootDirectory = require('../utils/rootDir');

router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDirectory, 'views', 'add-product.html'));
});

router.post('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
