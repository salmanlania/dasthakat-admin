import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getAgentList = createAsyncThunk(
  "agent/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/agent", {
        params,
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
  isSubmitting: false,
  isBulkDeleting: false,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  params: {
    page: 1,
    limit: 50,
    search: "",
    sort_column: null,
    sort_direction: null,
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

    addNewAgent: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.agent_id === "new");
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false,
        };
      });

      state.list.unshift({
        agent_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewAgent: (state) => {
      state.list = state.list.filter((item) => item.agent_id !== "new");
    },

    setAgentEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === "new") {
        state.list = state.list.map((item) => ({
          ...item,
          editable,
        }));
        return;
      }

      // Filter out items with agent_id as "new"
      state.list = state.list.filter((item) => item.agent_id !== "new");

      // Update the list
      state.list = state.list.map((item) => {
        if (item.agent_id === id) {
          return item.editable
            ? {
                ...item.prevRecord,
                editable: false,
              }
            : {
                ...item,
                editable: true,
                prevRecord: { ...item },
              };
        }

        // If any other item is editable, reset it
        return item.editable
          ? { ...item.prevRecord, editable: false }
          : { ...item, editable: false };
      });
    },

    updateAgentListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.agent_id === id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getAgentList.pending, (state) => {
      state.isListLoading = true;
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
      state.isSubmitting = "new";
    });
    addCase(createAgent.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createAgent.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.agent_id !== "new");
    });

    addCase(updateAgent.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateAgent.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateAgent.rejected, (state) => {
      state.isSubmitting = false;
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

export const {
  setAgentListParams,
  setAgentDeleteIDs,
  addNewAgent,
  removeNewAgent,
  setAgentEditable,
  updateAgentListValue,
} = agentSlice.actions;
export default agentSlice.reducer;
