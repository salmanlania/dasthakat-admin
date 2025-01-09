import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getUnitList = createAsyncThunk('unit/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/unit', {
      params
    });
    return res.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const deleteUnit = createAsyncThunk('unit/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/unit/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createUnit = createAsyncThunk('unit/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/unit', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateUnit = createAsyncThunk(
  'unit/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/unit/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteUnit = createAsyncThunk(
  'unit/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/unit/bulk-delete', {
        unit_ids: ids
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

export const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {
    setUnitListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setUnitDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewUnit: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.unit_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        unit_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewUnit: (state) => {
      state.list = state.list.filter((item) => item.unit_id !== 'new');
    },

    setUnitEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with unit_id as "new"
      state.list = state.list.filter((item) => item.unit_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.unit_id === id) {
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

    updateUnitListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.unit_id === id) {
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
    addCase(getUnitList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getUnitList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getUnitList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createUnit.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createUnit.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createUnit.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.unit_id !== 'new');
    });

    addCase(updateUnit.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateUnit.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateUnit.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteUnit.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteUnit.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteUnit.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setUnitListParams,
  setUnitDeleteIDs,
  addNewUnit,
  removeNewUnit,
  setUnitEditable,
  updateUnitListValue
} = unitSlice.actions;
export default unitSlice.reducer;
