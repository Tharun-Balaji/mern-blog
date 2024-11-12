import { errorHandler } from '../utils/error.js';
import Comment from '../models/comment.model.js';


/**
 * @description Creates a new comment for a post
 * @param {Object} req.body - Must contain content, postId, and userId
 * @param {string} req.body.content - Content of the comment
 * @param {string} req.body.postId - ObjectId of the post for which the comment is being created
 * @param {string} req.body.userId - ObjectId of the user who is creating the comment
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    // Check if the user is allowed to create this comment
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, 'You are not allowed to create this comment')
      );
    }

    // Create the comment
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    // Return the comment
    res.status(200).json(newComment);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

/**
 * @description Get all comments for a post
 * @param {string} req.params.postId - ObjectId of the post for which the comments are being retrieved
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const getPostComments = async (req, res, next) => {
  try {
    // Find all comments for a given post
    const comments = await Comment.find({ postId: req.params.postId })
      // Sort comments by createdAt time in descending order (newest first)
      .sort({ createdAt: -1 });
    // Return all comments for the post
    res.status(200).json(comments);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

/**
 * @description Like or unlike a comment
 * @param {string} req.params.commentId - ObjectId of the comment that is being liked or unliked
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const likeComment = async (req, res, next) => {
  try {
    // Find the comment by its ObjectId
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      // Return an error if the comment is not found
      return next(errorHandler(404, 'Comment not found'));
    }

    // Check if the user has already liked the comment
    const userIndex = comment.likes.indexOf(req.user.id);

    // If the user has not liked the comment, like it
    if (userIndex === -1) {
      // Increment the number of likes
      comment.numberOfLikes += 1;
      // Add the user's ObjectId to the list of users who have liked the comment
      comment.likes.push(req.user.id);
    } else {
      // If the user has liked the comment, unlike it
      // Decrement the number of likes
      comment.numberOfLikes -= 1;
      // Remove the user's ObjectId from the list of users who have liked the comment
      comment.likes.splice(userIndex, 1);
    }

    // Save the updated comment
    await comment.save();

    // Return the updated comment
    res.status(200).json(comment);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};


export const editComment = async (req, res, next) => {
  try {
    // Find the comment by its ID
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      // If the comment is not found, return an error
      return next(errorHandler(404, 'Comment not found'));
    }

    // Check if the user is the owner of the comment or an admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      // If not, return an error
      return next(
        errorHandler(403, 'You are not allowed to edit this comment')
      );
    }

    // Update the comment's content
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true } // Return the updated comment
    );

    // Send the updated comment as a response
    res.status(200).json(editedComment);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    // Find the comment by its ID
    const comment = await Comment.findById(req.params.commentId);
    
    // If the comment is not found, return a 404 error
    if (!comment) {
      return next(errorHandler(404, 'Comment not found')); 
    }
    
    // Check if the user is the owner of the comment or an admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to delete this comment')
      );
    }
    
    // Delete the comment from the database
    await Comment.findByIdAndDelete(req.params.commentId);
    
    // Send a success response
    res.status(200).json('Comment has been deleted');
    
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

/**
 * @description Get all comments. This endpoint is only accessible to admins.
 * @param {Number} req.query.startIndex - The index to start retrieving comments from
 * @param {Number} req.query.limit - The number of comments to return
 * @param {String} req.query.sort - The sort order of the comments. Can be either 'asc' or 'desc'
 * @returns {Object} - An object with the comments, the total number of comments, and the number of comments created in the last month
 */
export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  try {
    // Get the start index and limit from the query
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    // Get the sort order from the query. If it's not provided, sort in descending order
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    // Find all comments, sort them by createdAt in the specified order, skip the specified number of comments, and limit the results to the specified limit
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    // Count the total number of comments
    const totalComments = await Comment.countDocuments();
    // Count the number of comments created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    // Return the comments, total number of comments, and number of comments created in the last month
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
