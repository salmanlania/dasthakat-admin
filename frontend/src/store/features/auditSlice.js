import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getAuditList = createAsyncThunk('audit/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/audit', {
      params
    });
    return res.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const deleteBrand = createAsyncThunk('brand/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/brand/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createBrand = createAsyncThunk('brand/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/brand', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateBrand = createAsyncThunk(
  'brand/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/brand/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteBrand = createAsyncThunk(
  'brand/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/brand/bulk-delete', {
        brand_ids: ids
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

export const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setBrandListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setBrandDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewBrand: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.brand_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        brand_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewBrand: (state) => {
      state.list = state.list.filter((item) => item.brand_id !== 'new');
    },

    setBrandEditable: (state, action) => {
      const { id, editable } = action.payload;

      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      state.list = state.list.filter((item) => item.brand_id !== 'new');

      state.list = state.list.map((item) => {
        if (item.brand_id === id) {
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

        return item.editable
          ? { ...item.prevRecord, editable: false }
          : { ...item, editable: false };
      });
    },

    updateBrandListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.brand_id === id) {
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
    addCase(getAuditList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getAuditList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getAuditList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createBrand.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createBrand.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createBrand.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.brand_id !== 'new');
    });

    addCase(updateBrand.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateBrand.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateBrand.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteBrand.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteBrand.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteBrand.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setBrandListParams,
  setBrandDeleteIDs,
  addNewBrand,
  removeNewBrand,
  setBrandEditable,
  updateBrandListValue
} = auditSlice.actions;
export default auditSlice.reducer;