import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getEventList = createAsyncThunk('event/list', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/event', {
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

export const deleteEvent = createAsyncThunk('event/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/event/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createEvent = createAsyncThunk('event/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/event', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getEvent = createAsyncThunk('event/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/event/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateEvent = createAsyncThunk(
  'event/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/event/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteEvent = createAsyncThunk(
  'event/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/event/bulk-delete', {
        event_ids: ids
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

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEventListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setEventDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getEventList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getEventList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getEventList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createEvent.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createEvent.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createEvent.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getEvent.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getEvent.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

      state.initialFormValues = {
        event_code: data.event_code,
        status: data.status,
        customer_id: data.customer_id
          ? {
              value: data.customer_id,
              label: data.customer_name
            }
          : null,
        vessel_id: data.vessel_id
          ? {
              value: data.vessel_id,
              label: data.vessel_name
            }
          : null,
        class1_id: data.class1_id
          ? {
              value: data.class1_id,
              label: data.class1_name
            }
          : null,
        class2_id: data.class2_id
          ? {
              value: data.class2_id,
              label: data.class2_name
            }
          : null
      };
    });
    addCase(getEvent.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateEvent.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateEvent.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateEvent.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteEvent.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteEvent.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteEvent.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setEventListParams, setEventDeleteIDs } = eventSlice.actions;
export default eventSlice.reducer;
