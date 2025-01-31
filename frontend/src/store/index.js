import { combineReducers, configureStore } from '@reduxjs/toolkit';

import agentReducer from './features/agentSlice';
import authReducer from './features/authSlice';
import brandReducer from './features/brandSlice';
import categoryReducer from './features/categorySlice';
import chargeOrderReducer from './features/chargeOrderSlice';
import classReducer from './features/classSlice';
import companyBranchReducer from './features/companyBranchSlice';
import companyReducer from './features/companySlice';
import currencyReducer from './features/currencySlice';
import customerReducer from './features/customerSlice';
import eventReducer from './features/eventSlice';
import flagReducer from './features/flagSlice';
import goodsReceivedNoteReducer from './features/goodsReceivedNoteSlice';
import paymentReducer from './features/paymentSlice';
import portReducer from './features/portSlice';
import productReducer from './features/productSlice';
import purchaseInvoiceReducer from './features/purchaseInvoiceSlice';
import purchaseOrderReducer from './features/purchaseOrderSlice';
import quotationReducer from './features/quotationSlice';
import salesmanReducer from './features/salesmanSlice';
import sidebarReducer from './features/sidebarSlice';
import subCategoryReducer from './features/subCategorySlice';
import termsReducer from './features/termsSlice';
import unitReducer from './features/unitSlice';
import userPermissionReducer from './features/userPermissionSlice';
import userReducer from './features/userSlice';
import validityReducer from './features/validitySlice';
import vendorReducer from './features/vendorSlice';
import vesselReducer from './features/vesselSlice';
import warehouseReducer from './features/warehouseSlice';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  user: userReducer,
  userPermission: userPermissionReducer,
  currency: currencyReducer,
  company: companyReducer,
  companyBranch: companyBranchReducer,
  customer: customerReducer,
  vendor: vendorReducer,
  terms: termsReducer,
  flag: flagReducer,
  agent: agentReducer,
  class: classReducer,
  port: portReducer,
  validity: validityReducer,
  payment: paymentReducer,
  salesman: salesmanReducer,
  subCategory: subCategoryReducer,
  category: categoryReducer,
  brand: brandReducer,
  warehouse: warehouseReducer,
  unit: unitReducer,
  vessel: vesselReducer,
  event: eventReducer,
  product: productReducer,
  purchaseOrder: purchaseOrderReducer,
  purchaseInvoice: purchaseInvoiceReducer,
  goodsReceivedNote: goodsReceivedNoteReducer,
  quotation: quotationReducer,
  chargeOrder: chargeOrderReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
