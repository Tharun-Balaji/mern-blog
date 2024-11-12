// Import the configureStore function from the @reduxjs/toolkit library
// This function is used to create a Redux store
import { configureStore } from '@reduxjs/toolkit';

// Import the rootReducer from the ./root file
// The rootReducer is the top-level reducer that combines all other reducers
import rootReducer from './root';

// Import the storage object from the redux-persist library
// This object is used to persist the Redux state to local storage
import storage from 'redux-persist/lib/storage';

// Import the persistReducer and persistStore functions from the redux-persist library
// These functions are used to persist the Redux state to local storage
import { persistReducer, persistStore } from 'redux-persist';

// Define the persistConfig object
// This object contains the configuration for persisting the Redux state
const persistConfig = {
  // The key to use for storing the persisted state in local storage
  key: 'root',
  // The storage object to use for persisting the state
  storage,
  // The version of the persisted state
  version: 1,
};

// Create a persistedReducer by wrapping the rootReducer with the persistReducer function
// This allows the Redux state to be persisted to local storage
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store using the configureStore function
// Pass the persistedReducer as the reducer to the store
export const store = configureStore({
  // The reducer to use for the store
  reducer: persistedReducer,
  // The middleware to use for the store
  middleware: (getDefaultMiddleware) =>
    // Use the default middleware, but disable the serializableCheck
    getDefaultMiddleware({ serializableCheck: false }),
});

// Create the persistor object using the persistStore function
// This object is used to persist the Redux state to local storage
export const persistor = persistStore(store);