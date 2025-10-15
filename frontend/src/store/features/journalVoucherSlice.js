import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export const getJournalVoucherList = createAsyncThunk(
  'journalVoucher/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/journal-voucher', {
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

export const getJournalVoucher = createAsyncThunk(
  'journalVoucher/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/journal-voucher/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateJournalVoucherForm = createAsyncThunk(
  'journalVoucher/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/journal-voucher/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createJournalVoucher = createAsyncThunk(
  'journalVoucher/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/journal-voucher', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createJournalVoucherSettlement = createAsyncThunk(
  'journalVoucherSettlement/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/journal-voucher-tagging', payload);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteJournalVoucher = createAsyncThunk(
  'journalVoucher/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/journal-voucher/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteJournalVoucher = createAsyncThunk(
  'journalVoucher/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/journal-voucher/bulk-delete', {
        id: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCustomerLedgerInvoices = createAsyncThunk(
  'journalVoucher/journalVoucherDetails',
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
  'journalVoucher/getUnsettledInvoices',
  async ({ supplierId, journalVoucherId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/supplier/${supplierId}/unsettled-invoices`, {
        params: {
          journal_voucher_id: journalVoucherId
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
  journalVoucherDetails: [],
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

export const journalVoucherSlice = createSlice({
  name: 'journalVoucher',
  initialState,
  reducers: {
    setJournalVoucherListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setJournalVoucherDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetJournalVoucherForm: (state) => {
      state.initialFormValues = null;
      state.journalVoucherDetails = [];
    },

    resetJournalVoucherSettlementForm: (state) => {
      state.initialFormValues = null;
      state.vendorPaymentSettlementDetails = [];
    },

    setFormField: (state, action) => {
      const { field, value } = action.payload;
      if (state.initialFormValues) {
        state.initialFormValues[field] = value;
      }
    },

    changeJournalVoucherDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.journalVoucherDetails[from];
      state.journalVoucherDetails[from] = state.journalVoucherDetails[to];
      state.journalVoucherDetails[to] = temp;
    },

    changeVendorSettlementDetail: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.vendorPaymentSettlementDetails[from];
      state.vendorPaymentSettlementDetails[from] = state.vendorPaymentSettlementDetails[to];
      state.vendorPaymentSettlementDetails[to] = temp;
    },

    addJournalVoucherDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        document_no: null,
        account_id: null,
        net_amount: 0,
        sort_order: state.journalVoucherDetails.length + 1,
        row_status: 'I',
        isDeleted: false
      };

      if (index || index === 0) {
        state.journalVoucherDetails.splice(index + 1, 0, newDetail);
      } else {
        state.journalVoucherDetails.push(newDetail);
      }

      state.journalVoucherDetails = state.journalVoucherDetails.map((item, i) => ({
        ...item,
        sort_order: i + 1,
      }));
    },

    addVendorSettlementDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        document_no: null,
        account_id: null,
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

    removeJournalVoucherDetail: (state, action) => {
      const itemIndex = state.journalVoucherDetails.findIndex(
        (item) => item.id === action.payload
      );

      if (itemIndex !== -1) {
        if (state.journalVoucherDetails[itemIndex].row_status === 'I') {
          state.journalVoucherDetails = state.journalVoucherDetails.filter(
            (item) => item.id !== action.payload
          );
        } else {
          state.journalVoucherDetails[itemIndex].row_status = 'D';
          state.journalVoucherDetails[itemIndex].isDeleted = true;
        }
      }
    },

    copyJournalVoucherDetail: (state, action) => {
      const index = action.payload;

      if (index >= 0 && index < state.journalVoucherDetails.length) {
        const { editable, ...detail } = state.journalVoucherDetails[index];

        const newDetail = {
          ...detail,
          account_id:
            detail.account_id && typeof detail.account_id === "object"
              ? detail.account_id
              : detail.account_id
                ? { value: detail.account_id, label: "" }
                : null,
          id: uuidv4(),
          journal_voucher_id: null,
          journal_voucher_detail_id: null,
          sort_order: state.journalVoucherDetails.length + 1,
          row_status: 'I',
          isDeleted: false,
        };

        state.journalVoucherDetails.splice(index + 1, 0, newDetail);
      }
    },

    updateJournalVoucherDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const index = state.journalVoucherDetails.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.journalVoucherDetails[index] = {
          ...state.journalVoucherDetails[index],
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
    addCase(getJournalVoucherList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getJournalVoucherList.fulfilled, (state, action) => {
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
    addCase(getJournalVoucherList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createJournalVoucher.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createJournalVoucher.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createJournalVoucher.rejected, (state) => {
      state.isFormSubmitting = false;
    });


    addCase(createJournalVoucherSettlement.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createJournalVoucherSettlement.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createJournalVoucherSettlement.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteJournalVoucher.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteJournalVoucher.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteJournalVoucher.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getJournalVoucher.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getJournalVoucher.fulfilled, (state, action) => {
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
      };
      state.journalVoucherDetails = data?.details.map((detail) => ({
        ...detail,
        id: detail?.journal_voucher_detail_id ? detail?.journal_voucher_detail_id : null,
        journal_voucher_id: detail?.journal_voucher_id ? detail?.journal_voucher_id : null,
        journal_voucher_detail_id: detail?.journal_voucher_detail_id ? detail?.journal_voucher_detail_id : null,
        sort_order: detail?.sort_order ? detail?.sort_order : null,
        account_id: detail?.account
          ? {
            value: detail?.account?.account_id,
            label: detail?.account?.name
          }
          : null,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getJournalVoucher.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.journalVoucherDetails = []
    });

    addCase(getCustomerLedgerInvoices.pending, (state) => {
      state.isLedgerLoading = true;
      state.journalVoucherDetails = [];
    });
    addCase(getCustomerLedgerInvoices.fulfilled, (state, action) => {
      state.isLedgerLoading = false;
      state.journalVoucherDetails = action.payload;
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

export const { setJournalVoucherListParams, setJournalVoucherDeleteIDs, setFormField, resetJournalVoucherForm, resetJournalVoucherSettlementForm, changeJournalVoucherDetailOrder, addJournalVoucherDetail,
  addVendorSettlementDetail, updateJournalVoucherDetail, updateVendorSettlementDetail, copyJournalVoucherDetail, removeJournalVoucherDetail, changeVendorSettlementDetail } = journalVoucherSlice.actions;
export default journalVoucherSlice.reducer;
