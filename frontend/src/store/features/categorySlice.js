import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getCategoryList = createAsyncThunk(
  "category/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/category", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/category/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/category", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/category/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCategory = createAsyncThunk(
  "category/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/category/bulk-delete", {
        category_ids: ids,
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

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setCategoryDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewCategory: (state) => {
      const ifAlreadyNew = state.list.some(
        (item) => item.category_id === "new"
      );
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false,
        };
      });

      state.list.unshift({
        category_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewCategory: (state) => {
      state.list = state.list.filter((item) => item.category_id !== "new");
    },

    setCategoryEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === "new") {
        state.list = state.list.map((item) => ({
          ...item,
          editable,
        }));
        return;
      }

      // Filter out items with category_id as "new"
      state.list = state.list.filter((item) => item.category_id !== "new");

      // Update the list
      state.list = state.list.map((item) => {
        if (item.category_id === id) {
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

    updateCategoryListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.category_id === id) {
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
    addCase(getCategoryList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getCategoryList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getCategoryList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCategory.pending, (state) => {
      state.isSubmitting = "new";
    });
    addCase(createCategory.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createCategory.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.category_id !== "new");
    });

    addCase(updateCategory.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateCategory.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateCategory.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteCategory.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCategory.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCategory.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setCategoryListParams,
  setCategoryDeleteIDs,
  addNewCategory,
  removeNewCategory,
  setCategoryEditable,
  updateCategoryListValue,
} = categorySlice.actions;
export default categorySlice.reducer;
