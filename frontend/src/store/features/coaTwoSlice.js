import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCoaLevelTwo = createAsyncThunk(
  'coaLevelTwo/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/coa-level2', {
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

export const getCoaLevelTwoCode = createAsyncThunk(
  'coaLevel2Code/get',
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

export const getCoaLevelTwoEdit = createAsyncThunk(
  'coaLevel1/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/coa-level2/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCoaLevelTwoForm = createAsyncThunk(
  'saleInvoice/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/coa-level2/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCoaLevelTwo = createAsyncThunk(
  'coaLevelTwo/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/coa-level2', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCoaLevelTwo = createAsyncThunk(
  'coaLevelTwo/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/coa-level2/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCoaLevelTwo = createAsyncThunk(
  'coaLevelTwo/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/coa-level2/bulk-delete', {
        coa_level2_ids: ids
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
  coaLevelTwoList: null,
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

export const coaTwoSlice = createSlice({
  name: 'coaTwo',
  initialState,
  reducers: {
    setCoaLevelTwoListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCoaLevelTwoDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetCoaLevelTwo: (state) => {
      state.initialFormValues = null;
      state.initialFormCodeValues = null;
      state.coaLevelTwoList = null;
      state.isItemLoading = false;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getCoaLevelTwo.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCoaLevelTwo.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.coaLevelTwoList = data
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCoaLevelTwo.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCoaLevelTwo.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCoaLevelTwo.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCoaLevelTwo.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteCoaLevelTwo.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCoaLevelTwo.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCoaLevelTwo.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getCoaLevelTwoEdit.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCoaLevelTwoEdit.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        coa_level1_id: data.coa_level1_id || '',
        gl_types: data.level1?.name || '',
        coa_level1_id: data.level1?.coa_level1_id || '',
        gl_type_id: data.gl_type_id || '',
        level2_code: data.level2_code || '',
        coa_name: data.name || '',
      };
    });
    addCase(getCoaLevelTwoEdit.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(getCoaLevelTwoCode.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCoaLevelTwoCode.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormCodeValues = data || null;
    });
    addCase(getCoaLevelTwoCode.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });
  }
});

export const { setCoaLevelTwoListParams, setCoaLevelTwoDeleteIDs, resetCoaLevelTwo } = coaTwoSlice.actions;
export default coaTwoSlice.reducer;