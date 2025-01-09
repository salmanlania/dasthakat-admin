import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getSubCategoryList = createAsyncThunk(
  'subCategory/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/sub-category', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  'subCategory/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sub-category/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createSubCategory = createAsyncThunk(
  'subCategory/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/sub-category', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateSubCategory = createAsyncThunk(
  'subCategory/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/sub-category/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteSubCategory = createAsyncThunk(
  'subCategory/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/sub-category/bulk-delete', {
        sub_category_ids: ids
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
    search: '',
    sort_column: null,
    sort_direction: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {
    setSubCategoryListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setSubCategoryDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewSubCategory: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.sub_category_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        sub_category_id: 'new',
        name: '',
        category_id: null,
        editable: true,
        created_at: null
      });
    },

    removeNewSubCategory: (state) => {
      state.list = state.list.filter((item) => item.sub_category_id !== 'new');
    },

    setSubCategoryEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with sub_category_id as "new"
      state.list = state.list.filter((item) => item.sub_category_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.sub_category_id === id) {
          return item.editable
            ? {
                ...item.prevRecord,
                editable: false
              }
            : {
                ...item,
                editable: true,
                prevRecord: { ...item }
              };
        }

        // If any other item is editable, reset it
        return item.editable
          ? { ...item.prevRecord, editable: false }
          : { ...item, editable: false };
      });
    },

    updateSubCategoryListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.sub_category_id === id) {
          return {
            ...item,
            [field]: value
          };
        }
        return item;
      });
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getSubCategoryList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getSubCategoryList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getSubCategoryList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createSubCategory.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createSubCategory.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createSubCategory.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.sub_category_id !== 'new');
    });

    addCase(updateSubCategory.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateSubCategory.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateSubCategory.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteSubCategory.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteSubCategory.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteSubCategory.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setSubCategoryListParams,
  setSubCategoryDeleteIDs,
  addNewSubCategory,
  removeNewSubCategory,
  setSubCategoryEditable,
  updateSubCategoryListValue
} = subCategorySlice.actions;
export default subCategorySlice.reducer;
