import { configureStore } from '@reduxjs/toolkit';
import messageSliceReducer from './messageSlice';
import themeSlice from './themeSlice';

export const store = configureStore({
  reducer: {
    message: messageSliceReducer,
    theme: themeSlice,
  },
});
