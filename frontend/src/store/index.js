import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import companyBranchReducer from "./features/companyBranchSlice";
import companyReducer from "./features/companySlice";
import customerReducer from "./features/customerSlice";
import sidebarReducer from "./features/sidebarSlice";
import vendorReducer from "./features/vendorSlice";
import userPermissionReducer from "./features/userPermissionSlice";
import userReducer from "./features/userSlice";
import flagReducer from "./features/flagSlice";
import classReducer from "./features/classSlice";
import validityReducer from "./features/validitySlice";
import paymentReducer from "./features/paymentSlice";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  user: userReducer,
  userPermission: userPermissionReducer,
  company: companyReducer,
  companyBranch: companyBranchReducer,
  customer: customerReducer,
  vendor: vendorReducer,
  flag: flagReducer,
  class: classReducer,
  validity: validityReducer,
  payment: paymentReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
