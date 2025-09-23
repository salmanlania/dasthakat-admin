import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export const getPaymentVoucherList = createAsyncThunk(
  'paymentVoucher/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/payment-voucher', {
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

export const getPaymentVoucher = createAsyncThunk(
  'paymentVoucher/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payment-voucher/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePaymentVoucherForm = createAsyncThunk(
  'paymentVoucher/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/payment-voucher/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createPaymentVoucher = createAsyncThunk(
  'paymentVoucher/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/payment-voucher', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deletePaymentVoucher = createAsyncThunk(
  'paymentVoucher/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/payment-voucher/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePaymentVoucher = createAsyncThunk(
  'paymentVoucher/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/payment-voucher/bulk-delete', {
        id: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCustomerLedgerInvoices = createAsyncThunk(
  'paymentVoucher/paymentVoucherDetails',
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
  paymentVoucherDetails: [],
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

export const paymentVoucherSlice = createSlice({
  name: 'paymentVoucher',
  initialState,
  reducers: {
    setPaymentVoucherListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setPaymentVoucherDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetPaymentVoucherForm: (state) => {
      state.initialFormValues = null;
      state.paymentVoucherDetails = [];
    },

    setFormField: (state, action) => {
      const { field, value } = action.payload;
      if (state.initialFormValues) {
        state.initialFormValues[field] = value;
      }
    },

    changePaymentVoucherDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.paymentVoucherDetails[from];
      state.paymentVoucherDetails[from] = state.paymentVoucherDetails[to];
      state.paymentVoucherDetails[to] = temp;
    },

    addPaymentVoucherDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        document_no: null,
        account_id: null,
        cheque_date: null,
        cheque_no: null,
        payment_amount: 0,
        net_amount: 0,
        sort_order: state.paymentVoucherDetails.length + 1,
        row_status: 'I',
        isDeleted: false
      };

      if (index || index === 0) {
        state.paymentVoucherDetails.splice(index + 1, 0, newDetail);
      } else {
        state.paymentVoucherDetails.push(newDetail);
      }

      state.paymentVoucherDetails = state.paymentVoucherDetails.map((item, i) => ({
        ...item,
        sort_order: i + 1,
      }));
    },

    removePaymentVoucherDetail: (state, action) => {
      const itemIndex = state.paymentVoucherDetails.findIndex(
        (item) => item.id === action.payload
      );

      if (itemIndex !== -1) {
        if (state.paymentVoucherDetails[itemIndex].row_status === 'I') {
          state.paymentVoucherDetails = state.paymentVoucherDetails.filter(
            (item) => item.id !== action.payload
          );
        } else {
          state.paymentVoucherDetails[itemIndex].row_status = 'D';
          state.paymentVoucherDetails[itemIndex].isDeleted = true;
        }
      }
    },

    copyPaymentVoucherDetail: (state, action) => {
      const index = action.payload;

      if (index >= 0 && index < state.paymentVoucherDetails.length) {
        const { editable, ...detail } = state.paymentVoucherDetails[index];

        const newDetail = {
          ...detail,
          account_id:
            detail.account_id && typeof detail.account_id === "object"
              ? detail.account_id
              : detail.account_id
                ? { value: detail.account_id, label: "" }
                : null,
          id: uuidv4(),
          payment_voucher_id: null,
          payment_voucher_detail_id: null,
          sort_order: state.paymentVoucherDetails.length + 1,
          row_status: 'I',
          isDeleted: false,
        };

        state.paymentVoucherDetails.splice(index + 1, 0, newDetail);
      }
    },

    updatePaymentVoucherDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const index = state.paymentVoucherDetails.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.paymentVoucherDetails[index] = {
          ...state.paymentVoucherDetails[index],
          [field]: value,
        };
      }
    },

  },
  extraReducers: ({ addCase }) => {
    addCase(getPaymentVoucherList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getPaymentVoucherList.fulfilled, (state, action) => {
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
    addCase(getPaymentVoucherList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createPaymentVoucher.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createPaymentVoucher.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createPaymentVoucher.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeletePaymentVoucher.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePaymentVoucher.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePaymentVoucher.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getPaymentVoucher.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getPaymentVoucher.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        ...data,
        document_date: data?.document_date ? dayjs(data?.document_date) : null,
        document_identity: data?.document_identity ? data?.document_identity : null,
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
      state.paymentVoucherDetails = data?.details.map((detail) => ({
        id: detail?.payment_voucher_id ? detail?.payment_voucher_id : null,
        payment_voucher_id: detail?.payment_voucher_id ? detail?.payment_voucher_id : null,
        payment_voucher_detail_id: detail?.payment_voucher_detail_id ? detail?.payment_voucher_detail_id : null,
        sort_order: detail?.sort_order ? detail?.sort_order : null,
        account_id: detail?.account
          ? {
            value: detail?.account?.account_id,
            label: detail?.account?.name
          }
          : null,
        cheque_date: detail?.cheque_date ? dayjs(detail?.cheque_date) : null,
        cheque_no: detail?.cheque_no ? detail?.cheque_no : null,
        payment_amount: detail?.payment_amount ? detail?.payment_amount : null,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getPaymentVoucher.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.paymentVoucherDetails = []
    });

    addCase(getCustomerLedgerInvoices.pending, (state) => {
      state.isLedgerLoading = true;
      state.paymentVoucherDetails = [];
    });
    addCase(getCustomerLedgerInvoices.fulfilled, (state, action) => {
      state.isLedgerLoading = false;
      state.paymentVoucherDetails = action.payload;
    });
    addCase(getCustomerLedgerInvoices.rejected, (state) => {
      state.isLedgerLoading = false;
    });
  }
});

export const { setPaymentVoucherListParams, setPaymentVoucherDeleteIDs, setFormField, resetPaymentVoucherForm, changePaymentVoucherDetailOrder, addPaymentVoucherDetail, updatePaymentVoucherDetail, copyPaymentVoucherDetail, removePaymentVoucherDetail } = paymentVoucherSlice.actions;
export default paymentVoucherSlice.reducer;
