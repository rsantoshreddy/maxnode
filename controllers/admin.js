const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
  });
};

exports.addProduct = (req, res, next) => {
  const product = new Product({ ...req.body, id: null });
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

// update product
exports.getEditProduct = (req, res, next) => {
  // console.log(req.query);
  // console.log(req.params);
  const { productId } = req.params;
  Product.fetchById(productId)
  .then(([product]) => {
    res.render('admin/edit-product', {
      title: 'Update Product',
      path: '/admin/update-product',
      editMode: true,
      product: product[0],
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, ...restBody } = req.body;
  const product = new Product({ ...restBody, id: productId });
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
  Product.delete(productId, () => {
    res.redirect('/admin/admin-product');
  });
};

// '/products' GET
exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([products]) => {
    res.render('admin/products', {
      prods: products,
      title: 'Products',
      path: '/products',
    });
  });
};
