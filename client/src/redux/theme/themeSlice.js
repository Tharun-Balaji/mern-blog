// Import the createSlice function from the @reduxjs/toolkit library
// This function is used to create a Redux slice, which is a self-contained piece of state and functionality
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state of the theme slice
// This state will be used to store the current theme of the application
const initialState = {
  // The current theme of the application
  // This can be set to 'light' or 'dark'
  theme: 'light'
};

// Create the theme slice using the createSlice function
// This slice will manage the state and functionality related to the theme of the application
const themeSlice = createSlice({
  // The name of the slice
  name: 'theme',
  // The initial state of the slice
  initialState,
  // The reducers for the slice, which define how the state changes in response to actions
  reducers: {
    // The reducer for the toggleTheme action, which toggles the current theme of the application
    toggleTheme: (state) => {
      // Toggle the current theme between 'light' and 'dark'
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

// Export the actions and reducer for the theme slice
// These can be used in other parts of the application to interact with the theme slice
export const { toggleTheme } = themeSlice.actions;

// Export the reducer for the theme slice
// This can be used to create a Redux store that includes the theme slice
export default themeSlice.reducer;