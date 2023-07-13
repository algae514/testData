// store.ts

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './path/to/rootReducer';

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
