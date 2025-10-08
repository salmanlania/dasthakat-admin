import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';

export const getCreditNoteList = createAsyncThunk(
  'creditNote/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/credit-note', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const creditNoteDelete = createAsyncThunk(
  'creditNote/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/credit-note/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const returnCreditNote = createAsyncThunk(
  'creditNote/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/credit-note', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCreditNote = createAsyncThunk(
  'credit-note/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/credit-note/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCreditNote = createAsyncThunk(
  'creditNote/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/credit-note/bulk-delete', {
        id: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCreditNote = createAsyncThunk(
  'creditNote/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/credit-note/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCreditNotePrint = createAsyncThunk(
  'creditNote/getPrint',
  async (id, { rejectWithValue }) => {

    try {
      const response = await api.get("credit-note/print/" + id);

      const byteCharacters = atob(response?.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCreditNote = createAsyncThunk(
  'createCreditNote/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/credit-note', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  pickListOpenModalId: null,
  initialFormValues: null,
  pickListDetail: [],
  creditNoteDetail: [],
  stockReturnDetail: [],
  purchaseReturnDetail: [],
  pickListReceives: null,
  isPickListReceivesLoading: false,
  isPickListReceivesSaving: false,
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

export const creditNoteListSlice = createSlice({
  name: 'creditNote',
  initialState,
  reducers: {
    setCreditNoteListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    clearCreditNoteList: (state) => {
      state.list = [];
    },

    setCreditNoteDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    setPickListOpenModalId: (state, action) => {
      state.pickListOpenModalId = action.payload;

      if (!action.payload) {
        state.pickListReceives = null;
      }
    },

    changeCreditNoteDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.creditNoteDetail[index];
      detail[key] = value;

      const productTypeId = detail.product_type_id.value;
      const productId = detail.charge_order_detail_id;

      if (key === 'quantity') {
        if (productTypeId === 2) {
          const stockDetail = state.stockReturnDetail?.stock_return?.stock_return_detail?.find(item => item?.charge_order_detail_id === productId);
          if (stockDetail) {
            stockDetail.quantity = value;
          }
        }

        if (productTypeId === 3 || productTypeId === 4) {
          const purchaseDetail = state.purchaseReturnDetail?.purchase_return?.purchase_return_detail?.find(item => item?.charge_order_detail_id === productId);
          if (purchaseDetail) {
            purchaseDetail.quantity = value;
          }
        }
      }
    },

  },
  extraReducers: ({ addCase }) => {
    addCase(getCreditNoteList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getCreditNoteList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCreditNoteList.rejected, (state) => {
      state.isListLoading = false;
    });

    // get credit note

    addCase(getCreditNote.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCreditNote.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        ...data,
        document_identity: data?.document_identity || '',
        status: data?.status || '',
        remarks: data?.remarks || '',
        document_date: data?.document_date ? dayjs(data.document_date) : null,
        credit_percent: data?.credit_percent ? data?.credit_percent : null,
        credit_amount: data?.credit_amount ? data?.credit_amount : null,
        credit_total_amount: data?.sale_invoice ? data?.sale_invoice?.total_amount : null,
        sale_invoice_id: data?.sale_invoice ?
          { value: data?.sale_invoice_id, label: data?.sale_invoice?.document_identity }
          : null,
        event_id: data?.event ?
          { value: data?.event_id, label: data?.event?.event_name }
          : null,
        saleInvoiceId: data?.sale_invoice_id ? data?.sale_invoice_id : null,
      };
      state.purchaseReturnDetail = data
      state.stockReturnDetail = data

    });
    addCase(getCreditNote.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateCreditNote.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(updateCreditNote.fulfilled, (state) => {
      state.initialFormValues = null;
    });
    addCase(updateCreditNote.rejected, (state) => {
      state.isItemLoading = false;
    });

    // start bulk delete

    addCase(bulkDeleteCreditNote.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCreditNote.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCreditNote.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

  }
});

export const { setCreditNoteListParams, setPickListOpenModalId, setCreditNoteDeleteIDs, changeCreditNoteDetailValue, clearCreditNoteList } = creditNoteListSlice.actions;
export default creditNoteListSlice.reducer;