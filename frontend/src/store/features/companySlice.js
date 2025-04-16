import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCompanyList = createAsyncThunk(
  'company/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/company', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCompany = createAsyncThunk('company/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/company/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createCompany = createAsyncThunk(
  'company/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/company', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCompany = createAsyncThunk('company/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/company/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateCompany = createAsyncThunk(
  'company/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/company/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCompany = createAsyncThunk(
  'company/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/company/bulk-delete', {
        company_ids: ids
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
  list: [],
  deleteIDs: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    sort_direction: null,
    name: null,
    description: null,
    catering_type: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCompanyDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getCompanyList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCompanyList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCompanyList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCompany.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCompany.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCompany.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getCompany.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCompany.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

      state.initialFormValues = {
        name: data.name,
        address: data.address,
        currency_id: data.base_currency_id
          ? {
              value: data.base_currency_id,
              label: data.currency_name
            }
          : null,
        image: data.image,
        image_url: data.image_url,
        is_exempted: data.is_exempted
      };
    });
    addCase(getCompany.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateCompany.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateCompany.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateCompany.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteCompany.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCompany.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCompany.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setCompanyListParams, setCompanyDeleteIDs } = companySlice.actions;
export default companySlice.reducer;
