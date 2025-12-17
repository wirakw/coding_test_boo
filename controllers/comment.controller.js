'use strict';

const Comment = require('../models/Comment');
const { successResponse, errorResponse } = require('../helpers/apiResponse');
const { isValidMBTI, isValidZodiac, isValidEnneagram } = require('../helpers/personalityOptions');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { profileId, userId, title, content, personality } = req.body;

    if (!profileId || !userId || !title || !content || !personality) {
      return errorResponse(res, 400, 'all fields are required');
    }

    if (personality && typeof personality !== 'object') {
      return errorResponse(res, 400, 'Personality must be an object');
    }

    if (personality) {
      if (personality.mbti && !isValidMBTI(personality.mbti)) {
        return errorResponse(res, 400, 'Invalid MBTI type in personality');
      }
      if (personality.zodiac && !isValidZodiac(personality.zodiac)) {
        return errorResponse(res, 400, 'Invalid Zodiac sign in personality');
      }
      if (personality.enneagram && !isValidEnneagram(personality.enneagram)) {
        return errorResponse(res, 400, 'Invalid Enneagram type in personality');
      }
    }

    const commentData = {
      profileId,
      userId,
      title,
      content,
      personality
    };

    const comment = await Comment.create(commentData);

    return successResponse(res, 201, comment);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllComments = async (req, res) => {
  try {
    const {personality = "all", orderBy = "createdAt"} = req.query;

    let filter = {};
    if (personality === "mbti") {
      filter["personality.mbti"] = { $ne: null };
    } else if (personality === "zodiac") {
      filter["personality.zodiac"] = { $ne: null };
    } else if (personality === "enneagram") {
      filter["personality.enneagram"] = { $ne: null };
    }

    const sortOption = {
      [orderBy]: 1
    };

    const comments = await Comment.find(filter).sort(sortOption).lean();
    return successResponse(res, 200, { comments, count: comments.length });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// const getCommentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const comment = await Comment.findById(id);

//     if (!comment) {
//       return errorResponse(res, 404, 'Comment not found');
//     }

//     return successResponse(res, 200, comment);
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

// // Update a comment
// const updateCommentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, image } = req.body;

//     const existingComment = await Comment.findById(id);

//     if (!existingComment) {
//       return errorResponse(res, 404, 'Comment not found');
//     }

//     const updateFields = {};
//     if (name !== undefined) updateFields.name = name;
//     if (image !== undefined) updateFields.image = image;

//     const result = await Comment.findByIdAndUpdate(
//       id,
//       updateFields,
//       { new: true, runValidators: true }
//     );

//     return successResponse(res, 200, result);
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

// // Delete a comment
// const deleteCommentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const existingComment = await Comment.findById(id);

//     if (!existingComment) {
//       return errorResponse(res, 404, 'Comment not found');
//     }

//     await Comment.findByIdAndDelete(id);
//     return successResponse(res, 200, { message: 'Comment deleted successfully' });
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

module.exports = {
  createComment,
  getAllComments,
  // getCommentById,
  // updateCommentById,
  // deleteCommentById
};
