'use strict';

const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const profile = require('./api/profile');

// const profiles = [
//   {
//     "id": 1,
//     "name": "A Martinez",
//     "description": "Adolph Larrue Martinez III.",
//     "mbti": "ISFJ",
//     "enneagram": "9w3",
//     "variant": "sp/so",
//     "tritype": 725,
//     "socionics": "SEE",
//     "sloan": "RCOEN",
//     "psyche": "FEVL",
//     "image": "https://soulverse.boo.world/images/1.png",
//   }
// ];

module.exports = function() {

  // i make default route to get random profile
  router.get('/', async function(req, res, next) {
    try {
    const profiles = await Profile.find().limit(1).lean();
    if (!profiles || profiles.length === 0) {
      return res.status(404).send('No profiles found');
    }

    res.render('profile_template', {
      profile: profiles[0],
    });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

