import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCoaLevelThree = createAsyncThunk(
  'coaLevelThree/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/coa-level3', {
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

export const getCoaLevelThreeCode = createAsyncThunk(
  'coaLevel3Code/get',
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

export const getCoaLevelThreeEdit = createAsyncThunk(
  'coaLevel1/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/coa-level3/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCoaLevelThreeForm = createAsyncThunk(
  'saleInvoice/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/coa-level3/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCoaLevelThree = createAsyncThunk(
  'coaLevelThree/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/coa-level3', data);
      return res?.data
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCoaLevelThree = createAsyncThunk(
  'coaLevelThree/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/coa-level3/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCoaLevelThree = createAsyncThunk(
  'coaLevelThree/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/coa-level3/bulk-delete', {
        coa_level3_ids: ids
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
  coaLevelThreeList: null,
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

export const coaThreeSlice = createSlice({
  name: 'coaThree',
  initialState,
  reducers: {
    setCoaLevelThreeListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCoaLevelThreeDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetCoaLevelThree: (state) => {
      state.initialFormValues = null;
      state.initialFormCodeValues = null;
      state.coaLevelThreeList = null;
      state.isItemLoading = false;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getCoaLevelThree.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCoaLevelThree.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.coaLevelThreeList = data
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCoaLevelThree.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCoaLevelThree.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCoaLevelThree.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCoaLevelThree.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteCoaLevelThree.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCoaLevelThree.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCoaLevelThree.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getCoaLevelThreeEdit.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCoaLevelThreeEdit.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        coa_level1: data?.level1?.name || '',
        coa_level2: data?.level2?.name || '',
        gl_types: data.gl_type || '',
        gl_type_id: data.gl_type_id || '',
        level3_code: data.level3_code || '',
        coa_name: data.name || '',
      };
    });
    addCase(getCoaLevelThreeEdit.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(getCoaLevelThreeCode.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCoaLevelThreeCode.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormCodeValues = data || null;
    });
    addCase(getCoaLevelThreeCode.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormCodeValues = null;
    });
  }
});

export const { setCoaLevelThreeListParams, setCoaLevelThreeDeleteIDs, resetCoaLevelThree } = coaThreeSlice.actions;
export default coaThreeSlice.reducer;