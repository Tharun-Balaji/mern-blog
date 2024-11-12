
import userModel from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
export const updateUser = async (req, res, next) => {

  // console.log(req.user.params.id, req.body);

  // check if user is authorized
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'Your are not allowed to update this user'));
  };

  // check if user wants to change password
  if (req.body.password) {

    // check if password is at least 6 characters long
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters long'));
    };

    // hash password
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    // update password
    req.body.password = hashedPassword;

  };

  // check if user wants to change username
  if (req.body.username) {

    // check if username is at least 3 characters long
    if (req.body.username.length < 3 || req.body.username.length > 20) {
      return next(errorHandler(400, 'Username must be between 3 and 20 characters long'));
    }

    // check if username contains spaces
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    };

    // check if username is lowercase
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    };

    // check if username contains only letters and numbers
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, 'Username must only contain letters and numbers'));
    };
  }

  try {

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password
        },
      },
      { new: true }
    );

    // delete password from response
    delete updatedUser.password

    res.status(200).json(updatedUser);

  } catch (error) {

    next(error);
  }
};

export const deleteUser = async (req, res, next) => {

  // check if user is authorized
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'Your are not allowed to delete this user'));
  };

  try {

    // delete user
    await userModel.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');

  } catch (error) {

    next(error);

  }

};

export const signout = (req, res, next) => {

  try {
    res.clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }

};
 

export const getUsers = async (req, res, next) => {

  if (!req.user.isAdmin) { // check if user is admin
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await userModel.find()
      .sort({ createdAt: sortDirection }) // sort users by createdAt date
      .skip(startIndex) // skip users based on start index
      .limit(limit); // limit users based on limit

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc; // remove password from user object
      return rest;
    });

    const totalUsers = await userModel.countDocuments(); // count total number of users

    const now = new Date(); // get current date

    const oneMonthAgo = new Date( // get one month ago date
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await userModel.countDocuments({
      createdAt: { $gte: oneMonthAgo }, // count number of users created in the last month
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Gets a user by id
 * @param {string} req.params.userId - Id of the user to retrieve
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const getUser = async (req, res, next) => {
  try {
    // find user by id
    const user = await userModel.findById(req.params.userId);

    // if user is not found
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // remove password from user object
    const { password, ...rest } = user._doc;

    // return user object without password
    res.status(200).json(rest);
  } catch (error) {
    // handle any errors
    next(error);
  }
};




