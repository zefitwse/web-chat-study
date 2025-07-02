import { configureStore } from '@reduxjs/toolkit';
import messageSliceReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    message: messageSliceReducer,
  },
});
