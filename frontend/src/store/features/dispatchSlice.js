import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getDispatchList = createAsyncThunk(
  'dispatch/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/event-dispatch', {
        params: {
          ...params,
          all: 1,
          // limit: 1000
        }
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateDispatch = createAsyncThunk(
  'dispatch/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/event-dispatch/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getEventJobOrders = createAsyncThunk(
  'event/get-job-orders',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/event/${id}/job-orders`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getEventPickLists = createAsyncThunk(
  'event/get-picklist',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/event/${id}/picklists`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  list: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    sort_direction: 'ascend',
    name: null,
    description: null,
    catering_type: null,
    start_date: null,
    end_date: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const dispatchSlice = createSlice({
  name: 'dispatch',
  initialState,
  reducers: {
    setDispatchListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getDispatchList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getDispatchList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getDispatchList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(updateDispatch.pending, (state, action) => {
      state.isFormSubmitting = true;
    });
    addCase(updateDispatch.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(updateDispatch.rejected, (state) => {
      state.isFormSubmitting = false;
    });
  }
});

export const { setDispatchListParams } = dispatchSlice.actions;
export default dispatchSlice.reducer;
