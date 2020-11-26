const Product = require('../models/product');
// const Cart = require('../models/cart');

// '/' GET
exports.getIndex = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      title: 'Shop',
      path: '/',
    });
  });
};

// '/products' GET
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/products-list', {
        prods: products,
        title: 'Products',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/products/productId' GET
exports.getProductDetails = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        title: 'Products',
        path: `/products/${productId}`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/orders' GET
exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render('shop/orders', {
      title: 'Your orders',
      path: '/orders',
      orders,
    });
  });
};

// '/orders' Post
exports.postOrders = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/cart-delete-item' POST
exports.deleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  req.user.deleteCartItem(productId).then(() => {
    res.redirect('/cart');
  });
};

// '/cart' GET
exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render('shop/cart', {
      title: 'Products',
      path: '/products',
      products,
    });
  });
};

// '/cart' Post
exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId).then((product) => {
    req.user
      .addToCart(product)
      .then(() => {
        res.redirect('/cart');
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
