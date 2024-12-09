import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getClassList = createAsyncThunk(
  "class/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/class", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteClass = createAsyncThunk(
  "class/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/class/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createClass = createAsyncThunk(
  "class/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/class", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getClass = createAsyncThunk(
  "class/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/class/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateClass = createAsyncThunk(
  "class/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/class/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteClass = createAsyncThunk(
  "class/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/class/bulk-delete", {
        class_ids: ids,
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
      class_id: "1",
      name: "Class 1",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      class_id: "2",
      name: "Class 2",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "3",
      class_id: "3",
      name: "Class 3",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "4",
      class_id: "4",
      name: "Class 4",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "5",
      class_id: "5",
      name: "Class 5",
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

export const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setClassListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setClassDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewClass: (state) => {
      state.list.unshift({
        key: "new",
        class_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewClass: (state) => {
      state.list = state.list.filter((item) => item.key !== "new");
    },

    setClassEditable: (state, action) => {
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
    addCase(getClassList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getClassList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getClassList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createClass.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createClass.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createClass.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getClass.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getClass.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      console.log(data);

      state.initialFormValues = {};
    });
    addCase(getClass.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateClass.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateClass.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateClass.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteClass.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteClass.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteClass.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setClassListParams,
  setClassDeleteIDs,
  addNewClass,
  removeNewClass,
  setClassEditable,
} = classSlice.actions;
export default classSlice.reducer;
