import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getAgentList = createAsyncThunk(
  "agent/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/agent", {
        params: {
          ...params,
          all: 1,
        },
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteAgent = createAsyncThunk(
  "agent/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/agent/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createAgent = createAsyncThunk(
  "agent/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/agent", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getAgent = createAsyncThunk(
  "agent/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/agent/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateAgent = createAsyncThunk(
  "agent/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/agent/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteAgent = createAsyncThunk(
  "agent/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/agent/bulk-delete", {
        agent_ids: ids,
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
    search: "",
    sort_column: null,
    sort_direction: null,
    name: null,
    description: null,
    catering_type: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setAgentListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setAgentDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getAgentList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getAgentList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getAgentList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createAgent.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createAgent.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createAgent.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getAgent.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getAgent.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        agent_code: data.agent_code,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        phone: data.phone,
        fax: data.fax,
        email: data.email,
      };
    });
    addCase(getAgent.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateAgent.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateAgent.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateAgent.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteAgent.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteAgent.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteAgent.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const { setAgentListParams, setAgentDeleteIDs } = agentSlice.actions;
export default agentSlice.reducer;
