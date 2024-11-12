// Import the createSlice function from the @reduxjs/toolkit library
// This function is used to create a Redux slice, which is a self-contained piece of state and functionality
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state of the user slice
// This state will be used to store information about the current user
const initialState = {
  // The current user object
  currentUser: null,
  // Any error messages related to user authentication
  error: null,
  // A flag indicating whether the user is currently loading
  loading :false
};

// Create the user slice using the createSlice function
// This slice will manage the state and functionality related to user authentication
const userSlice = createSlice({
  // The name of the slice
  name: 'user',
  // The initial state of the slice
  initialState,
  // The reducers for the slice, which define how the state changes in response to actions
  reducers: {
    // The reducer for the signInStart action, which sets the loading flag to true and clears any error messages
    singInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // The reducer for the signInSuccess action, which sets the current user and clears any error messages
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    // The reducer for the signInFailure action, which sets the error message and clears the loading flag
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // The reducer for the updateStart action, which sets the loading flag to true and clears any error messages
    updateStart: (state) => { 
      state.loading = true;
      state.error = null;
    },
    // The reducer for the updateSuccess action, which updates the current user and clears any error messages
    updateSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    // The reducer for the updateFailure action, which sets the error message and clears the loading flag
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // The reducer for the deleteUserStart action, which sets the loading flag to true and clears any error messages
      deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // The reducer for the deleteUserSuccess action, which clears the current user and any error messages
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    // The reducer for the deleteUserFailure action, which sets the error message and clears the loading flag
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // The reducer for the signOutStart action, which sets the loading flag to true and clears any error messages
    signOutStart : (state) => {
      state.loading = true;
      state.error = null;
    },
    // The reducer for the signOutSuccess action, which clears the current user and any error messages
    signOutSuccess : (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    }
  }
});

// Export the actions and reducer for the user slice
// These can be used in other parts of the application to interact with the user slice
export const {
  singInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
  signOutStart
} = userSlice.actions;

export default userSlice.reducer;