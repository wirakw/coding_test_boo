'use strict';

const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../../controllers/user.controller');

module.exports = function() {
  const router = express.Router();

  router.post('/', createUser);
  router.get('/', getAllUsers);
  router.get('/:id', getUserById);
  router.put('/:id', updateUserById);
  router.delete('/:id', deleteUserById);

  return router;
};
