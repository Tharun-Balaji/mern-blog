import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export async function signUp(req, res, next) {
  // console.log(req.body);

  // get data from req.body
  const { username, email, password } = req.body;

  // check if all fields are filled
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
    return;
  };

  // hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // create new user
  const newUser = new userModel({
    username,
    email,
    password: hashedPassword
  });

  try {
    // save user
    await newUser.save();

    // return response
    return res.status(201).json({
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
};


export async function signIn(req, res, next) {

  // get data from req.body
  const { email, password } = req.body;

  //check if all fields are filled
  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
    return;
  };

  try {

    // find user
    const validUser = await userModel.findOne({ email });

    // if not valid user
    if (!validUser) {
      next(errorHandler(404, 'User not found'));
      return;
    };

    // check password
    const validPassword = await bcryptjs.compare(password, validUser.password);

    // if not valid password
    if (!validPassword) {
      next(errorHandler(401, 'Invalid password'));
      return;
    };

    // create token
    const token = jwt.sign({
      id: validUser._id,
      isAdmin: validUser.isAdmin  
    }, process.env.JWT_SECRET);

    // delete password
    validUser.password = undefined;

    // send response
    return res.status(200).cookie('access_token', token, { // set cookie
      httpOnly: true // only accessible by web server
    }).json(validUser)

  } catch (error) {
    next(error);
  }

};

export async function google(req, res, next) {

  // get data from req.body
  const { email, name, googlePhotoUrl } = req.body;

  try {

    // find user
    const user = await userModel.findOne({ email });

    //if user exists
    if (user) {

      // create token
      const token = jwt.sign({
        id: user._id,
      }, process.env.JWT_SECRET);

      // delete password
      user.password = undefined;

      // send response
      return res.status(200).cookie('access_token', token, { // set cookie
        httpOnly: true // only accessible by web server
      }).json(user)
    } else { // if user doesn't exist

      // generate a random password of 16 characters long
      // using the Math.random().toString(36) method
      // which generates a random string of 36 possible characters
      // (0-9, a-z) and takes a slice of the last 8 characters
      // then another slice of the last 8 characters and concatenates them
      // this will give a password of 16 characters long
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      // hash password
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      // create new user
      const newUser = new userModel({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl
      });

      // save user
      await newUser.save();

      // create token
      const token = jwt.sign({
        id: newUser._id,
        isAdmin: newUser.isAdmin
      }, process.env.JWT_SECRET);

      // delete password
      newUser.password = undefined;

      // send response
      return res.status(201).cookie('access_token', token, { // set cookie
        httpOnly: true // only accessible by web server
      }).json(newUser);

    }

  } catch (error) {
    next(error);
  }
};