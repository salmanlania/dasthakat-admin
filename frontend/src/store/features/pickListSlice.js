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

export const getPickListListReceives = createAsyncThunk(
  'picklist/getReceives',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/picklist-received/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePickListListReceives = createAsyncThunk(
  'picklist/updateReceives',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/picklist-received/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  list: [],
  pickListOpenModalId: null,
  pickListReceives: null,
  isPickListReceivesLoading: false,
  isPickListReceivesSaving: false,
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
    },

    setPickListOpenModalId: (state, action) => {
      state.pickListOpenModalId = action.payload;

      if (!action.payload) {
        state.pickListReceives = null;
      }
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

    addCase(getPickListListReceives.pending, (state) => {
      state.isPickListReceivesLoading = true;
    });
    addCase(getPickListListReceives.fulfilled, (state, action) => {
      state.isPickListReceivesLoading = false;
      state.pickListReceives = action.payload;
    });
    addCase(getPickListListReceives.rejected, (state) => {
      state.isPickListReceivesLoading = false;
    });

    addCase(updatePickListListReceives.pending, (state) => {
      state.isPickListReceivesSaving = true;
    });
    addCase(updatePickListListReceives.fulfilled, (state, action) => {
      state.isPickListReceivesSaving = false;
      state.pickListReceives = null;
    });
    addCase(updatePickListListReceives.rejected, (state) => {
      state.isPickListReceivesSaving = false;
    });
  }
});

export const { setPickListListParams, setPickListOpenModalId } = pickListSlice.actions;
export default pickListSlice.reducer;
