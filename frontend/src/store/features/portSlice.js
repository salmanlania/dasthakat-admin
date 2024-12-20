import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getPortList = createAsyncThunk(
  "port/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/port", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deletePort = createAsyncThunk(
  "port/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/port/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createPort = createAsyncThunk(
  "port/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/port", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePort = createAsyncThunk(
  "port/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/port/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePort = createAsyncThunk(
  "port/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/port/bulk-delete", {
        port_ids: ids,
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

export const portSlice = createSlice({
  name: "port",
  initialState,
  reducers: {
    setPortListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setPortDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewPort: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.port_id === "new");
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false,
        };
      });

      state.list.unshift({
        port_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewPort: (state) => {
      state.list = state.list.filter((item) => item.port_id !== "new");
    },

    setPortEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === "new") {
        state.list = state.list.map((item) => ({
          ...item,
          editable,
        }));
        return;
      }

      // Filter out items with port_id as "new"
      state.list = state.list.filter((item) => item.port_id !== "new");

      // Update the list
      state.list = state.list.map((item) => {
        if (item.port_id === id) {
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

    updatePortListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.port_id === id) {
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
    addCase(getPortList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getPortList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getPortList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createPort.pending, (state) => {
      state.isSubmitting = "new";
    });
    addCase(createPort.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createPort.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.port_id !== "new");
    });

    addCase(updatePort.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updatePort.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updatePort.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeletePort.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePort.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePort.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setPortListParams,
  setPortDeleteIDs,
  addNewPort,
  removeNewPort,
  setPortEditable,
  updatePortListValue,
} = portSlice.actions;
export default portSlice.reducer;
