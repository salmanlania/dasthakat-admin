import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getServiceListList = createAsyncThunk(
  'servicelist/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/servicelist', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getServiceListListReceives = createAsyncThunk(
  'servicelist/getReceives',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/servicelist-received/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);


export const getServiceListForPrint = createAsyncThunk(
  'servicelist/getById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/servicelist/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateServiceListListReceives = createAsyncThunk(
  'servicelist/updateReceives',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/servicelist-received/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  list: [],
  serviceListOpenModalId: null,
  serviceListReceives: null,
  isServiceListReceivesLoading: false,
  isServiceListReceivesSaving: false,
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

export const serviceListSlice = createSlice({
  name: 'serviceList',
  initialState,
  reducers: {
    setServiceListListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setServiceListOpenModalId: (state, action) => {
      state.serviceListOpenModalId = action.payload;

      if (!action.payload) {
        state.serviceListReceives = null;
      }
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getServiceListList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getServiceListList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getServiceListList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(getServiceListListReceives.pending, (state) => {
      state.isServiceListReceivesLoading = true;
    });
    addCase(getServiceListListReceives.fulfilled, (state, action) => {
      state.isServiceListReceivesLoading = false;
      state.serviceListReceives = action.payload;
    });
    addCase(getServiceListListReceives.rejected, (state) => {
      state.isServiceListReceivesLoading = false;
    });

    addCase(updateServiceListListReceives.pending, (state) => {
      state.isServiceListReceivesSaving = true;
    });
    addCase(updateServiceListListReceives.fulfilled, (state, action) => {
      state.isServiceListReceivesSaving = false;
      state.serviceListReceives = null;
    });
    addCase(updateServiceListListReceives.rejected, (state) => {
      state.isServiceListReceivesSaving = false;
    });
  }
});

export const { setServiceListListParams, setServiceListOpenModalId } = serviceListSlice.actions;
export default serviceListSlice.reducer;
