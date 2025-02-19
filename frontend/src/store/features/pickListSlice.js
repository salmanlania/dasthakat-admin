import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getPickListList = createAsyncThunk(
  'picklist/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/picklist', {
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
  list: [],
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

export const pickListSlice = createSlice({
  name: 'pickList',
  initialState,
  reducers: {
    setPickListListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getPickListList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getPickListList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getPickListList.rejected, (state) => {
      state.isListLoading = false;
    });
  }
});

export const { setPickListListParams } = pickListSlice.actions;
export default pickListSlice.reducer;
