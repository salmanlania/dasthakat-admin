import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export const getVendorBillList = createAsyncThunk(
  'vendorBill/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('vendor-bill', {
        params: {
          ...params,
          all: 1
        }
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getVendorBill = createAsyncThunk(
  'vendorBill/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`vendor-bill/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateVendorBillForm = createAsyncThunk(
  'vendorBill/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`vendor-bill/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createVendorBill = createAsyncThunk(
  'vendorBill/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('vendor-bill', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createVendorBillSettlement = createAsyncThunk(
  'vendorBillSettlement/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('vendor-bill-tagging', payload);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteVendorBill = createAsyncThunk(
  'vendorBill/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`vendor-bill/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteVendorBill = createAsyncThunk(
  'vendorBill/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('vendor-bill/bulk-delete', {
        id: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCustomerLedgerInvoices = createAsyncThunk(
  'vendorBill/vendorBillDetails',
  async (customerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customer/${customerId}/ledger-invoices`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUnsettledInvoices = createAsyncThunk(
  'vendorBill/getUnsettledInvoices',
  async ({ supplierId, vendorBillId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/supplier/${supplierId}/unsettled-invoices`, {
        params: {
          payment_voucher_id: vendorBillId
        }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  isBulkDeleting: false,
  initialFormValues: null,
  saleInvoiceDetail: null,
  isItemLoading: false,
  vendorBillDetails: [],
  vendorPaymentSettlementDetails: [],
  isLedgerLoading: false,
  list: [],
  balanceAmount: [],
  listID: [],
  deleteIDs: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    sort_direction: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const vendorBillSlice = createSlice({
  name: 'vendorBill',
  initialState,
  reducers: {
    setVendorBillListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setVendorBillDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetVendorBillForm: (state) => {
      state.initialFormValues = null;
      state.vendorBillDetails = [];
    },

    resetVendorBillSettlementForm: (state) => {
      state.initialFormValues = null;
      state.vendorPaymentSettlementDetails = [];
    },

    setFormField: (state, action) => {
      const { field, value } = action.payload;
      if (state.initialFormValues) {
        state.initialFormValues[field] = value;
      }
    },

    changeVendorBillDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.vendorBillDetails[from];
      state.vendorBillDetails[from] = state.vendorBillDetails[to];
      state.vendorBillDetails[to] = temp;
    },

    changeVendorSettlementDetail: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.vendorPaymentSettlementDetails[from];
      state.vendorPaymentSettlementDetails[from] = state.vendorPaymentSettlementDetails[to];
      state.vendorPaymentSettlementDetails[to] = temp;
    },

    addVendorBillDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        account_id: null,
        amount: 0,
        net_amount: 0,
        sort_order: state.vendorBillDetails.length + 1,
        row_status: 'I',
        isDeleted: false
      };

      if (index || index === 0) {
        state.vendorBillDetails.splice(index + 1, 0, newDetail);
      } else {
        state.vendorBillDetails.push(newDetail);
      }

      state.vendorBillDetails = state.vendorBillDetails.map((item, i) => ({
        ...item,
        sort_order: i + 1,
      }));
    },

    addVendorSettlementDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        account_id: null,
        amount: 0,
        net_amount: 0,
        sort_order: state.vendorPaymentSettlementDetails.length + 1,
        row_status: 'I',
        isDeleted: false
      };

      if (index || index === 0) {
        state.vendorPaymentSettlementDetails.splice(index + 1, 0, newDetail);
      } else {
        state.vendorPaymentSettlementDetails.push(newDetail);
      }

      state.vendorPaymentSettlementDetails = state.vendorPaymentSettlementDetails.map((item, i) => ({
        ...item,
        sort_order: i + 1,
      }));
    },

    removeVendorBillDetail: (state, action) => {
      const itemIndex = state.vendorBillDetails.findIndex(
        (item) => item.id === action.payload
      );

      if (itemIndex !== -1) {
        if (state.vendorBillDetails[itemIndex].row_status === 'I') {
          state.vendorBillDetails = state.vendorBillDetails.filter(
            (item) => item.id !== action.payload
          );
        } else {
          state.vendorBillDetails[itemIndex].row_status = 'D';
          state.vendorBillDetails[itemIndex].isDeleted = true;
        }
      }
    },

    copyVendorBillDetail: (state, action) => {
      const index = action.payload;

      if (index >= 0 && index < state.vendorBillDetails.length) {
        const { editable, ...detail } = state.vendorBillDetails[index];
        
        const accountId = detail.account_id;
        const account = accountId && typeof accountId === "object" ? accountId : { value: accountId, label: "" };

        const newDetail = {
          ...detail,
          account_id: account,
          id: uuidv4(),
          payment_voucher_id: null,
          payment_voucher_detail_id: null,
          sort_order: state.vendorBillDetails.length + 1,
          row_status: 'I',
          isDeleted: false,
        };
        
        state.vendorBillDetails.splice(index + 1, 0, newDetail);
      }
    },

    updateVendorBillDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const index = state.vendorBillDetails.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.vendorBillDetails[index] = {
          ...state.vendorBillDetails[index],
          [field]: value,
        };
      }
    },

    updateVendorSettlementDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const index = state.vendorPaymentSettlementDetails.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.vendorPaymentSettlementDetails[index] = {
          ...state.vendorPaymentSettlementDetails[index],
          [field]: value,
        };
      }
    },

  },
  extraReducers: ({ addCase }) => {
    addCase(getVendorBillList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getVendorBillList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.listID = data.map((item) => {
        return item.sale_invoice_id;
      });
      state.balanceAmount = data.map((item) => {
        return item.balance_amount;
      });
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getVendorBillList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createVendorBill.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createVendorBill.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createVendorBill.rejected, (state) => {
      state.isFormSubmitting = false;
    });


    addCase(createVendorBillSettlement.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createVendorBillSettlement.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createVendorBillSettlement.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteVendorBill.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteVendorBill.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteVendorBill.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getVendorBill.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getVendorBill.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        ...data,
        document_date: data?.document_date ? dayjs(data?.document_date) : null,
        document_identity: data?.document_identity ? data?.document_identity : null,
        remarks: data?.remarks ? data?.remarks : null,
        supplier_id: data?.supplier
          ? {
            value: data?.supplier?.supplier_id,
            label: data?.supplier?.name
          }
          : null,
        total_amount: data?.total_amount ? parseInt(data?.total_amount) : null,
        remarks: data?.remarks ? data?.remarks : null,
        amount: data?.amount ? parseInt(data?.amount) : null,
      };
      state.vendorBillDetails = data?.details.map((detail) => ({
        ...detail,
        id: detail?.vendor_bill_detail_id ? detail?.vendor_bill_detail_id : null,
        sort_order: detail?.sort_order ? detail?.sort_order : null,
        remarks: detail?.remarks ? detail?.remarks : null,
        account_id: detail?.account
          ? {
            value: detail?.account?.account_id,
            label: detail?.account?.name
          }
          : null,
        amount: detail?.amount ? detail?.amount : null,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getVendorBill.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.vendorBillDetails = []
    });

    addCase(getCustomerLedgerInvoices.pending, (state) => {
      state.isLedgerLoading = true;
      state.vendorBillDetails = [];
    });
    addCase(getCustomerLedgerInvoices.fulfilled, (state, action) => {
      state.isLedgerLoading = false;
      state.vendorBillDetails = action.payload;
    });
    addCase(getCustomerLedgerInvoices.rejected, (state) => {
      state.isLedgerLoading = false;
    });

    addCase(getUnsettledInvoices.pending, (state) => {
      state.isLedgerLoading = true;
      state.vendorPaymentSettlementDetails = [];
    });
    addCase(getUnsettledInvoices.fulfilled, (state, action) => {
      state.isLedgerLoading = false;
      const data = action.payload
      state.vendorPaymentSettlementDetails = data?.map((detail) => ({
        ...detail,
        id: detail?.purchase_invoice_id ? detail?.purchase_invoice_id : null,
        purchase_invoice_id: detail?.purchase_invoice_id ? detail?.purchase_invoice_id : null,
        document_identity: detail?.document_identity ? detail?.document_identity : null,
        amount: detail?.balance_amount ? detail?.balance_amount : null,
        disabled: true,
        isDeleted: false,
        row_status: "I"
      }))
    });
    addCase(getUnsettledInvoices.rejected, (state) => {
      state.isLedgerLoading = false;
    });
  }
});

export const { setVendorBillListParams, setVendorBillDeleteIDs, setFormField, resetVendorBillForm, resetVendorBillSettlementForm, changeVendorBillDetailOrder, addVendorBillDetail,
  addVendorSettlementDetail, updateVendorBillDetail, updateVendorSettlementDetail, copyVendorBillDetail, removeVendorBillDetail, changeVendorSettlementDetail } = vendorBillSlice.actions;
export default vendorBillSlice.reducer;
