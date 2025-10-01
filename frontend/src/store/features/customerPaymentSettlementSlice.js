import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export const getCustomerPaymentSettlementList = createAsyncThunk(
  'customerPaymentSettlement/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/customer-payment-settlement', {
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

export const getCustomerPaymentSettlement = createAsyncThunk(
  'customerPaymentSettlement/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customer-payment-settlement/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCustomerPaymentSettlementForm = createAsyncThunk(
  'customerPaymentSettlement/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/customer-payment-settlement/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCustomerPaymentSettlement = createAsyncThunk(
  'customerPaymentSettlement/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/customer-payment-settlement', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCustomerPaymentSettlement = createAsyncThunk(
  'customerPaymentSettlement/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/customer-payment-settlement/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCustomerPaymentSettlement = createAsyncThunk(
  'customerPaymentSettlement/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/customer-payment-settlement/bulk-delete', {
        id: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCustomerPayments = createAsyncThunk(
  'customerPaymentSettlement/customerPaymentSettlementDetails',
  async (customerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customer/${customerId}/payments`);
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
  customerPaymentSettlementDetails: [],
  customerPaymentSettlementPayments: [],
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

export const customerPaymentSettlementSlice = createSlice({
  name: 'customerPaymentSettlement',
  initialState,
  reducers: {
    setCustomerPaymentSettlementListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCustomerPaymentSettlementDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetCustomerPaymentSettlementForm: (state) => {
      state.initialFormValues = null;
      state.customerPaymentSettlementDetails = [];
      state.customerPaymentSettlementPayments = [];
    },

    setFormField: (state, action) => {
      const { field, value } = action.payload;
      if (state.initialFormValues) {
        state.initialFormValues[field] = value;
      }
    },

    changeCustomerPaymentSettlementDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.customerPaymentSettlementDetails[from];
      state.customerPaymentSettlementDetails[from] = state.customerPaymentSettlementDetails[to];
      state.customerPaymentSettlementDetails[to] = temp;
    },

    addCustomerPaymentSettlementDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        document_no: null,
        account_id: null,
        cheque_date: null,
        ledger_date: null,
        cheque_no: null,
        event_no: null,
        event_id: null,
        cost_center_id: null,
        amount: 0,
        net_amount: 0,
        sort_order: state.customerPaymentSettlementDetails.length + 1,
        row_status: 'I',
        isDeleted: false
      };

      if (index || index === 0) {
        state.customerPaymentSettlementDetails.splice(index + 1, 0, newDetail);
      } else {
        state.customerPaymentSettlementDetails.push(newDetail);
      }

      state.customerPaymentSettlementDetails = state.customerPaymentSettlementDetails.map((item, i) => ({
        ...item,
        sort_order: i + 1,
      }));
    },

    removeCustomerPaymentSettlementDetail: (state, action) => {
      const itemIndex = state.customerPaymentSettlementDetails.findIndex(
        (item) => item.id === action.payload
      );

      if (itemIndex !== -1) {
        if (state.customerPaymentSettlementDetails[itemIndex].row_status === 'I') {
          state.customerPaymentSettlementDetails = state.customerPaymentSettlementDetails.filter(
            (item) => item.id !== action.payload
          );
        } else {
          state.customerPaymentSettlementDetails[itemIndex].row_status = 'D';
          state.customerPaymentSettlementDetails[itemIndex].isDeleted = true;
        }
      }
    },

    copyCustomerPaymentSettlementDetail: (state, action) => {
      const index = action.payload;

      if (index >= 0 && index < state.customerPaymentSettlementDetails.length) {
        const { editable, ...detail } = state.customerPaymentSettlementDetails[index];

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
          sort_order: state.customerPaymentSettlementDetails.length + 1,
          row_status: 'I',
          isDeleted: false,
        };

        state.customerPaymentSettlementDetails.splice(index + 1, 0, newDetail);
      }
    },

    // updateCustomerPaymentSettlementDetail: (state, action) => {
    //   const { id, field, value } = action.payload;
    //   const index = state.customerPaymentSettlementDetails.findIndex((d) => d.id === id);
    //   if (index !== -1) {
    //     state.customerPaymentSettlementDetails[index] = {
    //       ...state.customerPaymentSettlementDetails[index],
    //       [field]: value,
    //     };
    //   }
    // },

    updateCustomerPaymentSettlementDetail: (state, action) => {
      const { id, field, value } = action.payload;

      let index = state.customerPaymentSettlementDetails.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.customerPaymentSettlementDetails[index] = {
          ...state.customerPaymentSettlementDetails[index],
          [field]: value,
        };
        return;
      }

      index = state.customerPaymentSettlementPayments.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.customerPaymentSettlementPayments[index] = {
          ...state.customerPaymentSettlementPayments[index],
          [field]: value,
        };
      }
    },

  },
  extraReducers: ({ addCase }) => {
    addCase(getCustomerPaymentSettlementList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCustomerPaymentSettlementList.fulfilled, (state, action) => {
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
    addCase(getCustomerPaymentSettlementList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCustomerPaymentSettlement.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCustomerPaymentSettlement.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCustomerPaymentSettlement.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteCustomerPaymentSettlement.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCustomerPaymentSettlement.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCustomerPaymentSettlement.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getCustomerPaymentSettlement.pending, (state) => {
      state.isItemLoading = true;
      state.initialFormValues = null;
      state.customerPaymentSettlementDetails = [];
      state.customerPaymentSettlementPayments = [];
    });
    addCase(getCustomerPaymentSettlement.fulfilled, (state, action) => {
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
        customer_id: data?.customer
          ? {
            value: data?.customer?.customer_id,
            label: data?.customer?.name
          }
          : null,
        customerId: data?.customer_id ? data?.customer_id : data?.customer ? data?.customer?.customer_id : null,
        customer_payment_account_id: data?.customer_payment ? data?.customer_payment?.transaction_account_id : null, 
        customer_payment_id: data?.customer_payment
          ? {
            value: data?.customer_payment?.customer_payment_id,
            label: data?.customer_payment?.document_identity
          }
          : null,
        total_amount: data?.total_amount ? parseInt(data?.total_amount) : null,
        remarks: data?.remarks ? data?.remarks : null,
        total_amount: data?.total_amount ? parseInt(data?.total_amount) : null,
      };
      state.customerPaymentSettlementDetails = data?.details.map((detail) => ({
        id: detail?.customer_payment_settlement_detail_id ? detail?.customer_payment_settlement_detail_id : null,
        customer_payment_id: detail?.customer_payment_id ? detail?.customer_payment_id : null,
        customer_payment_settlement_detail_id: detail?.customer_payment_settlement_detail_id ? detail?.customer_payment_settlement_detail_id : null,
        payment_voucher_id: detail?.payment_voucher_id ? detail?.payment_voucher_id : null,
        payment_voucher_detail_id: detail?.payment_voucher_detail_id ? detail?.payment_voucher_detail_id : null,
        sort_order: detail?.sort_order ? detail?.sort_order : null,
        account_id: detail?.account
          ? {
            value: detail?.account?.account_id,
            label: detail?.account?.name
          }
          : null,
        cost_center_id: detail?.cost_center
          ? {
            value: detail?.cost_center?.cost_center_id,
            label: detail?.cost_center?.name
          }
          : null,
        event_id: detail?.event
          ? {
            value: detail?.event?.event_id,
            label: detail?.event?.event_name
          }
          : null,
        cheque_date: detail?.cheque_date ? dayjs(detail?.cheque_date) : null,
        ledger_date: detail?.ledger_date ? dayjs(detail?.ledger_date) : null,
        cheque_no: detail?.cheque_no ? detail?.cheque_no : null,
        amount: detail?.amount ? detail?.amount : null,
        remarks: detail?.remarks ? detail?.remarks : null,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getCustomerPaymentSettlement.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.customerPaymentSettlementDetails = []
    });

    addCase(getCustomerPayments.pending, (state) => {
      state.isLedgerLoading = true;
      state.customerPaymentSettlementDetails = [];
    });
    addCase(getCustomerPayments.fulfilled, (state, action) => {
      state.isLedgerLoading = false;
      const data = action.payload
      state.customerPaymentSettlementPayments = data?.map((detail) => ({
        customer_payment_id: detail?.customer_payment_id ? detail?.customer_payment_id : null,
        id: detail?.customer_payment_id ? detail?.customer_payment_id : null,
        account_id: detail?.transaction_account
          ? {
            value: detail?.transaction_account_id,
            label: detail?.transaction_account
          }
          : null,
        amount: detail?.balance_amount ? detail?.balance_amount : null,
        disabled: true,
        remarks: detail?.remarks || "",
        cheque_no: detail?.cheque_no || "",
        cheque_date: detail?.cheque_date ? dayjs(detail?.cheque_date) : null,
        isDeleted: false,
        row_status: "I"
      }))
    });
    addCase(getCustomerPayments.rejected, (state) => {
      state.isLedgerLoading = false;
    });
  }
});

export const { setCustomerPaymentSettlementListParams, setCustomerPaymentSettlementDeleteIDs, setFormField, resetCustomerPaymentSettlementForm, changeCustomerPaymentSettlementDetailOrder, addCustomerPaymentSettlementDetail, updateCustomerPaymentSettlementDetail, copyCustomerPaymentSettlementDetail, removeCustomerPaymentSettlementDetail } = customerPaymentSettlementSlice.actions;
export default customerPaymentSettlementSlice.reducer;