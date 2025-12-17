'use strict';

const User = require('../models/User');
const { successResponse, errorResponse } = require('../helpers/apiResponse');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return errorResponse(res, 400, 'Name is required');
    }

    const userData = {
      name,
      image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
    };

    const user = await User.create(userData);

    return successResponse(res, 201, user);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    return successResponse(res, 200, { users, count: users.length });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, user);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Update a user
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return errorResponse(res, 404, 'User not found');
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (image !== undefined) updateFields.image = image;

    const result = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, result);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// Delete a user
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return errorResponse(res, 404, 'User not found');
    }

    await User.findByIdAndDelete(id);
    return successResponse(res, 200, { message: 'User deleted successfully' });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
