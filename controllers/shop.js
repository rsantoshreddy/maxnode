const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');

// '/' GET
exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop/index', {
      prods: products,
      title: 'Shop',
      path: '/',
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

// '/products' GET
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/products-list', {
        prods: products,
        title: 'Products',
        path: '/products',
        isLoggedIn: req.session.isLoggedIn,
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
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/orders' GET
exports.getOrders = (req, res, next) => {
  Order.find()
    .populate('userId')
    .populate('items.productId')
    .then((orders) => {
      console.log(orders[0].items);
      res.render('shop/orders', {
        title: 'Your orders',
        path: '/orders',
        orders,
        isLoggedIn: req.session.isLoggedIn,
      });
    });
};

// '/orders' Post
exports.postOrders = (req, res, next) => {
  const order = new Order({
    items: req.user.cart.items,
    userId: req.user._id,
  });
  order
    .save()
    .then(() => {
      req.user.cart = { items: [] };
      return req.user.save();
    })
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
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        title: 'Products',
        path: '/products',
        products,
        isLoggedIn: req.session.isLoggedIn,
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
