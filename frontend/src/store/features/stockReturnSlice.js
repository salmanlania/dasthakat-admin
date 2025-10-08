import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getStockReturnList = createAsyncThunk(
  'stockReturn/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/stock-return', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const stockReturnDelete = createAsyncThunk(
  'stockReturn/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/stock-return/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const returnStockReturn = createAsyncThunk(
  'stockReturn/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/stock-return', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateStockReturn = createAsyncThunk(
  'stock-return/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/stock-return/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteStockReturn = createAsyncThunk(
  'stockReturn/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/stock-return/bulk-delete', {
        stock_return_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getStockReturn = createAsyncThunk(
  'stockReturn/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/stock-return/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getStockReturnInvoice = createAsyncThunk(
  'stockReturn/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/stock-return/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const stockReturn = createAsyncThunk(
  'stockReturn/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/stock-return/bulk-store', data);
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
  stockReturnDetail: [],
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

export const stockReturnListSlice = createSlice({
  name: 'stockReturn',
  initialState,
  reducers: {
    setStockReturnListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setStockReturnDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    setPickListOpenModalId: (state, action) => {
      state.pickListOpenModalId = action.payload;

      if (!action.payload) {
        state.pickListReceives = null;
      }
    },

    changeStockReturnDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.stockReturnDetail[index];
      detail[key] = value;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getStockReturnList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getStockReturnList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getStockReturnList.rejected, (state) => {
      state.isListLoading = false;
    });

    // get stock return

    addCase(getStockReturn.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getStockReturn.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity || '',
        status: data.status || '',
        document_date: data.document_date || '',
        totalQuantity: data.total_quantity || 0,
        totalAmount: data.total_amount || 0,
        salesman_id: data?.charge_order?.salesman?.name,
        customer_po_no: data?.charge_order?.customer_po_no,
        vessel: data?.charge_order?.vessel,
        vessel_billing_address: data?.vessel_billing_address,
        event_id: data?.charge_order?.event?.event_name,
        vessel_id: data?.charge_order?.vessel?.name,
        customer_id: data?.charge_order?.customer?.name,
        charger_order_id: data?.charge_order?.document_identity,
        port_id: data?.charge_order?.port?.name,
        ref_document_identity: data?.charge_order?.ref_document_identity,
        picklist_id: data?.picklist_id ? data?.picklist_id : null,
        ship_to: data?.ship_to ? data?.ship_to : null,
        ship_via: data?.ship_via ? data?.ship_via : null,
        return_date: data?.return_date ? data?.return_date : null,
      };
      state.stockReturnDetail = data.stock_return_detail.map((detail) => ({
        id: detail.stock_return_detail_id,
        stock_return_detail_id: detail.stock_return_detail_id,
        picklist_detail_id: detail?.picklist_detail_id ? detail?.picklist_detail_id : null,
        warehouse_id: detail?.warehouse_id ? detail?.warehouse_id : null,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : { value: detail?.product_id, label: detail?.product_name } || null,
        product_type_id: detail.product_type
          ? {
            value: detail.product_type.product_type_id,
            label: detail.product_type.name
          }
          : null,
        product_name:
          detail.charge_order_detail.product_type_id == '4'
            ? detail?.product_name || detail.charge_order_detail.product_name
            : detail?.product?.name || detail?.product_name,
        product_description: detail.product_description,
        charge_order_detail_id: detail.charge_order_detail_id,
        description: detail.description,
        charge_order_detail_id: detail.charge_order_detail_id,
        vpart: detail.vpart,
        quantity: detail.quantity ? parseFloat(detail.quantity) : 0,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        rate: detail.rate ? detail.rate : 0,
        vendor_notes: detail.vendor_notes,
        amount: detail.amount ? detail.amount : 0,
        editable: detail.editable,
        received_quantity: detail.received_quantity ? parseFloat(detail.received_quantity) : 0,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getStockReturn.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateStockReturn.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(updateStockReturn.fulfilled, (state) => {
      state.initialFormValues = null;
    });
    addCase(updateStockReturn.rejected, (state) => {
      state.isItemLoading = false;
    });

    // start bulk delete

    addCase(bulkDeleteStockReturn.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteStockReturn.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteStockReturn.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

  }
});

export const { setStockReturnListParams, setPickListOpenModalId, setStockReturnDeleteIDs, changeStockReturnDetailValue } = stockReturnListSlice.actions;
export default stockReturnListSlice.reducer;