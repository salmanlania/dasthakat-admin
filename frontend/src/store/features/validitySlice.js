import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getValidityList = createAsyncThunk(
  "validity/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/validity", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteValidity = createAsyncThunk(
  "validity/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/validity/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createValidity = createAsyncThunk(
  "validity/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/validity", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getValidity = createAsyncThunk(
  "validity/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/validity/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateValidity = createAsyncThunk(
  "validity/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/validity/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteValidity = createAsyncThunk(
  "validity/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/validity/bulk-delete", {
        validity_ids: ids,
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
      validity_id: "1",
      name: "30 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      validity_id: "2",
      name: "60 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "3",
      validity_id: "3",
      name: "90 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "4",
      validity_id: "4",
      name: "120 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "5",
      validity_id: "5",
      name: "180 Days",
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

export const validitySlice = createSlice({
  name: "validity",
  initialState,
  reducers: {
    setValidityListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setValidityDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewValidity: (state) => {
      state.list.unshift({
        key: "new",
        validity_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewValidity: (state) => {
      state.list = state.list.filter((item) => item.key !== "new");
    },

    setValidityEditable: (state, action) => {
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
    addCase(getValidityList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getValidityList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getValidityList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createValidity.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createValidity.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createValidity.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getValidity.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getValidity.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      console.log(data);

      state.initialFormValues = {};
    });
    addCase(getValidity.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateValidity.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateValidity.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateValidity.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteValidity.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteValidity.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteValidity.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setValidityListParams,
  setValidityDeleteIDs,
  addNewValidity,
  removeNewValidity,
  setValidityEditable,
} = validitySlice.actions;
export default validitySlice.reducer;
