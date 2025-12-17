'use strict';

const express = require('express');
const {
  createComment,
  getAllComments,
  likeUnlikeComment
} = require('../../controllers/comment.controller');

module.exports = function() {
  const router = express.Router();

  router.post('/', createComment);
  router.get('/', getAllComments);
  
  router.post('/like', likeUnlikeComment);

  return router;
};
