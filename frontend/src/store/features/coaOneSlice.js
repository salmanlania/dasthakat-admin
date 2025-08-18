import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCoaLevelOne = createAsyncThunk(
  'coalevelone/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/coa-level1', {
        params: {
          ...params,
          all: 1
        }
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCoaLevelOneCode = createAsyncThunk(
  'coaLevel1Code/get',
  async ({ gl_type_id, level, coa_level2_id, coa_level1_id }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/lookups/next-coa-level-code`, {
        params: {
          gl_type_id,
          level,
          coa_level2_id,
          coa_level1_id
        }
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCoaLevelOneEdit = createAsyncThunk(
  'coaLevel1/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/coa-level1/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCoaLevelOneForm = createAsyncThunk(
  'saleInvoice/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/coa-level1/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCoaLevelOne = createAsyncThunk(
  'coaLevelOne/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/coa-level1', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCoaLevelOne = createAsyncThunk(
  'coaLevelOne/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/coa-level1/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCoaLevelOne = createAsyncThunk(
  'coaLevelOne/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/coa-level1/bulk-delete', {
        coa_level1_ids: ids
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
  initialFormCodeValues: null,
  coaLevelOneList: null,
  isItemLoading: false,
  list: [],
  listID: [],
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

export const coaOneSlice = createSlice({
  name: 'coaOne',
  initialState,
  reducers: {
    setCoaLevelOneListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCoaLevelOneDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetCoaLevelOne: (state) => {
      state.initialFormValues = null;
      state.initialFormCodeValues = null;
      state.coaLevelOneList = null;
      state.isItemLoading = false;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getCoaLevelOne.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.coaLevelOneList = null;
    });
    addCase(getCoaLevelOne.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.coaLevelOneList = data
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCoaLevelOne.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCoaLevelOne.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCoaLevelOne.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCoaLevelOne.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteCoaLevelOne.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCoaLevelOne.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCoaLevelOne.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getCoaLevelOneEdit.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCoaLevelOneEdit.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        coa_level1_id: data.coa_level1_id || '',
        gl_types: data.gl_type || '',
        gl_type_id: data.gl_type_id || '',
        code: data.level1_code || '',
        coa_name: data.name || '',
      };
    });
    addCase(getCoaLevelOneEdit.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });
    
    addCase(getCoaLevelOneCode.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCoaLevelOneCode.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormCodeValues = data || null;
    });
    addCase(getCoaLevelOneCode.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });
  }
});

export const { setCoaLevelOneListParams, setCoaLevelOneDeleteIDs, resetCoaLevelOne } = coaOneSlice.actions;
export default coaOneSlice.reducer;
