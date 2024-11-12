import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {

  if (!req.user.isAdmin) { // check if user is admin
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  if (!req.body.title || !req.body.content) { // check if all fields are filled
    return next(errorHandler(400, 'Please fill all fields'));
  }

  const slug = req.body.title // create slug
    .split(' ') // split title
    .join('-') // join with -
    .toLowerCase() // convert to lowercase
    .replace(/[^a-zA-Z0-9]/g, '-');  // remove special characters

  const newPost = new Post({ // create new post
    ...req.body, // get data from req.body
    slug, // set slug
    userId: req.user.id // set user id
  });

  try {
    
    const savedPost = await newPost.save(); // save post

    res.status(201).json(savedPost); // return response

  } catch (error) {
    next(error); // return error
  }


};

export const getPosts = async (req, res, next) => { 

  try {
    
    const startIndex = parseInt(req.query.startIndex) || 0; // get start index
    const limit = parseInt(req.query.limit) || 9; // get limit
    const sortDirection = req.query.order === 'asc' ? 1 : -1; // get sort direction

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // filter by user id if provided
      ...(req.query.category && { category: req.query.category }), // filter by category if provided
      ...(req.query.slug && { slug: req.query.slug }), // filter by slug if provided
      ...(req.query.postId && { _id: req.query.postId }), // filter by post id if provided
      ...(req.query.searchTerm && {
        $or: [ // $or allows us to search multiple fields at once
          { title: { $regex: req.query.searchTerm, $options: 'i' } }, // search for posts that have a title that contains the search term (case insensitive)
          { content: { $regex: req.query.searchTerm, $options: 'i' } }, // search for posts that have a content that contains the search term (case insensitive)
        ],
      }), // filter by search term if provided
    })
      .sort({ updatedAt: sortDirection }) // sort posts by updatedAt
      .skip(startIndex) // skip posts based on start index
      .limit(limit); // limit posts based on limit
    
    const totalPosts = await Post.countDocuments(); // count total posts

    const now = new Date(); // get current date

    const oneMonthAgo = new Date( // get one month ago date
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({  // count posts created in the last month
      createdAt: { $gte: oneMonthAgo }, // greater than or equal to one month ago
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });

  } catch (error) {
    
    next(error);

  }

};


export const deletepost = async (req, res, next) => { 

  if (!req.user.isAdmin || req.user.id !== req.params.userId) { // check if user is admin
    return next(errorHandler(403, 'You are not allowed to delete this post')); // return error
  }

  try {
    await Post.findByIdAndDelete(req.params.postId); // delete post
    res.status(200).json('The post has been deleted'); // return response
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {

  if (!req.user.isAdmin || req.user.id !== req.params.userId) { // check if user is admin and if user id is not the same as the post user id
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate( // find the post by ID and update it
      req.params.postId, // post ID from request parameters
      {
        $set: { // set the properties to update
          title: req.body.title, // update title from request body
          content: req.body.content, // update content from request body
          category: req.body.category, // update category from request body
          image: req.body.image, // update image URL from request body
        },
      },
      { new: true } // return the updated post
    );

    res.status(200).json(updatedPost); // return the updated post

  } catch (error) {
    next(error);
  }
};
