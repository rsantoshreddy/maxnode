const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { deleteFile } = require('../utils/file');
const Product = require('../models/product');
const Order = require('../models/order');

// '/' GET
exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop/index', {
      prods: products,
      title: 'Shop',
      path: '/',
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
  Order.find()
    .populate('userId')
    .populate('items.productId')
    .then((orders) => {
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
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const items = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        items,
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

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('No Order found'));
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorised access!'));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoice = path.join('data', 'invoices', invoiceName);

      // fs.readFile(invoice, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   // res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);
      //   // res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
      //   return res.send(data);
      // });
      /* 
        ================================================ 
          THE ABOVE CODE WILL WORK FINE. 
          BUT FOR LARGE FILES AND HEAVY NETWORK LOAD CASE, IT WILL OVER KILL SERVER MEMORY. 
          THE SOLUTION IS STREAM THE FILE.
        =================================================
      */
      // const invoiceStream = fs.createReadStream(invoice);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   `attachment; filename=${invoiceName}`
      // );
      // invoiceStream.pipe(res);

      /*
       ================================================ 
        DYNAMIC PDF GENERATION AND STORAGE
       ================================================
        */

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${invoiceName}`
      );
      const pdfDocument = new PDFDocument();
      pdfDocument.pipe(fs.createWriteStream(invoice));
      pdfDocument.pipe(res);
      pdfDocument.fontSize(26).text('Invoice', { align: 'center' });
      pdfDocument
        .fontSize(10)
        .text(
          '============================================================================='
        );
      let total = 0;
      order.items.forEach((item, index) => {
        const { product, quantity } = item;
        const { title, price } = product;
        total += price * quantity;
        pdfDocument
          .fontSize(16)
          .text(`${index + 1}.   ${title}    ${price} X ${quantity}`);
      });
      pdfDocument
        .fontSize(10)
        .text(
          '============================================================================='
        );
      pdfDocument.fontSize(16).text(`Total      ${total}`);

      pdfDocument.end();
    })
    .catch((err) => {
      return next(err);
    });
};
