import { combineReducers, configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "./features/sidebarSlice";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import userPermissionReducer from "./features/userPermissionSlice";
import companyReducer from "./features/companySlice";
import companyBranchReducer from "./features/companyBranchSlice";
import customerReducer from "./features/customerSlice";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  user: userReducer,
  userPermission: userPermissionReducer,
  company: companyReducer,
  companyBranch: companyBranchReducer,
  customer: customerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
