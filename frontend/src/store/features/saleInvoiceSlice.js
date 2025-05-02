import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getSaleInvoiceList = createAsyncThunk('saleInvoice/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/sale-invoice', {
      params: {
        ...params,
        all: 1
      }
    });
    return res.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getSaleInvoice = createAsyncThunk('saleInvoice/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/sale-invoice/${id}`);
    console.log('res' , res.data.data)
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createSaleInvoice = createAsyncThunk('saleInvoice/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/sale-invoice', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  isBulkDeleting: false,
  initialFormValues: null,
  isItemLoading: false,
  list: [],
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

export const saleInvoiceSlice = createSlice({
  name: 'saleInvoice',
  initialState,
  reducers: {
    setSaleInvoiceListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setSaleInvoiceDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getSaleInvoiceList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getSaleInvoiceList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getSaleInvoiceList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createSaleInvoice.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createSaleInvoice.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createSaleInvoice.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getSaleInvoice.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getSaleInvoice.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload
      state.initialFormValues = {
        document_identity: data.document_identity || '',
        document_date: data.document_date || '',
      };
    });
    addCase(getSaleInvoice.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });
  }
});

export const { setSaleInvoiceListParams, setSaleInvoiceDeleteIDs } = saleInvoiceSlice.actions;
export default saleInvoiceSlice.reducer;