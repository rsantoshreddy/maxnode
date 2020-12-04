// =========import libs==========
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mangoose = require('mongoose');
const session = require('express-session');
const MongoDBSessionStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

// =========import routes==========
const productRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

// =========import utils==========

// =========import models==========
const User = require('./models/user');
const mongoDbUrl =
  'mongodb+srv://root:mongodb@123@cluster0.dbhbj.mongodb.net/shop';

const app = express();
const sessionStore = new MongoDBSessionStore({
  uri: mongoDbUrl,
  collection: 'session',
});
// =========ejs Configurations==========
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(csurf());
app.use(flash());

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    next();
  }
});

// setting locals
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csurfToken = req.csrfToken();
  next();
});

app.use('/admin', productRouter);
app.use(shopRouter);
app.use(authRouter);

app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page not found' });
});

mangoose
  .connect(mongoDbUrl, { useNewUrlParser: true })
  .then(() => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });
