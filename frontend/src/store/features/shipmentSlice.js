import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getShipmentList = createAsyncThunk(
  'shipment/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/shipment', {
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

export const deleteShipment = createAsyncThunk(
  'shipment/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/shipment/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createShipment = createAsyncThunk(
  'shipment/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/shipment', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getShipment = createAsyncThunk('shipment/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/shipment/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getShipmentForPrint = createAsyncThunk(
  'shipment/getForPrint',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/shipment/${id}`);
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

export const updateShipment = createAsyncThunk(
  'shipment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/shipment/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteShipment = createAsyncThunk(
  'shipment/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/shipment/bulk-delete', {
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

export const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    setShipmentListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setShipmentDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    setChargeOrderDetails: (state, action) => {
      state.chargeOrderDetails = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getShipmentList.pending, (state) => {
      state.chargeOrderDetails = [];
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getShipmentList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getShipmentList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createShipment.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createShipment.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createShipment.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getShipment.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getShipment.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const { event, salesman, vessel, flag, class1, class2, agent, job_order_detail } =
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
          : null
      };

      if (!job_order_detail || !job_order_detail.length) return;

      const jobOrderDetails = [];

      job_order_detail.forEach(({ charge_order, job_order_detail_id, ...detail }) => {
        jobOrderDetails.push({
          id: job_order_detail_id,
          charge_order_no: charge_order.document_identity,
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
    addCase(getShipment.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateShipment.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateShipment.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateShipment.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteShipment.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteShipment.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteShipment.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setShipmentListParams, setShipmentDeleteIDs, setChargeOrderDetails } =
  shipmentSlice.actions;
export default shipmentSlice.reducer;
