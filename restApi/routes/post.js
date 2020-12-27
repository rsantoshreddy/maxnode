const express = require('express');
const postRoute = require('../controllers/posts');
const route = express.Router();

route.get('/posts', postRoute.getPosts);
route.post('/posts', postRoute.createPost);

module.exports = route;
