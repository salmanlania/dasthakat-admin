import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCustomerList = createAsyncThunk(
  'customer/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/customer', {
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

export const deleteCustomer = createAsyncThunk(
  'customer/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/customer/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customer/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/customer', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCustomer = createAsyncThunk('customer/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/customer/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateCustomer = createAsyncThunk(
  'customer/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/customer/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCustomer = createAsyncThunk(
  'customer/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/customer/bulk-delete', {
        customer_ids: ids
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

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCustomerDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getCustomerList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCustomerList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCustomerList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCustomer.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCustomer.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCustomer.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getCustomer.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCustomer.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        name: data.name,
        customer_code: data.customer_code,
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
        status: data.status,
        block_status: data.block_status
      };
    });
    addCase(getCustomer.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateCustomer.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateCustomer.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateCustomer.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteCustomer.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCustomer.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCustomer.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setCustomerListParams, setCustomerDeleteIDs } = customerSlice.actions;
export default customerSlice.reducer;
