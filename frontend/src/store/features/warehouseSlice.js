import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getWarehouseList = createAsyncThunk(
  'warehouse/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/warehouse', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteWarehouse = createAsyncThunk(
  'warehouse/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/warehouse/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createWarehouse = createAsyncThunk(
  'warehouse/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/warehouse', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateWarehouse = createAsyncThunk(
  'warehouse/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/warehouse/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteWarehouse = createAsyncThunk(
  'warehouse/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/warehouse/bulk-delete', {
        warehouse_ids: ids
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

export const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    setWarehouseListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setWarehouseDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewWarehouse: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.warehouse_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        warehouse_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewWarehouse: (state) => {
      state.list = state.list.filter((item) => item.warehouse_id !== 'new');
    },

    setWarehouseEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with warehouse_id as "new"
      state.list = state.list.filter((item) => item.warehouse_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.warehouse_id === id) {
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

    updateWarehouseListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.warehouse_id === id) {
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
    addCase(getWarehouseList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getWarehouseList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getWarehouseList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createWarehouse.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createWarehouse.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createWarehouse.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.warehouse_id !== 'new');
    });

    addCase(updateWarehouse.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateWarehouse.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateWarehouse.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteWarehouse.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteWarehouse.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteWarehouse.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setWarehouseListParams,
  setWarehouseDeleteIDs,
  addNewWarehouse,
  removeNewWarehouse,
  setWarehouseEditable,
  updateWarehouseListValue
} = warehouseSlice.actions;
export default warehouseSlice.reducer;
