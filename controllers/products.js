const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
    res.render('add-product', {
      title: 'Add Product',
      path: '/admin/add-product',
      activeAddProduct: true,
      productCss: true,
    });
}

exports.addProduct = (req, res, next) => {
    const product = new Product({ ...req.body });
    product.save();
    res.redirect('/');
  }

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products)=>{
        res.render('shop', {
            prods: products,
            title: 'Shop',
            path: '/',
            activeShop: true,
            hasProducts: products.length > 0,
          });
    });
   
  }