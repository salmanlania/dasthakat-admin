import { combineReducers, configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "./features/sidebarSlice";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import userPermissionReducer from "./features/userPermissionSlice";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  user: userReducer,
  userPermission: userPermissionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
