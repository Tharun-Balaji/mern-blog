
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {

  console.log('verifying token...');



  // get token from cookies
  const token = req.cookies.access_token;

  //  check if token exists
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  // verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  });

};