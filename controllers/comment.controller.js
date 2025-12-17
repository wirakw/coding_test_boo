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
    const { personality = "all", orderBy = "createdAt" } = req.query;

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

    let comments = await Comment.find(filter).sort(sortOption).lean();
    comments = comments.map(c => ({
      ...c,
      totalLikes: c.likes ? c.likes.length : 0
    }));

    return successResponse(res, 200, { comments, count: comments.length });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

//this part for like a comment by another user
const likeUnlikeComment = async (req, res) => {
  try {
    const { commentId, userId } = req.body;
    if (!commentId || !userId) {
      return errorResponse(res, 400, 'commentId and userId are required');
    }

    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return errorResponse(res, 404, 'Comment not found');
    }

    let result;
    const alreadyLiked = existingComment.likes.includes(userId);
    if (alreadyLiked) { //for unlike
      result = await Comment.findByIdAndUpdate(commentId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      result = await Comment.findByIdAndUpdate(commentId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }
    return successResponse(res, 200,  {
      comment: result,
      liked: !alreadyLiked,
      totalLikes: result.likes.length
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


module.exports = {
  createComment,
  getAllComments,
  likeUnlikeComment,
};
