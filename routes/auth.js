const express = require('express');
const { check, body, cookie, header } = require('express-validator/check');
const authController = require('../controllers/auth');
const router = express.Router();
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This Email is forbidden.');
        // }
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Email Already exist.');
          }
        });
      }),
    body(
      'password',
      'Please enter a password of length 5 with alphanumeric only.'
    )
      .isLength({ min: 5, max: 15 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords should match.');
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
module.exports = router;
