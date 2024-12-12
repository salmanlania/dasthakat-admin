import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getTermsList = createAsyncThunk(
  "terms/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/terms", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteTerms = createAsyncThunk(
  "terms/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/terms/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createTerms = createAsyncThunk(
  "terms/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/terms", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateTerms = createAsyncThunk(
  "terms/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/terms/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteTerms = createAsyncThunk(
  "terms/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/terms/bulk-delete", {
        term_ids: ids,
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

export const termsSlice = createSlice({
  name: "terms",
  initialState,
  reducers: {
    setTermsListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setTermsDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewTerms: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.term_id === "new");
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false,
        };
      });

      state.list.unshift({
        term_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewTerms: (state) => {
      state.list = state.list.filter((item) => item.term_id !== "new");
    },

    setTermsEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === "new") {
        state.list = state.list.map((item) => ({
          ...item,
          editable,
        }));
        return;
      }

      // Filter out items with term_id as "new"
      state.list = state.list.filter((item) => item.term_id !== "new");

      // Update the list
      state.list = state.list.map((item) => {
        if (item.term_id === id) {
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

    updateTermsListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.term_id === id) {
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
    addCase(getTermsList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getTermsList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getTermsList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createTerms.pending, (state) => {
      state.isSubmitting = "new";
    });
    addCase(createTerms.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createTerms.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.term_id !== "new");
    });

    addCase(updateTerms.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateTerms.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateTerms.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteTerms.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteTerms.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteTerms.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setTermsListParams,
  setTermsDeleteIDs,
  addNewTerms,
  removeNewTerms,
  setTermsEditable,
  updateTermsListValue,
} = termsSlice.actions;
export default termsSlice.reducer;
