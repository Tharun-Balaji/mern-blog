// Import the combineReducers function from the @reduxjs/toolkit library
import { combineReducers } from '@reduxjs/toolkit';

// Import the userReducer and themeReducer from their respective files
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';

// Create a rootReducer by combining the userReducer and themeReducer using combineReducers
// This allows us to manage multiple reducers in a single store
const rootReducer = combineReducers({
  // Map the userReducer to the 'user' key in the state object
  user: userReducer,
  // Map the themeReducer to the 'theme' key in the state object
  theme: themeReducer
});

// Export the rootReducer as the default export of this file
export default rootReducer;