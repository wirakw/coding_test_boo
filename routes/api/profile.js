'use strict';

const express = require('express');
const {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfileById,
  deleteProfileById
} = require('../../controllers/profile.controller');

module.exports = function() {
  const router = express.Router();

  router.post('/', createProfile);
  router.get('/', getAllProfiles);
  router.get('/:id', getProfileById);
  router.put('/:id', updateProfileById);
  router.delete('/:id', deleteProfileById);

  return router;
};
