const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
  });
};

exports.addProduct = (req, res, next) => {
  req.user
    .createProduct({ ...req.body })
    // Product.create({ ...req.body })
    .then(() => {
      res.redirect('/admin/admin-product');
    })
    .catch((err) => {
      console.log(err);
    });
};

// update product
exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  req.user.getProducts({where:{id:productId}}).then(products=>{
  // Product.findByPk(productId).then((product) => {
    res.render('admin/edit-product', {
      title: 'Update Product',
      path: '/admin/update-product',
      editMode: true,
      product: products[0],
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description, imageUrl } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.redirect('/admin/admin-product');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.destroy({ where: { id: productId } })
    .then((resu) => {
      res.redirect('/admin/admin-product');
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/products' GET
exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products=>{
  // Product.findAll().then((products) => {
    res.render('admin/products', {
      prods: products,
      title: 'Products',
      path: '/products',
    });
  });
};
