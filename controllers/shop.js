const Product = require('../models/product');
const Cart = require('../models/cart');

// '/' GET
exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([products]) => {
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
    .then(([products]) => {
      console.log(products);
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
  Product.fetchById(productId)
    .then(([product]) => {
      res.render('shop/product-details', {
        product: product[0],
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
  res.render('shop/orders', {
    title: 'Your orders',
    path: '/orders',
  });
};

// '/cart-delete-item' POST
exports.deleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  Product.fetchById(productId)
    .then(([product]) => {
      Cart.deleteProduct({ ...product[0] });
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/cart' GET
exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      products.forEach((product) => {
        const cartProduct = cart.products.find((p) => p.id === product.id);
        if (cartProduct) {
          cartProducts.push({ ...product, qty: cartProduct.qty });
        }
      });
      res.render('shop/cart', {
        title: 'Products',
        path: '/products',
        products: cartProducts,
      });
    });
  });
};

// '/cart' Post
exports.postCart = (req, res, next) => {
  Product.fetchById(req.body.productId, (product) => {
    Cart.addProduct({ ...product });
    res.redirect('/cart');
  });
};
