// =========import libs==========
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
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

// app.use(multer({ dest: 'images' }).single('image'));
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const name = `${new Date().getTime()}_${file.originalname}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  }
  cb(null, false);
};

app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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

app.use((error, req, res, next) => {
  // res.redirect('/500');// Dont do this, this may lead to infinite loop
  console.log(error);
  res
    .status(500)
    .render('500', { title: 'Internal server error', error, isLoggedIn: true });
});

mangoose
  .connect(mongoDbUrl, { useNewUrlParser: true })
  .then(() => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });
