const Product = require('../models/product');
const Cart = require('../models/cart');

// '/' GET
exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      title: 'Shop',
      path: '/',
    });
  });
};

// '/products' GET
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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
  Product.findByPk(productId)
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
  req.user.getOrders({ include: ['products'] }).then((orders) => {
    console.log(orders[0].products);
    res.render('shop/orders', {
      title: 'Your orders',
      path: '/orders',
      orders
    });
  });
};

// '/orders' Post
exports.postOrders = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      
      req.user.createOrder().then((order) => {
        return order.addProducts(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
    
      return fetchedCart.setProducts(null);
    })
    .then((results) => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/cart-delete-item' POST
exports.deleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      return products[0].cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    });
};

// '/cart' GET
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render('shop/cart', {
        title: 'Products',
        path: '/products',
        products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// '/cart' Post
exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length) {
        product = products[0];
      }
      if (product) {
        newQuantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};
