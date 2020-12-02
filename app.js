// =========import libs==========
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mangoose = require('mongoose');
// =========import routes==========
const productRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

// =========import utils==========

// =========import models==========
const User = require('./models/user');

const app = express();

// =========ejs Configurations==========
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5fc475abb010131dd828e574')
    .then((user) => {
      if (!user) {
        const newUser = new User({
          name: 'Santosh',
          email: 'rsantoshreddy09@gmail.con',
        });
        newUser.save().then((user) => {
          console.log(user);
          req.user = user;
        });
      } else {
        req.user = user;
      }
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use('/admin', productRouter);
app.use(shopRouter);
app.use(authRouter);

app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page not found' });
});

mangoose
  .connect(
    'mongodb+srv://root:mongodb@123@cluster0.dbhbj.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });
