import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getIJOList = createAsyncThunk(
  'job-order/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/job-order', {
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

export const deleteIJO = createAsyncThunk('job-order/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/job-order/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createIJO = createAsyncThunk('job-order/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/job-order', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getIJO = createAsyncThunk('job-order/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/job-order/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getEventChargeOrders = createAsyncThunk(
  'event-charge-orders/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/event/${id}/charge-orders`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateIJO = createAsyncThunk(
  'job-order/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/job-order/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteIJO = createAsyncThunk(
  'job-order/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/job-order/bulk-delete', {
        job_order_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

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
    sort_direction: null,
    name: null,
    description: null,
    catering_type: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const ijoSlice = createSlice({
  name: 'ijo',
  initialState,
  reducers: {
    setIJOListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setIJODeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getIJOList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getIJOList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getIJOList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createIJO.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createIJO.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createIJO.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getIJO.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getIJO.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

      state.initialFormValues = {
        name: data.name,
        ijo_code: data.ijo_code,
        salesman_id: data.salesman_id
          ? {
              value: data.salesman_id,
              label: data.salesman_name
            }
          : null,
        payment_id: data.payment_id
          ? {
              value: data.payment_id,
              label: data.name
            }
          : null,
        vessel_id: data.vessel
          ? data.vessel.map((v) => ({ value: v.vessel_id, label: v.name }))
          : null,
        country: data.country,
        address: data.address,
        billing_address: data.billing_address,
        phone_no: data.phone_no,
        email_sales: data.email_sales,
        email_accounting: data.email_accounting,
        rebate_percent: data.rebate_percent,
        status: data.status
      };
    });
    addCase(getIJO.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateIJO.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateIJO.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateIJO.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteIJO.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteIJO.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteIJO.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setIJOListParams, setIJODeleteIDs } = ijoSlice.actions;
export default ijoSlice.reducer;
