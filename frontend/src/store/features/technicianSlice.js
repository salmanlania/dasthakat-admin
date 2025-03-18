import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getTechnicianList = createAsyncThunk(
  'technician/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/technician', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteTechnician = createAsyncThunk(
  'technician/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/technician/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createTechnician = createAsyncThunk(
  'technician/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/technician', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateTechnician = createAsyncThunk(
  'technician/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/technician/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteTechnician = createAsyncThunk(
  'technician/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/technician/bulk-delete', {
        technician_ids: ids
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

export const technicianSlice = createSlice({
  name: 'technician',
  initialState,
  reducers: {
    setTechnicianListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setTechnicianDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewTechnician: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.technician_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        technician_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewTechnician: (state) => {
      state.list = state.list.filter((item) => item.technician_id !== 'new');
    },

    setTechnicianEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with technician_id as "new"
      state.list = state.list.filter((item) => item.technician_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.technician_id === id) {
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

    updateTechnicianListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.technician_id === id) {
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
    addCase(getTechnicianList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getTechnicianList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getTechnicianList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createTechnician.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createTechnician.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createTechnician.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.technician_id !== 'new');
    });

    addCase(updateTechnician.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateTechnician.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateTechnician.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteTechnician.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteTechnician.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteTechnician.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setTechnicianListParams,
  setTechnicianDeleteIDs,
  addNewTechnician,
  removeNewTechnician,
  setTechnicianEditable,
  updateTechnicianListValue
} = technicianSlice.actions;
export default technicianSlice.reducer;
