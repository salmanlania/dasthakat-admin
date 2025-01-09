import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getValidityList = createAsyncThunk(
  'validity/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/validity', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteValidity = createAsyncThunk(
  'validity/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/validity/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createValidity = createAsyncThunk(
  'validity/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/validity', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateValidity = createAsyncThunk(
  'validity/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/validity/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteValidity = createAsyncThunk(
  'validity/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/validity/bulk-delete', {
        validity_ids: ids
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

export const validitySlice = createSlice({
  name: 'validity',
  initialState,
  reducers: {
    setValidityListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setValidityDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewValidity: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.validity_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        validity_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewValidity: (state) => {
      state.list = state.list.filter((item) => item.validity_id !== 'new');
    },

    setValidityEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with validity_id as "new"
      state.list = state.list.filter((item) => item.validity_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.validity_id === id) {
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

    updateValidityListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.validity_id === id) {
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
    addCase(getValidityList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getValidityList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getValidityList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createValidity.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createValidity.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createValidity.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.validity_id !== 'new');
    });

    addCase(updateValidity.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateValidity.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateValidity.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteValidity.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteValidity.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteValidity.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setValidityListParams,
  setValidityDeleteIDs,
  addNewValidity,
  removeNewValidity,
  setValidityEditable,
  updateValidityListValue
} = validitySlice.actions;
export default validitySlice.reducer;
