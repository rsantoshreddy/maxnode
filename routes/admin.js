const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth');

router.get('/add-product', isAuth, adminController.getAddProducts);
router.post('/product', isAuth, adminController.addProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.deleteProduct);
router.get('/admin-product', isAuth, adminController.getProducts);

module.exports = router;
