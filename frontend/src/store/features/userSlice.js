import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';

export const getUserList = createAsyncThunk('user/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/user', {
      params: {
        ...params,
        all: 1
      }
    });
    return res.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const deleteUser = createAsyncThunk('user/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/user/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createUser = createAsyncThunk('user/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/user', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getUser = createAsyncThunk('user/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/user/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/user/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteUser = createAsyncThunk(
  'user/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/user/bulk-delete', {
        user_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCompanyTemplatesHandler = createAsyncThunk(
  'user/companyTemplates',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/lookups/company-and-branches', {
        params
      });
      return res.data;
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
  templates: [],
  selectedTemplates: [],
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setUserDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    changeTemplateItem: (state, action) => {
      const { value, companyID, templateID } = action.payload;

      if (value) {
        state.selectedTemplates.push({
          company_id: companyID,
          branch_id: templateID
        });
      } else {
        state.selectedTemplates = state.selectedTemplates.filter(
          (item) => !(item.company_id === companyID && item.branch_id === templateID)
        );
      }
    },

    changeAllCompanyTemplates: (state, action) => {
      const { value, companyID } = action.payload;
      state.selectedTemplates = state.selectedTemplates.filter(
        (item) => item.company_id !== companyID
      );

      if (value) {
        const findCompany = state.templates.find((company) => company.company_id === companyID);
        const makeNewTemplates = findCompany.branches.map((template) => ({
          company_id: companyID,
          branch_id: template.branch_id
        }));

        state.selectedTemplates = [...state.selectedTemplates, ...makeNewTemplates];
      }
    },

    emptySelectedTemplates: (state) => {
      state.selectedTemplates = [];
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getUserList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.selectedTemplates = [];
    });
    addCase(getUserList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getUserList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createUser.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createUser.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.selectedTemplates = [];
    });
    addCase(createUser.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getUser.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getUser.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

      state.initialFormValues = {
        user_name: data.user_name,
        email: data.email,
        permission_id: {
          value: data.permission.user_permission_id,
          label: data.permission.name
        },
        status: data.status,
        from_time: data.from_time ? dayjs(data.from_time, 'HH:mm:ss') : null,
        to_time: data.to_time ? dayjs(data.to_time, 'HH:mm:ss') : null,
        image: data.image,
        image_url: data.image_url
      };

      state.selectedTemplates = data.company_access;
    });
    addCase(getUser.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateUser.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateUser.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
      state.selectedTemplates = [];
    });
    addCase(updateUser.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteUser.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteUser.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteUser.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    addCase(getCompanyTemplatesHandler.fulfilled, (state, action) => {
      state.templates = action.payload;
    });
  }
});

export const {
  setUserListParams,
  setUserDeleteIDs,
  changeTemplateItem,
  changeAllCompanyTemplates,
  emptySelectedTemplates
} = userSlice.actions;
export default userSlice.reducer;
