const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth');

router.get('/add-product', isAuth, adminController.getAddProducts);
router.post(
  '/add-product',
  isAuth,
  [
    check('title').isString().isLength({ min: 2, max: 15 }).trim(),
    check('price').isFloat(),
    check('description').isString().trim(),
  ],
  adminController.addProduct
);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
// router.post('/delete-product', isAuth, adminController.deleteProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);
router.get('/admin-product', isAuth, adminController.getProducts);

module.exports = router;
