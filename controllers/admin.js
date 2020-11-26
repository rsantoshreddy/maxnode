const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
  });
};

// /product POST
exports.addProduct = (req, res, next) => {
  const product = new Product({ ...req.body, userId: req.user._id });
  product.save().then(() => {
    res.redirect('/admin/admin-product');
  });
};

// update product
exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId).then((product) => {
    res.render('admin/edit-product', {
      title: 'Update Product',
      path: '/admin/update-product',
      editMode: true,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const product = new Product(req.body);
  product
    .save()
    .then(() => {
      res.redirect('/admin/admin-product');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId)
    .then(() => {
      res.redirect('/admin/admin-product');
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/products' GET
exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('admin/products', {
      prods: products,
      title: 'Products',
      path: '/products',
    });
  });
};
