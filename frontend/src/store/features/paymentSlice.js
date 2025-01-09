import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getPaymentList = createAsyncThunk(
  'payment/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/payment', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deletePayment = createAsyncThunk('payment/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/payment/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createPayment = createAsyncThunk(
  'payment/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/payment', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/payment/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePayment = createAsyncThunk(
  'payment/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/payment/bulk-delete', {
        payment_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isSubmitting: false,
  isBulkDeleting: false,
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

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setPaymentDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewPayment: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.payment_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        payment_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewPayment: (state) => {
      state.list = state.list.filter((item) => item.payment_id !== 'new');
    },

    setPaymentEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with payment_id as "new"
      state.list = state.list.filter((item) => item.payment_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.payment_id === id) {
          return item.editable
            ? {
                ...item.prevRecord,
                editable: false
              }
            : {
                ...item,
                editable: true,
                prevRecord: { ...item }
              };
        }

        // If any other item is editable, reset it
        return item.editable
          ? { ...item.prevRecord, editable: false }
          : { ...item, editable: false };
      });
    },

    updatePaymentListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.payment_id === id) {
          return {
            ...item,
            [field]: value
          };
        }
        return item;
      });
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getPaymentList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getPaymentList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getPaymentList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createPayment.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createPayment.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createPayment.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.payment_id !== 'new');
    });

    addCase(updatePayment.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updatePayment.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updatePayment.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeletePayment.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePayment.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePayment.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setPaymentListParams,
  setPaymentDeleteIDs,
  addNewPayment,
  removeNewPayment,
  setPaymentEditable,
  updatePaymentListValue
} = paymentSlice.actions;
export default paymentSlice.reducer;
