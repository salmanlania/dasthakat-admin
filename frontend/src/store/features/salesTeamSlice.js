import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getSalesTeamList = createAsyncThunk(
  'SalesTeam/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/sales-team', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getSalesTeam = createAsyncThunk('sales-team/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/sales-team/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const deleteSalesTeam = createAsyncThunk(
  'SalesTeam/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sales-team/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createSalesTeam = createAsyncThunk(
  'SalesTeam/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/sales-team', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateSalesTeam = createAsyncThunk(
  'SalesTeam/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/sales-team/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteSalesTeam = createAsyncThunk(
  'SalesTeam/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/sales-team/bulk-delete', {
        sales_team_ids: ids
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

export const SalesTeamSlice = createSlice({
  name: 'SalesTeam',
  initialState,
  reducers: {
    setSalesTeamListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setSalesTeamDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewSalesTeam: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.sales_team_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        sales_team_id: 'new',
        name: '',
        commission_percentage: '',
        editable: true,
        created_at: null
      });
    },

    removeNewSalesTeam: (state) => {
      state.list = state.list.filter((item) => item.sales_team_id !== 'new');
    },

    setSalesTeamEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with sales_team_id as "new"
      state.list = state.list.filter((item) => item.sales_team_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.sales_team_id === id) {
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

    updateSalesTeamListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.sales_team_id === id) {
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
    addCase(getSalesTeamList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getSalesTeamList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getSalesTeamList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createSalesTeam.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createSalesTeam.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createSalesTeam.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.sales_team_id !== 'new');
    });

    addCase(updateSalesTeam.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateSalesTeam.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateSalesTeam.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteSalesTeam.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteSalesTeam.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteSalesTeam.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setSalesTeamListParams,
  setSalesTeamDeleteIDs,
  addNewSalesTeam,
  removeNewSalesTeam,
  setSalesTeamEditable,
  updateSalesTeamListValue
} = SalesTeamSlice.actions;
export default SalesTeamSlice.reducer;
