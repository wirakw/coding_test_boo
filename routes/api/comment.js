'use strict';

const express = require('express');
const {
  createComment,
  getAllComments
} = require('../../controllers/comment.controller');

module.exports = function() {
  const router = express.Router();

  router.post('/', createComment);
  router.get('/', getAllComments);

  return router;
};
