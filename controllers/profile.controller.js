'use strict';

const Profile = require('../models/Profile');
const { successResponse, errorResponse } = require('../helpers/apiResponse');

// Create a new profile
const createProfile = async (req, res) => {
  try {
    const { name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche, image } = req.body;

    if (!name) {
      return errorResponse(res, 400, 'Name is required');
    }

    const profileData = {
      name,
      description: description || '',
      mbti: mbti || '',
      enneagram: enneagram || '',
      variant: variant || '',
      tritype: tritype || null,
      socionics: socionics || '',
      sloan: sloan || '',
      psyche: psyche || '',
      image: image || ''
    };

    const profile = await Profile.create(profileData);

    return successResponse(res, 201, profile);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().lean();
    return successResponse(res, 200, { profiles, count: profiles.length });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);

    if (!profile) {
      return errorResponse(res, 404, 'Profile not found');
    }

    return successResponse(res, 200, profile);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Update a profile
const updateProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche, image } = req.body;

    const existingProfile = await Profile.findById(id);

    if (!existingProfile) {
      return errorResponse(res, 404, 'Profile not found');
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (mbti !== undefined) updateFields.mbti = mbti;
    if (enneagram !== undefined) updateFields.enneagram = enneagram;
    if (variant !== undefined) updateFields.variant = variant;
    if (tritype !== undefined) updateFields.tritype = tritype;
    if (socionics !== undefined) updateFields.socionics = socionics;
    if (sloan !== undefined) updateFields.sloan = sloan;
    if (psyche !== undefined) updateFields.psyche = psyche;
    if (image !== undefined) updateFields.image = image;

    const result = await Profile.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, result);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Delete a profile
const deleteProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProfile = await Profile.findById(id);

    if (!existingProfile) {
      return errorResponse(res, 404, 'Profile not found');
    }

    await Profile.findByIdAndDelete(id);
    return successResponse(res, 200, { message: 'Profile deleted successfully' });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfileById,
  deleteProfileById
};
