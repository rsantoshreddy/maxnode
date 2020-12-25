const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator/check');
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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'
);

exports.getSignup = (req, res, next) => {
  const messages = req.flash('error');
  let message = null;
  if (messages.length) {
    message = messages[0];
  }
  res.render('auth/signup', {
    title: 'Signup',
    path: '/auth/signup',
    errorMessage: messages,
    odlInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
};

exports.postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      title: 'Signup',
      path: '/auth/signup',
      errorMessage: errors.array()[0].msg,
      odlInput: {
        name,
        email,
        password,
        confirmPassword,
      },
    });
  }

  bcrypt
    .hash(password, 12)
    .then((password) => {
      const newUser = new User({
        name,
        email,
        password,
        confirmPassword: password,
      });

      newUser
        .save()
        .then(() => {
          res.redirect('/login');
          return sgMail
            .send({
              to: email,
              from: 'rsantoshreddy09@gmail.com',
              subject: 'Hi From Me',
              html: '<h1>Success</h1>',
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
              console.log(err.response.body);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
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
          return req.session.save(() => {
            res.redirect('/');
          });
        }
        res.redirect('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// '/logout' POST
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  const messages = req.flash('error');
  let message = null;
  if (messages.length) {
    message = messages[0];
  }
  res.render('auth/reset', {
    title: 'Reset Password',
    path: '/reset',
    errorMessage: message,
  });
};
exports.postReset = (req, res, next) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No user found with the provided email.');
          res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        sgMail.send({
          to: email,
          from: 'rsantoshreddy09@gmail.com',
          subject: 'Reset password',
          html: `<p>You have requested for reset password. Please click <a href="http://localhost:9000/reset/${token}">link</a> to reset the password</p>`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getResetPassword = (req, res, next) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Token Expired!');
        return res.redirect('/reset');
      }
      const messages = req.flash('error');
      let message = null;
      if (messages.length) {
        message = messages[0];
      }
      res.render('auth/reset-password', {
        title: 'Reset password',
        path: '/auth/reset-password',
        errorMessage: message,
        userId: user._id.toString(),
        resetToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postResetPassword = (req, res, next) => {
  const { userId, resetToken } = req.body;
  let resetUser;
  User.findOne({ _id: userId, resetToken })
    .then((user) => {
      resetUser = user;
      const { password } = req.body;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.confirmPassword = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpire = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
};
