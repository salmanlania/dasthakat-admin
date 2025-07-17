import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getPurchaseReturnList = createAsyncThunk(
  'purchaseReturn/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/purchase-return', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const purchaseReturnDelete = createAsyncThunk(
  'purchaseReturn/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/purchase-return/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const returnPurchaseOrder = createAsyncThunk(
  'purchaseReturn/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/purchase-return', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePurchaseReturn = createAsyncThunk(
  'purchase-return/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/purchase-return/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePurchaseReturn = createAsyncThunk(
  'purchaseReturn/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/purchase-return/bulk-delete', {
        purchase_return_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPurchaseReturn = createAsyncThunk(
  'purchaseReturn/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/purchase-return/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPurchaseReturnInvoice = createAsyncThunk(
  'purchaseReturn/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/purchase-return/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const purchaseReturn = createAsyncThunk(
  'purchaseReturn/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/purchase-return/bulk-store', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  pickListOpenModalId: null,
  initialFormValues: null,
  pickListDetail: [],
  purchaseReturnDetail: [],
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

export const purchaseReturnListSlice = createSlice({
  name: 'purchaseReturn',
  initialState,
  reducers: {
    setPurchaseReturnListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setPurchaseReturnDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    setPickListOpenModalId: (state, action) => {
      state.pickListOpenModalId = action.payload;

      if (!action.payload) {
        state.pickListReceives = null;
      }
    },

    changePurchaseReturnDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.purchaseReturnDetail[index];
      detail[key] = value;
    },

  },
  extraReducers: ({ addCase }) => {
    addCase(getPurchaseReturnList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getPurchaseReturnList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getPurchaseReturnList.rejected, (state) => {
      state.isListLoading = false;
    });

    // get purchase return

    addCase(getPurchaseReturn.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getPurchaseReturn.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity || '',
        document_date: data.document_date || '',
        status: data.status || '',
        totalQuantity: data.total_quantity || 0,
        totalAmount: data.total_amount || 0,
        purchase_order_id: data.purchase_order_id,
        supplier: data?.purchase_order?.supplier?.name,
        customer_po_no: data?.charge_order?.customer_po_no,
        vessel: data?.charge_order?.vessel,
        vessel_billing_address: data?.vessel_billing_address,
        ship_via: data?.purchase_order?.ship_via,
        contact_person: data?.purchase_order?.supplier?.contact_person,
        vessel_id: data?.charge_order?.vessel?.name,
        customer_id: data?.charge_order?.customer?.name,
        contact1: data?.purchase_order?.supplier?.contact1,
        contact2: data?.purchase_order?.supplier?.contact2,
        port_id: data?.charge_order?.port?.name,
        supplier_code: data?.purchase_order?.supplier?.supplier_code,
      };
      state.purchaseReturnDetail = data.purchase_return_detail.map((detail) => ({
        id: detail.purchase_return_detail_id,
        purchase_return_detail_id: detail.purchase_return_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        product_type: detail.product && detail.product.product_type
          ? {
            value: detail.product.product_type.product_type_id,
            label: detail.product.product_type.name
          }
          : {
            value: 'other',
            label: 'Other'
          },
        product_name: detail?.product ? detail?.product?.name : detail?.product_name ? detail?.product_name : null,
        product_description: detail.product_description,
        charge_order_detail_id: detail.charge_order_detail_id,
        description: detail.description,
        charge_order_detail_id: detail.charge_order_detail_id,
        purchase_order_detail_id: detail.purchase_order_detail_id,
        vpart: detail.vpart,
        quantity: detail.quantity ? parseFloat(detail.quantity) : 0,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        rate: detail.rate,
        vendor_notes: detail.vendor_notes,
        sale_price: detail?.product ? detail?.product?.sale_price : 0,
        cost_price: detail?.product ? detail?.product?.cost_price : 0,
        short_code: detail?.product ? detail?.product?.short_code : null,
        amount: detail.amount ? detail.amount : 0,
        editable: detail.editable,
        warehouse_id: detail.warehouse_id,
        received_quantity: detail.received_quantity ? parseFloat(detail.received_quantity) : 0,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getPurchaseReturn.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updatePurchaseReturn.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(updatePurchaseReturn.fulfilled, (state) => {
      state.initialFormValues = null;
    });
    addCase(updatePurchaseReturn.rejected, (state) => {
      state.isItemLoading = false;
    });

    // start bulk delete

    addCase(bulkDeletePurchaseReturn.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePurchaseReturn.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePurchaseReturn.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

  }
});

export const { setPurchaseReturnListParams, setPickListOpenModalId, setPurchaseReturnDeleteIDs, changePurchaseReturnDetailValue } = purchaseReturnListSlice.actions;
export default purchaseReturnListSlice.reducer;