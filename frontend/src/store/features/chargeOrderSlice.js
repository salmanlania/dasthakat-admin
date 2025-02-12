import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { roundUpto } from '../../utils/number';

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

export const createChargeOrderPO = createAsyncThunk(
  'chargeOrder/PO',
  async (id, { rejectWithValue }) => {
    try {
      await api.get(`charge-order/${id}/purchase-orders`);
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

    resetChargeOrderDetail: (state, action) => {
      const index = action.payload;

      state.chargeOrderDetails[index] = {
        id: state.chargeOrderDetails[index].id,
        product_code: null,
        product_id: null,
        description: null,
        stock_quantity: null,
        quantity: null,
        unit_id: null,
        supplier_id: null,
        cost_price: null,
        markup: '0',
        amount: null,
        discount_percent: '0',
        gross_amount: null
      };
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

      const productType = detail.product_type_id;

      if (
        productType?.label !== 'Service' &&
        key !== 'rate' &&
        detail.cost_price &&
        detail.markup
      ) {
        detail.rate = roundUpto(+detail.cost_price * (+detail.markup / 100) + +detail.cost_price);
      }

      if (detail.quantity && detail.rate) {
        detail.amount = roundUpto(+detail.quantity * +detail.rate);

        if (+detail.cost_price && +detail.rate) {
          detail.markup = roundUpto(
            ((+detail.rate - +detail.cost_price) / +detail.cost_price) * 100
          );
        }
      } else {
        detail.amount = '';
      }

      if (detail.discount_percent && detail.amount) {
        detail.discount_amount = roundUpto(+detail.amount * (+detail.discount_percent / 100));
      } else {
        detail.discount_amount = '';
      }

      if (detail.amount) {
        detail.gross_amount = roundUpto(+detail.amount - +detail.discount_amount) || 0;
      } else {
        detail.gross_amount = '';
      }
    },

    splitChargeOrderQuantity: (state, action) => {
      const index = action.payload;
      const detail = state.chargeOrderDetails[index];
      const splittedQuantity = parseFloat(detail.quantity) - parseFloat(detail.stock_quantity);

      const row = {
        ...detail,
        quantity: detail.stock_quantity,
        rate: detail.rate,
        amount: detail.rate * detail.stock_quantity,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_percent
          ? detail.rate * detail.stock_quantity * (detail.discount_percent / 100)
          : '',
        gross_amount:
          detail.rate * detail.stock_quantity -
          (detail.discount_percent
            ? detail.rate * detail.stock_quantity * (detail.discount_percent / 100)
            : 0)
      };

      const splittedRow = {
        product_type_id: {
          value: 4,
          label: 'Others'
        },
        product_name: detail.product_id?.label,
        description: detail.description,
        unit_id: detail.unit_id,
        supplier_id: detail.supplier_id,
        quantity: splittedQuantity,
        rate: detail.rate,
        amount: detail.rate * splittedQuantity,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_percent
          ? detail.rate * splittedQuantity * (detail.discount_percent / 100)
          : '',
        gross_amount:
          detail.rate * splittedQuantity -
          (detail.discount_percent
            ? detail.rate * splittedQuantity * (detail.discount_percent / 100)
            : 0),
        id: Date.now()
      };

      state.chargeOrderDetails.splice(index, 1, row, splittedRow);
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
        id: detail.charge_order_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        product_type_id: detail.product_type
          ? {
              value: detail.product_type.product_type_id,
              label: detail.product_type.name
            }
          : null,
        product_name: detail.product_name,
        description: detail.description,
        stock_quantity: detail?.product?.stock?.quantity
          ? parseFloat(detail.product.stock.quantity)
          : 0,
        quantity: detail.quantity ? parseFloat(detail.quantity) : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null,
        vendor_part_no: detail.vendor_part_no,
        markup: detail.markup,
        rate: detail.rate,
        amount: detail.amount,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_amount,
        gross_amount: detail.gross_amount,
        editable: detail.editable
      }));
    });
    addCase(getChargeOrder.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateChargeOrder.pending, (state, action) => {
      const isPOCreating = action.meta.arg?.poWillCreate || false;
      state.isFormSubmitting = isPOCreating ? 'PO_CREATING' : true;
    });
    addCase(updateChargeOrder.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(updateChargeOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(createChargeOrderPO.pending, (state) => {
      state.isFormSubmitting = 'PO_CREATING';
    });
    addCase(createChargeOrderPO.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(createChargeOrderPO.rejected, (state) => {
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
  resetChargeOrderDetail,
  changeChargeOrderDetailOrder,
  changeChargeOrderDetailValue,
  setChargeQuotationID,
  splitChargeOrderQuantity
} = chargeOrderSlice.actions;
export default chargeOrderSlice.reducer;
