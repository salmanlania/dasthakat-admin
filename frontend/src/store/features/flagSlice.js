import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getFlagList = createAsyncThunk(
  "flag/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/flag", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteFlag = createAsyncThunk(
  "flag/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/flag/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createFlag = createAsyncThunk(
  "flag/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/flag", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateFlag = createAsyncThunk(
  "flag/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/flag/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteFlag = createAsyncThunk(
  "flag/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/flag/bulk-delete", {
        flag_ids: ids,
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

export const flagSlice = createSlice({
  name: "flag",
  initialState,
  reducers: {
    setFlagListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setFlagDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewFlag: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.flag_id === "new");
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false,
        };
      });

      state.list.unshift({
        flag_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewFlag: (state) => {
      state.list = state.list.filter((item) => item.flag_id !== "new");
    },

    setFlagEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === "new") {
        state.list = state.list.map((item) => ({
          ...item,
          editable,
        }));
        return;
      }

      // Filter out items with flag_id as "new"
      state.list = state.list.filter((item) => item.flag_id !== "new");

      // Update the list
      state.list = state.list.map((item) => {
        if (item.flag_id === id) {
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

    updateFlagListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.flag_id === id) {
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
    addCase(getFlagList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getFlagList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getFlagList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createFlag.pending, (state) => {
      state.isSubmitting = "new";
    });
    addCase(createFlag.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createFlag.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.flag_id !== "new");
    });

    addCase(updateFlag.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateFlag.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateFlag.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteFlag.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteFlag.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteFlag.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setFlagListParams,
  setFlagDeleteIDs,
  addNewFlag,
  removeNewFlag,
  setFlagEditable,
  updateFlagListValue,
} = flagSlice.actions;
export default flagSlice.reducer;
