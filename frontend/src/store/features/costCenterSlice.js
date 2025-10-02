import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCostCenterList = createAsyncThunk('cost-center/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/cost-center', {
      params
    });
    return res.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const deleteCostCenter = createAsyncThunk('costCenter/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/cost-center/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createCostCenter = createAsyncThunk('costCenter/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/cost-center', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateCostCenter = createAsyncThunk(
  'costCenter/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/cost-center/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCostCenter = createAsyncThunk(
  'costCenter/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/cost-center/bulk-delete', {
        cost_center_ids: ids
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

export const costCenterSlice = createSlice({
  name: 'costCenter',
  initialState,
  reducers: {
    setCostCenterListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCostCenterDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewCostCenter: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.cost_center_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        cost_center_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewCostCenter: (state) => {
      state.list = state.list.filter((item) => item.cost_center_id !== 'new');
    },

    setCostCenterEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with cost_center_id as "new"
      state.list = state.list.filter((item) => item.cost_center_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.cost_center_id === id) {
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

    updateCostCenterListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.cost_center_id === id) {
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
    addCase(getCostCenterList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getCostCenterList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCostCenterList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCostCenter.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createCostCenter.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createCostCenter.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.cost_center_id !== 'new');
    });

    addCase(updateCostCenter.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateCostCenter.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateCostCenter.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteCostCenter.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCostCenter.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCostCenter.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setCostCenterListParams,
  setCostCenterDeleteIDs,
  addNewCostCenter,
  removeNewCostCenter,
  setCostCenterEditable,
  updateCostCenterListValue
} = costCenterSlice.actions;
export default costCenterSlice.reducer;
