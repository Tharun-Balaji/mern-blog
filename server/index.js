import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { authRoute, commentRoute, postRoute, userRoute } from './routes/index.js';
import cookieParser from 'cookie-parser';
import path from 'path';



dotenv.config();


mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

// Handle client-side routing by sending the index.html file for any route that's not an API route
app.get('*', (req, res) => {
  // Send the index.html file from the client/dist folder
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error Handling
app.use((error, req, res) => {
  const statusCode = error.status || 500;
  const message = error.message || 'Something went wrong';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});



app.listen(PORT, () => {
  console.log('Listening on %i...', PORT);
});
