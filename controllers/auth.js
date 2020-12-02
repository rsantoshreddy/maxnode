const User = require('../models/user');

// '/login' GET
exports.getLogin = (req, res, next) => {
  // req.get('Cookie');
  // console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    title: 'Login',
    path: '/login',
    isLoggedIn: req.session.isLoggedIn,
  });
};
// '/login' POST
exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true;'); //HttpOnly; Max-Age=10; Secure
  User.findById('5fc475abb010131dd828e574').then((user) => {
    if (!user) {
      req.session.user = new User({
        name: 'Santosh',
        email: 'rsantoshreddy09@gmail.con',
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((user) => {
      res.redirect('/');
      console.log(user);
    });
  });
};

// '/logout' POST
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};
