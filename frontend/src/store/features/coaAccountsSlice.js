import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getAccountsList = createAsyncThunk(
  'accounts/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/accounts', {
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

export const getAccountCode = createAsyncThunk(
  'accountCode/get',
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

export const getAccountsEdit = createAsyncThunk(
  'accounts/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/accounts/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateAccountsForm = createAsyncThunk(
  'accounts/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/accounts/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createAccounts = createAsyncThunk(
  'accounts/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/accounts', data);
      return res?.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteAccounts = createAsyncThunk(
  'accounts/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/accounts/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteAccounts = createAsyncThunk(
  'accounts/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/accounts/bulk-delete', {
        account_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getHeadAccountList = createAsyncThunk(
  'headAccount/list',
  async ({ gl_type_id }, { rejectWithValue }) => {
    try {
      const res = await api.get('/accounts/account/heads', {
        params: { gl_type_id },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAccountsTree = createAsyncThunk(
  'accounts/tree',
  async ({ gl_type_id, parent_account_id }, { rejectWithValue }) => {
    try {
      const res = await api.get('/accounts/account/tree', {
        params: { gl_type_id, parent_account_id },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
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
  headAccountList: [],
  list: [],
  listID: [],
  deleteIDs: [],
  accountsTree: [],
  isTreeLoading: false,
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

export const coaAccountsSlice = createSlice({
  name: 'coaAccounts',
  initialState,
  reducers: {
    setAccountsListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setCoaLevelOneDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    resetAccounts: (state) => {
      state.initialFormValues = null;
      state.initialFormCodeValues = null;
      state.coaLevelOneList = null;
      state.isItemLoading = false;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getAccountsList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.coaLevelOneList = null;
      state.headAccountList = [];
      state.isItemLoading = false;
    });
    addCase(getAccountsList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.headAccountList = data
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getAccountsList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createAccounts.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createAccounts.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createAccounts.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteAccounts.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteAccounts.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteAccounts.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getAccountsEdit.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getAccountsEdit.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        ...data,
        coa_level1_id: data?.coa_level1_id ? data?.coa_level1_id : null,
        coa_level2_id: data?.coa_level2_id ? data?.coa_level2_id : null,
        gl_types: data?.gl_type ? data?.gl_type : null,
        gl_type_id: data?.gl_type_id ? data?.gl_type_id : null,
        account_code: data?.account_code ? data?.account_code : null,
        coa_name: data?.name ? data?.name : null,
        head_account_name: data?.head_account_name ? data?.head_account_name : null,
        // head_account: data?.head_account_name || '',
        // parent_account: data?.parent_account_name || '',
        head_account: data?.head_account_id
          ? { value: data.head_account_id, label: data.head_account_name }
          : null,
        parent_account: data?.parent_account_id
          ? { value: data.parent_account_id, label: data.parent_account_name }
          : null,
      };
    });
    addCase(getAccountsEdit.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(getAccountCode.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getAccountCode.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormCodeValues = data || null;
    });
    addCase(getAccountCode.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(getHeadAccountList.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getHeadAccountList.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.headAccountList = data?.data || [];
    });
    addCase(getHeadAccountList.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(getAccountsTree.pending, (state) => {
      state.isTreeLoading = true;
    });
    addCase(getAccountsTree.fulfilled, (state, action) => {
      state.isTreeLoading = false;
      state.accountsTree = action.payload?.data || [];
    });
    addCase(getAccountsTree.rejected, (state) => {
      state.isTreeLoading = false;
      state.accountsTree = [];
    });
  }
});

export const { setAccountsListParams, setCoaLevelOneDeleteIDs, resetAccounts } = coaAccountsSlice.actions;
export default coaAccountsSlice.reducer;
