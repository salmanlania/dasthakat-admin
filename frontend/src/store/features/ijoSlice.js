import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getIJOList = createAsyncThunk(
  'job-order/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/job-order', {
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

export const deleteIJO = createAsyncThunk('job-order/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/job-order/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createIJO = createAsyncThunk('job-order/create', async (data, { rejectWithValue }) => {
  try {
    return await api.post('/job-order', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getIJO = createAsyncThunk('job-order/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/job-order/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const putIJOCertificate = createAsyncThunk(
  'job-order-certificate/put',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/job-order/${id}/certificate`, data);
      return res;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getIJOForPrint = createAsyncThunk(
  'job-order/getForPrint',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/job-order/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getEventChargeOrders = createAsyncThunk(
  'event-charge-orders/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/event/${id}/charge-orders`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateIJO = createAsyncThunk(
  'job-order/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/job-order/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteIJO = createAsyncThunk(
  'job-order/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/job-order/bulk-delete', {
        job_order_ids: ids
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
  chargeOrderDetails: [],
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

export const ijoSlice = createSlice({
  name: 'ijo',
  initialState,
  reducers: {
    setIJOListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setIJODeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    setChargeOrderDetails: (state, action) => {
      state.chargeOrderDetails = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getIJOList.pending, (state) => {
      state.chargeOrderDetails = [];
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getIJOList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getIJOList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createIJO.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createIJO.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createIJO.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(putIJOCertificate.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(putIJOCertificate.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(putIJOCertificate.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getIJO.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getIJO.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const { event, salesman, vessel, flag, class1, class2, agent, job_order_detail, document_identity } =
        action.payload;

      state.initialFormValues = {
        event_id: event
          ? {
            value: event.event_id,
            label: event.event_code
          }
          : null,
        salesman_id: salesman
          ? {
            value: salesman.salesman_id,
            label: salesman.name
          }
          : null,
        vessel_id: vessel
          ? {
            value: vessel.vessel_id,
            label: vessel.name
          }
          : null,
        imo: vessel?.imo || null,
        flag_id: flag
          ? {
            value: flag.flag_id,
            label: flag.name
          }
          : null,
        class1_id: class1
          ? {
            value: class1.class_id,
            label: class1.name
          }
          : null,
        class2_id: class2
          ? {
            value: class2.class_id,
            label: class2.name
          }
          : null,
        agent_id: agent
          ? {
            value: agent.agent_id,
            label: agent.name
          }
          : null,
        document_identity: document_identity || null
      };

      if (!job_order_detail || !job_order_detail.length) return;

      const jobOrderDetails = [];

      job_order_detail.forEach(({ charge_order, job_order_detail_id, ...detail }) => {
        jobOrderDetails.push({
          id: job_order_detail_id,
          charge_order_no: charge_order?.document_identity ? charge_order?.document_identity : null,
          product_type: detail?.product_type?.name,
          product_code: detail?.product?.product_code || null,
          product_name:
            detail?.product_type?.product_type_id == 4
              ? detail?.product_name
              : detail?.product?.product_name,
          description: detail?.product_description,
          customer_notes: detail?.description,
          internal_notes: detail?.internal_notes,
          quantity: parseFloat(detail?.quantity || 0),
          unit: detail?.unit?.name || null
        });
      });

      state.chargeOrderDetails = jobOrderDetails;
    });
    addCase(getIJO.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateIJO.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateIJO.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateIJO.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteIJO.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteIJO.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteIJO.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setIJOListParams, setIJODeleteIDs, setChargeOrderDetails } = ijoSlice.actions;
export default ijoSlice.reducer;
