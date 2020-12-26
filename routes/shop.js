const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.deleteCartItem);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/orders', isAuth, shopController.postOrders);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
