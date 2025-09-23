import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';

export const getCustomerPaymentList = createAsyncThunk(
  'customerPayment/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/customer-payment', {
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

export const getCustomerPayment = createAsyncThunk(
  'customerPayment/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customer-payment/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCustomerPaymentForm = createAsyncThunk(
  'customerPayment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/customer-payment/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCustomerPayment = createAsyncThunk(
  'customerPayment/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/customer-payment', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCustomerPayment = createAsyncThunk(
  'customerPayment/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/customer-payment/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCustomerPayment = createAsyncThunk(
  'customerPayment/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/customer-payment/bulk-delete', {
        id: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCustomerLedgerInvoices = createAsyncThunk(
  'customerPayment/ledgerInvoices',
  async (customerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customer/${customerId}/ledger-invoices`);
      return res.data.data; // adjust if your API response is different
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
  isLedgerLoading: false,
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

export const customerPaymentSlice = createSlice({
  name: 'customerPayment',
  initialState,
  reducers: {
    setCustomerPaymentListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCustomerPaymentDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetCustomerPaymentForm: (state) => {
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
    addCase(getCustomerPaymentList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCustomerPaymentList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.listID = data.map((item) => {
        return item.sale_invoice_id;
      });
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCustomerPaymentList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCustomerPayment.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCustomerPayment.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCustomerPayment.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteCustomerPayment.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCustomerPayment.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCustomerPayment.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getCustomerPayment.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCustomerPayment.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        ...data,
        document_date: data?.document_date ? dayjs(data?.document_date) : null,
        document_identity: data?.document_identity ? data?.document_identity : null,
        customer_id: data?.customer
          ? {
            value: data?.customer?.customer_id,
            label: data?.customer?.name
          }
          : null,
        total_amount: data?.total_amount ? parseInt(data?.total_amount) : null,
        remarks: data?.remarks ? data?.remarks : null,
        payment_amount: data?.payment_amount ? parseInt(data?.payment_amount) : null,
      };
      state.ledgerInvoices = data?.details.map((detail) => ({
        id: detail?.sale_invoice_id ? detail?.sale_invoice_id : null,
        sale_invoice_id: detail?.sale_invoice_id ? detail?.sale_invoice_id : null,
        sort_order: detail?.sort_order ? detail?.sort_order : null,
        settled_amount: detail?.settled_amount ? parseInt(detail?.settled_amount) : null,
        ref_document_identity: detail?.ref_document_identity ? detail?.ref_document_identity : null,
        document_date: detail?.sale_invoice?.document_date ? dayjs(detail?.sale_invoice?.document_date) : null,
        document_identity: detail?.ref_document_identity ? detail?.ref_document_identity : null,
        net_amount: detail?.original_amount ? parseInt(detail?.original_amount) : null,
        balance_amount: detail?.balance_amount ? parseInt(detail?.balance_amount) : null,
        customer_payment_detail_id: detail?.customer_payment_detail_id ? detail?.customer_payment_detail_id : null,
        customer_payment_id: detail?.customer_payment_id ? detail?.customer_payment_id : null,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getCustomerPayment.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.ledgerInvoices = []
    });

    addCase(getCustomerLedgerInvoices.pending, (state) => {
      state.isLedgerLoading = true;
      state.ledgerInvoices = [];
    });
    addCase(getCustomerLedgerInvoices.fulfilled, (state, action) => {
      state.isLedgerLoading = false;
      state.ledgerInvoices = action.payload;
    });
    addCase(getCustomerLedgerInvoices.rejected, (state) => {
      state.isLedgerLoading = false;
    });
  }
});

export const { setCustomerPaymentListParams, setCustomerPaymentDeleteIDs, setFormField, resetCustomerPaymentForm } = customerPaymentSlice.actions;
export default customerPaymentSlice.reducer;
