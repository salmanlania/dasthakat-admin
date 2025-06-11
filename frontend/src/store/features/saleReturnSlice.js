import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getSaleReturnList = createAsyncThunk(
  'saleReturn/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/sale-return', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const saleReturnDelete = createAsyncThunk(
  'saleReturn/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sale-return/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const returnSaleInvoice = createAsyncThunk(
  'saleReturn/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/sale-return', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateSaleReturn = createAsyncThunk(
  'sale-return/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/sale-return/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteSaleReturn = createAsyncThunk(
  'saleReturn/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/sale-return/bulk-delete', {
        sale_return_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getSaleReturn = createAsyncThunk(
  'saleReturn/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/sale-return/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getSaleReturnInvoice = createAsyncThunk(
  'saleReturn/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/sale-return/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

// return start

export const saleReturn = createAsyncThunk(
  'saleReturn/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/sale-return/bulk-store', data);
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
  saleReturnDetail: [],
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

export const saleReturnListSlice = createSlice({
  name: 'saleReturn',
  initialState,
  reducers: {
    setSaleReturnListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setSaleReturnDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    setPickListOpenModalId: (state, action) => {
      state.pickListOpenModalId = action.payload;

      if (!action.payload) {
        state.pickListReceives = null;
      }
    },

    changeSaleReturnDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.saleReturnDetail[index];
      detail[key] = value;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getSaleReturnList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getSaleReturnList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getSaleReturnList.rejected, (state) => {
      state.isListLoading = false;
    });

    // get sale return

    addCase(getSaleReturn.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getSaleReturn.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity || '',
        status: data.status || '',
        document_date: data.document_date || '',
        totalQuantity: data.total_quantity || '',
        totalAmount: data.total_amount || '',
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
        sale_invoice_id: data?.sale_invoice_id ? data?.sale_invoice_id : null,
        ship_to: data?.ship_to ? data?.ship_to : null,
        ship_via: data?.ship_via ? data?.ship_via : null,
        return_date: data?.return_date ? data?.return_date : null,
      };
      state.saleReturnDetail = data.sale_return_detail.map((detail) => ({
        id: detail.sale_return_detail_id,
        sale_return_detail_id: detail.sale_return_detail_id,
        sale_invoice_detail_id: detail?.sale_invoice_detail_id ? detail?.sale_invoice_detail_id : null,
        warehouse_id: detail?.warehouse_id ? detail?.warehouse_id : null,
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
        product_name:
          detail.charge_order_detail
            ? detail?.product?.name
            : detail.product_name || detail.charge_order_detail.product_name,
        product_description: detail.product_description,
        charge_order_detail_id: detail.charge_order_detail_id,
        description: detail.description,
        charge_order_detail_id: detail.charge_order_detail_id,
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
    addCase(getSaleReturn.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateSaleReturn.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(updateSaleReturn.fulfilled, (state) => {
      state.initialFormValues = null;
    });
    addCase(updateSaleReturn.rejected, (state) => {
      state.isItemLoading = false;
    });

    // start bulk delete

    addCase(bulkDeleteSaleReturn.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteSaleReturn.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteSaleReturn.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

  }
});

export const { setSaleReturnListParams, setPickListOpenModalId, setSaleReturnDeleteIDs, changeSaleReturnDetailValue } = saleReturnListSlice.actions;
export default saleReturnListSlice.reducer;