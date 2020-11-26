const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.deleteCartItem);
router.get('/orders', shopController.getOrders);
router.post('/orders', shopController.postOrders);

module.exports = router;
