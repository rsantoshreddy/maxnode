const { validationResult } = require('express-validator/check');
const Product = require('../models/product');
const user = require('../models/user');
const { deleteFile } = require('../utils/file');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
    errorMessage: '',
    product: {
      title: '',
      price: '',
      imageUrl: '',
      description: '',
    },
  });
};

// /product POST
exports.addProduct = (req, res, next) => {
  let { title, price, imageUrl, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  if (!image || !errors.isEmpty()) {
    // 422 is for invalid input
    return res.status(422).render('admin/edit-product', {
      title: 'Add Product',
      path: '/admin/add-product',
      editMode: false,
      product: {
        title,
        price,
        imageUrl,
        description,
      },
      errorMessage: !errors.isEmpty()
        ? errors.array()[0].msg
        : 'Invalid image format',
    });
  }

  imageUrl = image.path;

  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user._id,
  });

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
      product,
      errorMessage: '',
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, ...restProps } = req.body;
  let { imageUrl } = restProps;
  const image = req.file;

  // Product.findByIdAndUpdate(productId, { ...restProps, imageUrl })
  //   .then(() => {
  //     res.redirect('/admin/admin-product');
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorised access!'));
      }

      const { imageUrl: oldImageUrl } = product;
      const { title, price, description } = restProps;
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        deleteFile(oldImageUrl);
        imageUrl = image.path;
        product.imageUrl = imageUrl;
      }
      return product
        .save()
        .then((result) => {
          res.redirect('/admin/admin-product');
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findByIdAndDelete(productId)
    .then((results) => {
      // res.redirect('/admin/admin-product');
      return res.status(200).json({ message: 'Product deleted successfully!' });
    })
    .catch((err) => {
      // console.log(err);
      return res.status(500).json({ message: 'Product delete failed!' });
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
