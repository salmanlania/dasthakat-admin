import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getClassList = createAsyncThunk('class/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/class', {
      params
    });
    return res.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const deleteClass = createAsyncThunk('class/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/class/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createClass = createAsyncThunk('class/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/class', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateClass = createAsyncThunk(
  'class/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/class/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteClass = createAsyncThunk(
  'class/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/class/bulk-delete', {
        class_ids: ids
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

export const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    setClassListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setClassDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewClass: (state) => {
      const ifAlreadyNew = state.list.some((item) => item.class_id === 'new');
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false
        };
      });

      state.list.unshift({
        class_id: 'new',
        name: '',
        editable: true,
        created_at: null
      });
    },

    removeNewClass: (state) => {
      state.list = state.list.filter((item) => item.class_id !== 'new');
    },

    setClassEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === 'new') {
        state.list = state.list.map((item) => ({
          ...item,
          editable
        }));
        return;
      }

      // Filter out items with class_id as "new"
      state.list = state.list.filter((item) => item.class_id !== 'new');

      // Update the list
      state.list = state.list.map((item) => {
        if (item.class_id === id) {
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

    updateClassListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.class_id === id) {
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
    addCase(getClassList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getClassList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getClassList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createClass.pending, (state) => {
      state.isSubmitting = 'new';
    });
    addCase(createClass.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createClass.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.class_id !== 'new');
    });

    addCase(updateClass.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateClass.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateClass.rejected, (state) => {
      state.isSubmitting = false;
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
  }
});

export const {
  setClassListParams,
  setClassDeleteIDs,
  addNewClass,
  removeNewClass,
  setClassEditable,
  updateClassListValue
} = classSlice.actions;
export default classSlice.reducer;
