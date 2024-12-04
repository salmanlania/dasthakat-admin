import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getUserList = createAsyncThunk(
  "user/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/user", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/user/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/user", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getUser = createAsyncThunk(
  "user/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/user/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/user/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  initialFormValues: null,
  isItemLoading: false,
  list: [],
  params: {
    page: 1,
    limit: 50,
    search: "",
    sort_column: null,
    sort_direction: null,
    name: null,
    description: null,
    catering_type: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getUserList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getUserList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
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
    });
    addCase(createUser.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getUser.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getUser.fulfilled, (state, action) => {
      state.isItemLoading = false;
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
    });
    addCase(updateUser.rejected, (state) => {
      state.isFormSubmitting = false;
    });
  },
});

export const { setUserListParams } = userSlice.actions;
export default userSlice.reducer;
