import { combineReducers, configureStore } from '@reduxjs/toolkit';

import agentReducer from './features/agentSlice';
import commissionAgentReducer from './features/commissionAgentSlice';
import authReducer from './features/authSlice';
import brandReducer from './features/brandSlice';
import categoryReducer from './features/categorySlice';
import chargeOrderReducer from './features/chargeOrderSlice';
import classReducer from './features/classSlice';
import companyBranchReducer from './features/companyBranchSlice';
import companyReducer from './features/companySlice';
import currencyReducer from './features/currencySlice';
import customerReducer from './features/customerSlice';
import dispatchReducer from './features/dispatchSlice';
import eventReducer from './features/eventSlice';
import flagReducer from './features/flagSlice';
import goodsReceivedNoteReducer from './features/goodsReceivedNoteSlice';
import ijoReducer from './features/ijoSlice';
import paymentReducer from './features/paymentSlice';
import pickListReducer from './features/pickListSlice';
import portReducer from './features/portSlice';
import productReducer from './features/productSlice';
import purchaseInvoiceReducer from './features/purchaseInvoiceSlice';
import saleInvoiceReducer from './features/saleInvoiceSlice';
import purchaseOrderReducer from './features/purchaseOrderSlice';
import quotationReducer from './features/quotationSlice';
import salesmanReducer from './features/salesmanSlice';
import serviceListReducer from './features/serviceListSlice';
import shipmentReducer from './features/shipmentSlice';
import serviceOrderReducer from './features/ServiceOrder';
import sidebarReducer from './features/sidebarSlice';
import subCategoryReducer from './features/subCategorySlice';
import technicianReducer from './features/technicianSlice';
import termsReducer from './features/termsSlice';
import unitReducer from './features/unitSlice';
import userPermissionReducer from './features/userPermissionSlice';
import userReducer from './features/userSlice';
import validityReducer from './features/validitySlice';
import vendorReducer from './features/vendorSlice';
import vesselReducer from './features/vesselSlice';
import warehouseReducer from './features/warehouseSlice';
import auditReducer from './features/auditSlice';
import CompanySettingReducer from './features/companySetting';
import SaleReturnReducer from './features/saleReturnSlice';
import StockReturnReducer from './features/stockReturnSlice';
import PurchaseReturnReducer from './features/purchaseReturnSlice';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: authReducer,
  user: userReducer,
  userPermission: userPermissionReducer,
  audit: auditReducer,
  currency: currencyReducer,
  company: companyReducer,
  pickList: pickListReducer,
  serviceList: serviceListReducer,
  companyBranch: companyBranchReducer,
  customer: customerReducer,
  vendor: vendorReducer,
  terms: termsReducer,
  flag: flagReducer,
  agent: agentReducer,
  commissionAgent: commissionAgentReducer,
  dispatch: dispatchReducer,
  class: classReducer,
  port: portReducer,
  validity: validityReducer,
  payment: paymentReducer,
  salesman: salesmanReducer,
  subCategory: subCategoryReducer,
  category: categoryReducer,
  brand: brandReducer,
  technician: technicianReducer,
  warehouse: warehouseReducer,
  unit: unitReducer,
  vessel: vesselReducer,
  event: eventReducer,
  product: productReducer,
  purchaseOrder: purchaseOrderReducer,
  purchaseInvoice: purchaseInvoiceReducer,
  saleInvoice: saleInvoiceReducer,
  saleReturn: SaleReturnReducer,
  stockReturn: StockReturnReducer,
  purchaseReturn: PurchaseReturnReducer,
  goodsReceivedNote: goodsReceivedNoteReducer,
  quotation: quotationReducer,
  chargeOrder: chargeOrderReducer,
  ijo: ijoReducer,
  shipment: shipmentReducer,
  serviceOrder: serviceOrderReducer,
  CompanySetting: CompanySettingReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
