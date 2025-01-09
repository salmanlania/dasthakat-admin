import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import { transformGroupPermission } from '../../utils/form';

export const getUserPermissionList = createAsyncThunk(
  'userPermission/lists',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/permission', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getUserPermissionForm = createAsyncThunk(
  'userPermission/form',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/lookups/modules');
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createUserPermission = createAsyncThunk(
  'userPermission/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/permission', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getUserPermission = createAsyncThunk(
  'userPermission/permissionGroupById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/permission/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateUserPermission = createAsyncThunk(
  'userPermission/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/permission/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteUserPermission = createAsyncThunk(
  'userPermission/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/permission/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteUserPermission = createAsyncThunk(
  'userPermission/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/permission/bulk-delete', {
        user_permission_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isLoading: false,
  isFormLoading: false,
  permissionsGroup: {},
  permissions: [],
  list: [],
  initialFormValues: {},
  isSubmitting: false,
  isBulkDeleting: false,
  deleteIDs: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    sort_direction: null,
    name: '',
    description: ''
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const userPermissionSlice = createSlice({
  name: 'userPermission',
  initialState,
  reducers: {
    changeCheckbox: (state, action) => {
      const { route, permission_id } = action.payload;
      state.permissionsGroup[route][permission_id] =
        state.permissionsGroup[route][permission_id] === 1 ? 0 : 1;
    },

    changeAllSubsection: (state, action) => {
      const route = action.payload;
      const updatedPermissionsGroup = { ...state.permissionsGroup };
      const subsections = Object.keys(updatedPermissionsGroup[route]);
      const totalSubsections = subsections.length;
      let checkedSubsections = 0;

      // Count the number of already checked subsections
      subsections.forEach((key) => {
        if (updatedPermissionsGroup[route][key] === 1) {
          checkedSubsections++;
        }
      });

      // Assign 1 if not all subsections are checked, otherwise assign 0
      const newValue = checkedSubsections < totalSubsections ? 1 : 0;

      // Update permissionsGroup with the new value
      Object.keys(updatedPermissionsGroup[route]).forEach((key) => {
        updatedPermissionsGroup[route][key] = newValue;
      });

      state.permissionsGroup = updatedPermissionsGroup;
    },

    checkAllSection: (state, action) => {
      const keys = action.payload;
      const updatedPermissionsGroup = { ...state.permissionsGroup };

      const isAllAreChecked = keys.every((route) =>
        Object.values(updatedPermissionsGroup[route]).every((v) => v === 1)
      );

      keys.forEach((route) => {
        Object.keys(updatedPermissionsGroup[route]).forEach((key) => {
          updatedPermissionsGroup[route][key] = isAllAreChecked ? 0 : 1;
        });
      });

      state.permissionsGroup = updatedPermissionsGroup;
    },
    setUserPermissionListParams: (state, action) => {
      state.params = { ...state.params, ...action.payload };
    },

    setUserPermissionDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserPermissionList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserPermissionList.fulfilled, (state, action) => {
      state.isLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    builder.addCase(getUserPermissionList.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(getUserPermissionForm.pending, (state) => {
      state.isFormLoading = true;
    });
    builder.addCase(getUserPermissionForm.fulfilled, (state, action) => {
      const permissions = action.payload;

      const transformPermissions = transformGroupPermission(permissions);
      state.permissionsGroup = transformPermissions;

      const formattedPermissions = [];
      for (const key in permissions) {
        formattedPermissions.push({ name: key, value: permissions[key] });
      }
      state.permissions = formattedPermissions;
      state.isFormLoading = false;
    });
    builder.addCase(getUserPermissionForm.rejected, (state) => {
      state.isFormLoading = false;
    });

    builder.addCase(createUserPermission.pending, (state) => {
      state.isSubmitting = true;
    });
    builder.addCase(createUserPermission.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    builder.addCase(createUserPermission.rejected, (state) => {
      state.isSubmitting = false;
    });

    builder.addCase(updateUserPermission.pending, (state) => {
      state.isSubmitting = true;
    });
    builder.addCase(updateUserPermission.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    builder.addCase(updateUserPermission.rejected, (state) => {
      state.isSubmitting = false;
    });

    builder.addCase(getUserPermission.pending, (state) => {
      state.isFormLoading = true;
    });
    builder.addCase(getUserPermission.fulfilled, (state, action) => {
      const { name, description, permission } = action.payload;
      state.initialFormValues = { name, description };

      const transformPermissions = transformGroupPermission(permission);
      state.permissionsGroup = transformPermissions;

      const formattedPermissions = [];
      for (const key in permission) {
        formattedPermissions.push({ name: key, value: permission[key] });
      }
      state.permissions = formattedPermissions;
      state.isFormLoading = false;
    });
    builder.addCase(getUserPermission.rejected, (state) => {
      state.isFormLoading = false;
    });

    builder.addCase(bulkDeleteUserPermission.pending, (state) => {
      state.isBulkDeleting = true;
    });
    builder.addCase(bulkDeleteUserPermission.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    builder.addCase(bulkDeleteUserPermission.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  changeCheckbox,
  changeAllSubsection,
  checkAllSection,
  setUserPermissionDeleteIDs,
  setUserPermissionListParams
} = userPermissionSlice.actions;
export default userPermissionSlice.reducer;
