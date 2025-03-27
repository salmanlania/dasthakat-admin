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
        shipment_ids: ids
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

    addCase(createShipment.pending, (state, action) => {
      state.isFormSubmitting = action.meta.arg.type;
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
      const { charge_order, event, shipment_detail, document_identity , document_type_id} = action.payload;

      state.initialFormValues = {
        event_id: event
          ? {
            value: event.event_id,
            label: event.event_code
          }
          : null,
        salesman_id: event?.customer?.salesman
          ? {
            value: event.customer.salesman.salesman_id,
            label: event.customer.salesman.name
          }
          : null,
        vessel_id: event?.vessel
          ? {
            value: event.vessel.vessel_id,
            label: event.vessel.name
          }
          : null,
        imo: event?.vessel?.imo || null,
        flag_id: event?.vessel?.flag
          ? {
            value: event.vessel.flag.flag_id,
            label: event.vessel.flag.name
          }
          : null,
        class1_id: event?.class1
          ? {
            value: event?.class1.class_id,
            label: event?.class1.name
          }
          : null,
        class2_id: event?.class2
          ? {
            value: event?.class2.class_id,
            label: event?.class2.name
          }
          : null,
        charge_order_id: charge_order
          ? {
            value: charge_order?.charge_order_id,
            label: charge_order?.document_identity
          }
          : null,
        document_identity: document_identity || null,
        document_type_id: document_type_id || null
      };

      if (!shipment_detail || !shipment_detail.length) return;

      state.chargeOrderDetails = shipment_detail.map((detail) => ({
        id: detail.shipment_detail_id,
        charge_order_no: detail?.charge_order?.document_identity || null,
        product_type: detail?.product_type?.name || null,
        product_code: detail?.product?.product_code || null,
        product_name: detail.product?.name
          ? detail.product.name
          : detail.product_name,
        description: detail?.product_description || null,
        customer_notes: detail?.description || null,
        internal_notes: detail?.internal_notes || null,
        quantity: parseFloat(detail?.quantity || 0),
        unit: detail?.unit ? detail.unit.name : null
      }));
    });
    addCase(getShipment.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateShipment.pending, (state, action) => {
      state.isFormSubmitting = action.meta.arg.data.type;
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
