'use strict';

const express = require('express');
const profileRoutes = require('./api/profile');

module.exports = function() {
  const router = express.Router();

  // Mount API routes
  router.use('/profile', profileRoutes());

  return router;
};