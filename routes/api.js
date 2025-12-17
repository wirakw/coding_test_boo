'use strict';

const express = require('express');
const profileRoutes = require('./api/profile');
const userRoutes = require('./api/user');
const commentRoutes = require('./api/comment');

module.exports = function() {
  const router = express.Router();

  // Mount API routes
  router.use('/profile', profileRoutes());
  router.use('/user', userRoutes());
  router.use('/comment', commentRoutes());

  return router;
};