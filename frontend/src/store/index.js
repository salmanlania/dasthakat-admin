import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import brandReducer from "./features/brandSlice";
import categoryReducer from "./features/categorySlice";
import classReducer from "./features/classSlice";
import companyBranchReducer from "./features/companyBranchSlice";
import companyReducer from "./features/companySlice";
import customerReducer from "./features/customerSlice";
import eventReducer from "./features/eventSlice";
import flagReducer from "./features/flagSlice";
import paymentReducer from "./features/paymentSlice";
import productReducer from "./features/productSlice";
import salesmanReducer from "./features/salesmanSlice";
import sidebarReducer from "./features/sidebarSlice";
import subCategoryReducer from "./features/subCategorySlice";
import termsReducer from "./features/termsSlice";
import unitReducer from "./features/unitSlice";
import userPermissionReducer from "./features/userPermissionSlice";
import userReducer from "./features/userSlice";
import validityReducer from "./features/validitySlice";
import vendorReducer from "./features/vendorSlice";
import vesselReducer from "./features/vesselSlice";
import quotationReducer from "./features/quotationSlice";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  user: userReducer,
  userPermission: userPermissionReducer,
  company: companyReducer,
  companyBranch: companyBranchReducer,
  customer: customerReducer,
  vendor: vendorReducer,
  terms: termsReducer,
  flag: flagReducer,
  class: classReducer,
  validity: validityReducer,
  payment: paymentReducer,
  salesman: salesmanReducer,
  subCategory: subCategoryReducer,
  category: categoryReducer,
  brand: brandReducer,
  unit: unitReducer,
  vessel: vesselReducer,
  event: eventReducer,
  product: productReducer,
  quotation: quotationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
