import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';

export const getChargeOrderList = createAsyncThunk(
  'chargeOrder/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/charge-order', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteChargeOrder = createAsyncThunk(
  'chargeOrder/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/charge-order/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createChargeOrder = createAsyncThunk(
  'chargeOrder/create',
  async (data, { rejectWithValue }) => {
    try {
      return await api.post('/charge-order', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getChargeOrder = createAsyncThunk(
  'chargeOrder/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/charge-order/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateChargeOrder = createAsyncThunk(
  'chargeOrder/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/charge-order/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteChargeOrder = createAsyncThunk(
  'chargeOrder/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/charge-order/bulk-delete', {
        charge_order_ids: ids
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
  chargeQuotationID: null,
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

export const chargeOrderSlice = createSlice({
  name: 'chargeOrder',
  initialState,
  reducers: {
    setChargeQuotationID: (state, action) => {
      state.chargeQuotationID = action.payload;
    },

    setChargeOrderListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setChargeOrderDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addChargeOrderDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: Date.now(),
        product_code: null,
        product_id: null,
        product_nature: null,
        description: null,
        stock_quantity: null,
        quantity: null,
        unit_id: null,
        supplier_id: null
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.chargeOrderDetails.splice(index + 1, 0, newDetail);
      } else {
        state.chargeOrderDetails.push(newDetail);
      }
    },

    copyChargeOrderDetail: (state, action) => {
      const index = action.payload;

      const detail = state.chargeOrderDetails[index];
      const newDetail = {
        ...detail,
        id: Date.now()
      };

      state.chargeOrderDetails.splice(index + 1, 0, newDetail);
    },

    removeChargeOrderDetail: (state, action) => {
      state.chargeOrderDetails = state.chargeOrderDetails.filter(
        (item) => item.id !== action.payload
      );
    },

    // Change the order of chargeOrder details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeChargeOrderDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.chargeOrderDetails[from];
      state.chargeOrderDetails[from] = state.chargeOrderDetails[to];
      state.chargeOrderDetails[to] = temp;
    },

    changeChargeOrderDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.chargeOrderDetails[index];
      detail[key] = value;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getChargeOrderList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.chargeOrderDetails = [];
    });
    addCase(getChargeOrderList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getChargeOrderList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createChargeOrder.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createChargeOrder.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createChargeOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getChargeOrder.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getChargeOrder.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        remarks: data.remarks,
        agent_id: data.agent
          ? {
              value: data.agent.agent_id,
              label: data.agent.name
            }
          : null,
        salesman_id: data.salesman
          ? {
              value: data.salesman.salesman_id,
              label: data.salesman.name
            }
          : null,
        event_id: data.event
          ? {
              value: data.event.event_id,
              label: data.event.event_code
            }
          : null,
        vessel_id: data.vessel
          ? {
              value: data.vessel.vessel_id,
              label: data.vessel.name
            }
          : null,
        customer_id: data.customer
          ? {
              value: data.customer.customer_id,
              label: data.customer.name
            }
          : null,
        class1_id: data.class1
          ? {
              value: data.class1.class1_id,
              label: data.class1.name
            }
          : null,
        class2_id: data.class2
          ? {
              value: data.class2.class2_id,
              label: data.class2.name
            }
          : null,
        flag_id: data.flag
          ? {
              value: data.flag.flag_id,
              label: data.flag.name
            }
          : null
      };

      if (!data.charge_order_detail) return;
      state.chargeOrderDetails = data.charge_order_detail.map((detail) => ({
        id: data.charge_order_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_type: detail.product_type,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.name }
          : null,
        description: detail.description,
        quantity: detail.quantity ? parseFloat(detail.quantity) : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null
      }));
    });
    addCase(getChargeOrder.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateChargeOrder.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateChargeOrder.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateChargeOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteChargeOrder.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteChargeOrder.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteChargeOrder.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setChargeOrderListParams,
  setChargeOrderDeleteIDs,
  addChargeOrderDetail,
  removeChargeOrderDetail,
  copyChargeOrderDetail,
  changeChargeOrderDetailOrder,
  changeChargeOrderDetailValue,
  setChargeQuotationID
} = chargeOrderSlice.actions;
export default chargeOrderSlice.reducer;
