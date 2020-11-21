const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/add-product', productsController.getAddProducts);
router.post('/product', productsController.addProduct);

module.exports = router;
