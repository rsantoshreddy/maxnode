const bcrypt = require('bcrypt');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    title: 'Signup',
    path: '/auth/signup',
  });
};

exports.postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.redirect('/login');
      } else {
        return bcrypt.hash(password, 12);
      }
    })
    .then((password) => {
      const newUser = new User({
        name,
        email,
        password,
        confirmPassword: password,
      });
      newUser.save().then(() => {
        res.redirect('/login');
      });
    });
};

// '/login' GET
exports.getLogin = (req, res, next) => {
  // req.get('Cookie');
  const messages = req.flash('error');
  let message = null;
  if (messages.length) {
    message = messages[0];
  }
  res.render('auth/login', {
    title: 'Login',
    path: '/login',
    errorMessage: message,
  });
};
// '/login' POST
exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true;'); //HttpOnly; Max-Age=10; Secure
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      req.flash('error', 'email or password wrong');
      return res.redirect('/login');
    }
    bcrypt
      .compare(password, user.password)
      .then((isValid) => {
        if (isValid) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((user) => {
            res.redirect('/');
            console.log(user);
          });
        }
        res.redirect('/login');
      })
      .catch();
  });
};

// '/logout' POST
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};
