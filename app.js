// =========import libs==========
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// =========import routes==========
const productRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

// =========import utils==========
const { mongoConnect } = require('./utils/database');

// =========import models==========
const User = require('./models/user');

const app = express();

// =========ejs Configurations==========
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findById('5fbfd07eeb65617b3ac6d460')
    .then((user) => {
      req.user = new User(user);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use('/admin', productRouter);
app.use(shopRouter);

app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page not found' });
});

mongoConnect(() => {
  app.listen(9000);
});
