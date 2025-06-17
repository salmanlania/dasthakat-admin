import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCommissionAgentList = createAsyncThunk(
  'commission-agent/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/commission-agent', {
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

export const deleteCommissionAgent = createAsyncThunk(
  'commission-agent/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/commission-agent/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCommissionAgent = createAsyncThunk(
  'commission-agent/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/commission-agent', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCommissionAgent = createAsyncThunk(
  'commission-agent/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/commission-agent/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCommissionAgent = createAsyncThunk(
  'commission-agent/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/commission-agent/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCommissionAgent = createAsyncThunk(
  'commission-agent/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/commission-agent/bulk-delete', {
        commission_agent_ids: ids
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

export const commissionAgentSlice = createSlice({
  name: 'commissionAgent',
  initialState,
  reducers: {
    setCommissionAgentListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCommissionAgentDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getCommissionAgentList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCommissionAgentList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCommissionAgentList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCommissionAgent.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCommissionAgent.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCommissionAgent.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getCommissionAgent.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCommissionAgent.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {}; // TODO:Define form values here from api payload
    });
    addCase(getCommissionAgent.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateCommissionAgent.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateCommissionAgent.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateCommissionAgent.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteCommissionAgent.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCommissionAgent.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCommissionAgent.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setCommissionAgentListParams, setCommissionAgentDeleteIDs } =
  commissionAgentSlice.actions;
export default commissionAgentSlice.reducer;
