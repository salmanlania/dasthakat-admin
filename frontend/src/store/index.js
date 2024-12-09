import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import companyBranchReducer from "./features/companyBranchSlice";
import companyReducer from "./features/companySlice";
import customerReducer from "./features/customerSlice";
import sidebarReducer from "./features/sidebarSlice";
import supplierReducer from "./features/supplierSlice";
import userPermissionReducer from "./features/userPermissionSlice";
import userReducer from "./features/userSlice";
import flagReducer from "./features/flagSlice";
import classReducer from "./features/classSlice";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  user: userReducer,
  userPermission: userPermissionReducer,
  company: companyReducer,
  companyBranch: companyBranchReducer,
  customer: customerReducer,
  supplier: supplierReducer,
  flag: flagReducer,
  class: classReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
