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

module.exports = function () {

  router.get('/', async function (req, res, next) {
      const id = req.query.profileid;
      const profile = id 
        ? await Profile.findById(id)
        : (await Profile.find().limit(1).lean())[0];
      
      if (!profile) {
        return res.status(404).send('No profiles found');
      }

      res.render('profile_template', { profile });
  });
  return router;
}
