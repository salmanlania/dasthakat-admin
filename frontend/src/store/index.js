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
import costCenterReducer from './features/costCenterSlice';
import payeeReducer from './features/payeeSlice';
import goodsReceivedNoteReducer from './features/goodsReceivedNoteSlice';
import openingStockReducer from './features/openingStockSlice';
import ijoReducer from './features/ijoSlice';
import paymentReducer from './features/paymentSlice';
import pickListReducer from './features/pickListSlice';
import portReducer from './features/portSlice';
import productReducer from './features/productSlice';
import purchaseInvoiceReducer from './features/purchaseInvoiceSlice';
import saleInvoiceReducer from './features/saleInvoiceSlice';
import accountsReducer from './features/accountsSlice';
import purchaseOrderReducer from './features/purchaseOrderSlice';
import quotationReducer from './features/quotationSlice';
import salesmanReducer from './features/salesmanSlice';
import salesTeamReducer from './features/salesTeamSlice';
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
import companySettingReducer from './features/companySettingSlice';
import saleReturnReducer from './features/saleReturnSlice';
import creditNoteReducer from './features/creditNoteSlice';
import stockReturnReducer from './features/stockReturnSlice';
import purchaseReturnReducer from './features/purchaseReturnSlice';
import vendorQuotationReducer from './features/vendorQuotationSlice';
import vendorChargeOrderReducer from './features/vendorChargeOrderSlice';
import customerPaymentReducer from './features/customerPaymentSlice'
import customerPaymentSettlementReducer from './features/customerPaymentSettlementSlice'
import vendorPaymentReducer from './features/vendorPaymentSlice'
import paymentVoucherReducer from './features/paymentVoucherSlice'
import journalVoucherReducer from './features/journalVoucherSlice'
import vendorBillReducer from './features/vendorBillSlice'

// reports
import reportsReducer from './features/reportsSlice';

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
  costCenter: costCenterReducer,
  payee: payeeReducer,
  agent: agentReducer,
  commissionAgent: commissionAgentReducer,
  dispatch: dispatchReducer,
  class: classReducer,
  port: portReducer,
  validity: validityReducer,
  payment: paymentReducer,
  salesman: salesmanReducer,
  salesTeam: salesTeamReducer,
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
  accounts: accountsReducer,
  saleReturn: saleReturnReducer,
  creditNote: creditNoteReducer,
  stockReturn: stockReturnReducer,
  purchaseReturn: purchaseReturnReducer,
  goodsReceivedNote: goodsReceivedNoteReducer,
  openingStock: openingStockReducer,
  quotation: quotationReducer,
  chargeOrder: chargeOrderReducer,
  ijo: ijoReducer,
  shipment: shipmentReducer,
  serviceOrder: serviceOrderReducer,
  companySetting: companySettingReducer,
  vendorQuotation: vendorQuotationReducer,
  vendorChargeOrder: vendorChargeOrderReducer,
  customerPayment: customerPaymentReducer,
  customerPaymentSettlement: customerPaymentSettlementReducer,
  vendorPayment: vendorPaymentReducer,
  paymentVoucher: paymentVoucherReducer,
  journalVoucher: journalVoucherReducer,
  vendorBill: vendorBillReducer,
  reports: reportsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
