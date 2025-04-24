import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { roundUpto } from '../../utils/number';

export const getPurchaseOrderList = createAsyncThunk(
  'purchase-order/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/purchase-order', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  'purchase-order/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/purchase-order/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'purchase-order/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/purchase-order', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPurchaseOrder = createAsyncThunk(
  'purchase-order/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/purchase-order/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPurchaseOrderForPrint = createAsyncThunk(
  'purchase-orderForPrint/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/purchase-order/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchase-order/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/purchase-order/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePurchaseOrder = createAsyncThunk(
  'purchase-order/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/purchase-order/bulk-delete', {
        purchase_order_ids: ids
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
  rebatePercentage: null,
  salesmanPercentage: null,
  purchaseOrderDetails: [],
  poChargeID: null,
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

export const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setPurchaseOrderListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setPurchaseOrderDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    setChargePoID: (state, action) => {
      state.poChargeID = action.payload;
    },

    addPurchaseOrderDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: Date.now(),
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        rate: null,
        amount: null,
        row_status: 'I'
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.purchaseOrderDetails.splice(index + 1, 0, newDetail);
      } else {
        state.purchaseOrderDetails.push(newDetail);
      }
    },

    copyPurchaseOrderDetail: (state, action) => {
      const index = action.payload;
      console.log('index' , index)

      const detail = state.purchaseOrderDetails[index];

      const newDetail = {
        ...detail,
        id: Date.now(),
        row_status: 'I',
        isDeleted: false
      }

      

      state.purchaseOrderDetails.splice(index + 1, 0, newDetail);
      console.log('new' , newDetail)
    },

    removePurchaseOrderDetail: (state, action) => {
      const itemIndex = state.purchaseOrderDetails.findIndex(item => item.id === action.payload);

      if (itemIndex !== -1) {
        if (state.purchaseOrderDetails[itemIndex].row_status === 'I') {
          state.purchaseOrderDetails = state.purchaseOrderDetails.filter((item) => item.id !== action.payload);
        } else {
          state.purchaseOrderDetails[itemIndex].row_status = 'D';
          state.purchaseOrderDetails[itemIndex].isDeleted = true;
        }
      }
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changePurchaseOrderDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.purchaseOrderDetails[from];
      state.purchaseOrderDetails[from] = state.purchaseOrderDetails[to];
      state.purchaseOrderDetails[to] = temp;
    },

    changePurchaseOrderDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.purchaseOrderDetails[index];

      if (
        detail.row_status === 'U' &&
        detail[key] !== value
      ) {
        detail.row_status = 'U';
      }

      detail[key] = value;

      if (detail.quantity && detail.rate) {
        detail.amount = roundUpto(+detail.quantity * +detail.rate);
      } else {
        detail.amount = '';
      }
    },

    resetPurchaseOrderDetail: (state, action) => {
      const index = action.payload;

      state.purchaseOrderDetails[index] = {
        id: state.purchaseOrderDetails[index].id,
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        rate: null,
        amount: null,
        purchase_order_detail_id: null,
        vpart: null,
        vendor_notes: null,
        row_status: state.purchaseOrderDetails[index].row_status === 'U' ? 'U' : state.purchaseOrderDetails[index].row_status
      };
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getPurchaseOrderList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.purchaseOrderDetails = [];
    });
    addCase(getPurchaseOrderList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getPurchaseOrderList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createPurchaseOrder.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createPurchaseOrder.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createPurchaseOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getPurchaseOrder.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getPurchaseOrder.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        required_date: data.required_date ? dayjs(data.required_date) : null,
        type: data.type,
        buyer_name: data.buyer_name,
        buyer_email: data.buyer_email,
        ship_via: data.ship_via,
        remarks: data.remarks,
        ship_to: data.ship_to,
        charge_no: data?.charge_order?.document_identity,
        purchase_order_no: data?.charge_order?.customer_po_no,
        quotation_id: data.quotation_id,
        charge_order_id: data.charge_order_id,
        event_id: data?.charge_order?.event
          ? {
            value: data?.charge_order?.event.event_id,
            label: data?.charge_order?.event.event_name
          }
          : null,
        customer_id: data?.charge_order?.customer
          ? {
            value: data?.charge_order?.customer.customer_id,
            label: data?.charge_order?.customer.name
          }
          : null,
        buyer_id: data.user
          ? {
            value: data.user.user_id,
            label: data.user.user_name
          }
          : null,
        payment_id: data.payment
          ? {
            value: data.payment.payment_id,
            label: data.payment.name
          }
          : null,
        supplier_id: data.supplier
          ? {
            value: data.supplier.supplier_id,
            label: data.supplier.name
          }
          : null
      };

      if (!data.purchase_order_detail) return;
      state.purchaseOrderDetails = data.purchase_order_detail.map((detail) => ({
        id: detail.purchase_order_detail_id,
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
        product_description: detail.product_description,
        charge_order_detail_id: detail.charge_order_detail_id,
        description: detail.description,
        purchase_order_detail_id: detail.purchase_order_detail_id,
        vpart: detail.vpart,
        quantity: detail.quantity ? parseFloat(detail.quantity) : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        rate: detail.rate,
        vendor_notes: detail.vendor_notes,
        amount: detail.amount,
        editable: detail.editable,
        received_quantity: detail.received_quantity ? parseFloat(detail.received_quantity) : null,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getPurchaseOrder.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(updatePurchaseOrder.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updatePurchaseOrder.fulfilled, (state) => {
      state.isFormSubmitting = false;

      state.purchaseOrderDetails = state.purchaseOrderDetails
        .filter(item => item.row_status !== 'D')
        .map(item => ({
          ...item,
          row_status: 'U',
          isDeleted: false
        }));

      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });
    addCase(updatePurchaseOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeletePurchaseOrder.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePurchaseOrder.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePurchaseOrder.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setPurchaseOrderListParams,
  setPurchaseOrderDeleteIDs,
  addPurchaseOrderDetail,
  removePurchaseOrderDetail,
  copyPurchaseOrderDetail,
  changePurchaseOrderDetailOrder,
  changePurchaseOrderDetailValue,
  resetPurchaseOrderDetail,
  setChargePoID
} = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
