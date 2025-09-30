import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';

export const getVendorPaymentList = createAsyncThunk(
  'vendorPayment/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/vendor-payment', {
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

export const getVendorPayment = createAsyncThunk(
  'vendorPayment/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/vendor-payment/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateVendorPaymentForm = createAsyncThunk(
  'vendorPayment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/vendor-payment/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createVendorPayment = createAsyncThunk(
  'vendorPayment/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/vendor-payment', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteVendorPayment = createAsyncThunk(
  'vendorPayment/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/vendor-payment/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteVendorPayment = createAsyncThunk(
  'vendorPayment/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/vendor-payment/bulk-delete', {
        id: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getVendorLedgerInvoices = createAsyncThunk(
  'vendorPayment/ledgerInvoices',
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/supplier/${vendorId}/ledger-invoices`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getVendorPaymentLedger = createAsyncThunk(
  'vendorPayment/ledger',
  async ({ typeId, document_id }, { rejectWithValue }) => {
    try {
      const res = await api.get('/ledger/document-ledger/', {
        params: { document_type_id: typeId, document_id }
      });
      return res?.data;
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
  ledgerInvoices: [],
  ledger: [],
  ledgerData: null,
  isLedgerLoading: false,
  ledgerLoading: false,
  list: [],
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

export const vendorPaymentSlice = createSlice({
  name: 'vendorPayment',
  initialState,
  reducers: {
    setVendorPaymentListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    updateVendorPaymentDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const index = state.ledgerInvoices.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.ledgerInvoices[index] = {
          ...state.ledgerInvoices[index],
          [field]: value,
        };
      }
    },

    setVendorPaymentDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetVendorPaymentForm: (state) => {
      state.initialFormValues = null;
      state.ledgerInvoices = [];
    },

    setFormField: (state, action) => {
      const { field, value } = action.payload;
      if (state.initialFormValues) {
        state.initialFormValues[field] = value;
      }
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getVendorPaymentList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getVendorPaymentList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.listID = data.map((item) => {
        return item.purchase_invoice_id;
      });
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getVendorPaymentList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createVendorPayment.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createVendorPayment.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createVendorPayment.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteVendorPayment.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteVendorPayment.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteVendorPayment.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getVendorPayment.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getVendorPayment.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        ...data,
        document_date: data?.document_date ? dayjs(data?.document_date) : null,
        document_identity: data?.document_identity ? data?.document_identity : null,
        supplier_id: data?.supplier
          ? {
            value: data?.supplier?.supplier_id,
            label: data?.supplier?.name
          }
          : null,
        transaction_account_id: data?.transaction_account
          ? {
            value: data?.transaction_account?.account_id,
            label: data?.transaction_account?.name
          }
          : null,
        total_amount: data?.total_amount ? parseInt(data?.total_amount) : null,
        remarks: data?.remarks ? data?.remarks : null,
        payment_amount: data?.payment_amount ? parseInt(data?.payment_amount) : null,
      };
      state.ledgerInvoices = data?.details.map((detail) => ({
        id: detail?.purchase_invoice_id ? detail?.purchase_invoice_id : null,
        purchase_invoice_id: detail?.purchase_invoice_id ? detail?.purchase_invoice_id : null,
        sort_order: detail?.sort_order ? detail?.sort_order : null,
        settled_amount: detail?.settled_amount ? parseInt(detail?.settled_amount) : null,
        ref_document_identity: detail?.ref_document_identity ? detail?.ref_document_identity : null,
        document_date: detail?.purchase_invoice?.document_date ? dayjs(detail?.purchase_invoice?.document_date) : null,
        document_identity: detail?.ref_document_identity ? detail?.ref_document_identity : null,
        net_amount: detail?.original_amount ? parseInt(detail?.original_amount) : null,
        balance_amount: detail?.balance_amount ? parseInt(detail?.balance_amount) : null,
        vendor_payment_detail_id: detail?.vendor_payment_detail_id ? detail?.vendor_payment_detail_id : null,
        account_id: detail?.account
          ? {
            value: detail?.account?.account_id,
            label: detail?.account?.name
          }
          : null,
        vendorpayment_id: detail?.vendorpayment_id ? detail?.vendorpayment_id : null,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getVendorPayment.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.ledgerInvoices = []
    });

    addCase(getVendorLedgerInvoices.pending, (state) => {
      state.isLedgerLoading = true;
      state.ledgerInvoices = [];
    });
    addCase(getVendorLedgerInvoices.fulfilled, (state, action) => {
      state.isLedgerLoading = false;
      state.ledgerInvoices = action.payload;
    });
    addCase(getVendorLedgerInvoices.rejected, (state) => {
      state.isLedgerLoading = false;
    });

    addCase(getVendorPaymentLedger.pending, (state) => {
      state.ledgerLoading = true;
      state.ledger = [];
    });
    addCase(getVendorPaymentLedger.fulfilled, (state, action) => {
      state.ledgerLoading = false;
      const data = action.payload;
      state.ledgerData = {
        total_debit: data?.data?.total_debit ? data?.data?.total_debit : null,
        total_credit: data?.data?.total_credit ? data?.data?.total_credit : null,
      };
      state.ledger = data?.data?.data.map((detail) => ({
        id: detail?.ledger_id ? detail?.ledger_id : null,
        ledger_id: detail?.ledger_id ? detail?.ledger_id : null,
        account_name: detail?.display_account_name ? detail?.display_account_name : null,
        display_account_name: detail?.display_account_name ? detail?.display_account_name : null,
        debit_amount: detail?.debit ? detail?.debit : 0,
        credit_amount: detail?.credit ? detail?.credit : 0,
      }));
    });
    addCase(getVendorPaymentLedger.rejected, (state) => {
      state.ledgerLoading = false;
    });
  }
});

export const { setVendorPaymentListParams, setVendorPaymentDeleteIDs, setFormField, resetVendorPaymentForm, updateVendorPaymentDetail } = vendorPaymentSlice.actions;
export default vendorPaymentSlice.reducer;
