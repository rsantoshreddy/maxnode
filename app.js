const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const expressHandleBars = require('express-handlebars');
const productRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const app = express();
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// =========ejs Configurations==========
app.set('view engine', 'ejs');
app.set('views', 'views');

// =========HandleBars Configurations==========
// app.engine(
//   'hbs',
//   expressHandleBars({ extname: '.hbs', defaultLayout: 'layout' })
// ); // this has to be defined as this engine is not defined in express
// app.set('view engine', 'hbs');
// app.set('views', 'views');

// =========PUG Configurations==========
// app.set('view engine', 'pug');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use('/admin', productRouter);
app.use(shopRouter);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404', { title: 'Page not found' });
});

Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); //Optional
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({force:true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'santosh',
        email: 'rsantoshreddy09@gmail.com',
      });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });

// ===========Basics=============
// const http = require('http');
// const app = (req, res) => {
//   console.log(req);
//   // process.exit()
//   res.setHeader('Content-Type', 'text/html');
//   res.write('<html>');
//   res.write('<head><title>My First Page</title></head>');
//   res.write('<body>Hello from node js server</body>');
//   res.write('</html>');
//   res.end();
// };
// const server = http.createServer(app);
// server.listen(9000, () => {
//   console.log('Server Started at 9000');
// });
