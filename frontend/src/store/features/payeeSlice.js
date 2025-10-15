import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getPayeeList = createAsyncThunk('payee/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/payee', {
      params
    });
    return res.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const deletePayee = createAsyncThunk('payee/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/payee/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createPayee = createAsyncThunk('payee/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/payee', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updatePayee = createAsyncThunk(
  'payee/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/payee/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePayee = createAsyncThunk(
  'payee/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/payee/bulk-delete', {
        id: ids
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

export const payeeSlice = createSlice({
  name: 'payee',
  initialState,
  reducers: {
    setPayeeListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setPayeeDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewPayee: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.payee_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        payee_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewPayee: (state) => {
      state.list = state.list.filter((item) => item.payee_id !== 'new');
    },

    setPayeeEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with payee_id as "new"
      state.list = state.list.filter((item) => item.payee_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.payee_id === id) {
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

    updatePayeeListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.payee_id === id) {
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
    addCase(getPayeeList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getPayeeList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getPayeeList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createPayee.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createPayee.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createPayee.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.payee_id !== 'new');
    });

    addCase(updatePayee.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updatePayee.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updatePayee.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeletePayee.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePayee.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePayee.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setPayeeListParams,
  setPayeeDeleteIDs,
  addNewPayee,
  removeNewPayee,
  setPayeeEditable,
  updatePayeeListValue
} = payeeSlice.actions;
export default payeeSlice.reducer;