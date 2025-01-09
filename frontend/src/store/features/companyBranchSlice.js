import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCompanyBranchList = createAsyncThunk(
  'company-branch/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/company-branch', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCompanyBranch = createAsyncThunk(
  'company-branch/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/company-branch/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCompanyBranch = createAsyncThunk(
  'company-branch/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/company-branch', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCompanyBranch = createAsyncThunk(
  'company-branch/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/company-branch/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCompanyBranch = createAsyncThunk(
  'company-branch/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/company-branch/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCompanyBranch = createAsyncThunk(
  'company-branch/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/company-branch/bulk-delete', {
        company_branch_ids: ids
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

export const companyBranchSlice = createSlice({
  name: 'companyBranch',
  initialState,
  reducers: {
    setCompanyBranchListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCompanyBranchDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getCompanyBranchList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCompanyBranchList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getCompanyBranchList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCompanyBranch.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCompanyBranch.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCompanyBranch.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getCompanyBranch.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCompanyBranch.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

      state.initialFormValues = {
        name: data.name,
        phone_no: data.phone_no,
        address: data.address,
        branch_code: data.branch_code,
        company: data.company_id
          ? {
              value: data.company_id,
              label: data.company_name
            }
          : null,
        image: data.image,
        image_url: data.image_url
      };
    });
    addCase(getCompanyBranch.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateCompanyBranch.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateCompanyBranch.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateCompanyBranch.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteCompanyBranch.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCompanyBranch.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCompanyBranch.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setCompanyBranchListParams, setCompanyBranchDeleteIDs } = companyBranchSlice.actions;
export default companyBranchSlice.reducer;
