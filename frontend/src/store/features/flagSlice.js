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

export const getFlag = createAsyncThunk(
  "flag/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/flag/${id}`);
      return res.data.data;
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
  isFormSubmitting: false,
  isBulkDeleting: false,
  initialFormValues: null,
  isItemLoading: false,
  list: [
    {
      key: "1",
      flag_id: "1",
      name: "Pakistan",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      flag_id: "2",
      name: "India",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "3",
      flag_id: "3",
      name: "Australia",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "4",
      flag_id: "4",
      name: "America",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "5",
      flag_id: "5",
      name: "New Zealand",
      created_at: "01-01-2023 10:00 AM",
    },
  ],
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
      state.list.unshift({
        key: "new",
        flag_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewFlag: (state) => {
      state.list = state.list.filter((item) => item.key !== "new");
    },

    setFlagEditable: (state, action) => {
      state.list = state.list.map((item) => {
        if (item.key === action.payload.key) {
          return {
            ...item,
            editable: action.payload.editable,
          };
        }
        return item;
      });
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getFlagList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
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
      state.isFormSubmitting = true;
    });
    addCase(createFlag.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createFlag.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getFlag.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getFlag.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      console.log(data);

      state.initialFormValues = {};
    });
    addCase(getFlag.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateFlag.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateFlag.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateFlag.rejected, (state) => {
      state.isFormSubmitting = false;
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
} = flagSlice.actions;
export default flagSlice.reducer;
