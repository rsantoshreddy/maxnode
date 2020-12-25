const Product = require('../models/product');
const user = require('../models/user');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
  });
};

// /product POST
exports.addProduct = (req, res, next) => {
  // const {} = req.body;
  const product = new Product({ ...req.body, userId: req.user._id });
  product
    .save()
    .then(() => {
      res.redirect('/admin/admin-product');
    })
    .catch((error) => {
      next(error);
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
  const { productId, ...restProps } = req.body;
  Product.findByIdAndUpdate(productId, restProps)
    .then(() => {
      res.redirect('/admin/admin-product');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect('/admin/admin-product');
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/products' GET
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((products) => {
    res.render('admin/products', {
      prods: products,
      title: 'Products',
      path: '/products',
    });
  });
};
