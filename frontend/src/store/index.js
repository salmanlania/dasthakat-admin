import { combineReducers, configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./features/sidebarSlice";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
