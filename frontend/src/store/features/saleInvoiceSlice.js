import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import dayjs from 'dayjs';

export const getSaleInvoiceList = createAsyncThunk(
  'saleInvoice/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/sale-invoice', {
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

export const getSaleInvoice = createAsyncThunk(
  'saleInvoice/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/sale-invoice/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateSaleInvoiceForm = createAsyncThunk(
  'saleInvoice/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/sale-invoice/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createSaleInvoice = createAsyncThunk(
  'saleInvoice/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/sale-invoice', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteSaleInvoice = createAsyncThunk(
  'saleInvoice/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sale-invoice/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteSaleInvoice = createAsyncThunk(
  'saleInvoice/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/sale-invoice/bulk-delete', {
        sale_invoice_ids: ids
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
  saleInvoiceDetail: [],
  isItemLoading: false,
  list: [],
  listID: [],
  deleteIDs: [],
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

export const saleInvoiceSlice = createSlice({
  name: 'saleInvoice',
  initialState,
  reducers: {
    setSaleInvoiceListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    clearSaleInvoiceList: (state) => {
      state.list = [];
    },

    clearSaleInvoiceDetail: (state) => {
      state.saleInvoiceDetail = [];
    },

    setSaleInvoiceDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getSaleInvoiceList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getSaleInvoiceList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.listID = data.map((item) => {
        return item.sale_invoice_id;
      });
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getSaleInvoiceList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createSaleInvoice.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createSaleInvoice.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createSaleInvoice.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    // start bulk delete

    addCase(bulkDeleteSaleInvoice.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteSaleInvoice.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteSaleInvoice.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    // end bulk delete

    addCase(getSaleInvoice.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getSaleInvoice.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity || '',
        // document_date: data.document_date || '',
        document_date: data.document_date ? dayjs(data.document_date) : null,
        totalQuantity: data.total_quantity || 0,
        totalAmount: data.total_amount || 0,
        totalDiscount: data.total_discount || 0,
        netAmount: data.net_amount || 0,
        salesman_id: data?.charge_order?.salesman?.name,
        customer_po_no: data?.charge_order?.customer_po_no,
        vessel: data?.charge_order?.vessel,
        vessel_billing_address: data?.vessel_billing_address,
        event_id: data?.charge_order?.event?.event_name,
        vessel_id: data?.charge_order?.vessel?.name,
        customer_id: data?.charge_order?.customer?.name,
        status: data?.status || '',
        charger_order_id: data?.charge_order?.document_identity,
        port_id: data?.charge_order?.port?.name,
        // ship_date: data?.ship_date ? data?.ship_date : data?.shipment ? data?.shipment?.document_date : '',
        ship_date: data?.ship_date
          ? dayjs(data.ship_date)
          : data?.shipment?.document_date
            ? dayjs(data.shipment.document_date)
            : null,
        ref_document_identity: data?.charge_order?.ref_document_identity
      };
      state.saleInvoiceDetail = data.sale_invoice_detail.map((detail) => ({
        id: detail.charge_order_detail_id,
        sale_invoice_id: detail.sale_invoice_id,
        sale_invoice_detail_id: detail.sale_invoice_detail_id,
        picklist_id: detail?.picklist ? detail?.picklist?.picklist_id : detail?.picklist_detail ? detail?.picklist_detail?.picklist_id : null,
        purchase_order_id: detail?.purchase_order?.purchase_order_id ? detail?.purchase_order?.purchase_order_id : detail?.purchase_order_detail?.purchase_order_id ? detail?.purchase_order_detail?.purchase_order_id : null,
        purchase_order_detail_id: detail?.purchase_order_detail?.purchase_order_detail_id ? detail?.purchase_order_detail?.purchase_order_detail_id : null,
        picklist_detail_id: detail?.picklist_detail ? detail?.picklist_detail?.picklist_detail_id : null,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name || '' }
          : null,
        product_type_no: detail?.product ? detail?.product?.product_type_id : 4,
        product_type_id: detail?.product_type
          ? {
            value: detail?.product_type?.product_type_id,
            label: detail?.product_type?.name
          }
          : 'Other',
        product_name:
          detail.product?.name
            ? detail?.product?.name || detail?.product_name || ''
            : detail.product_name || detail.charge_order_detail.product_name || '',
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
        discount_amount: detail.discount_amount ? detail.discount_amount : 0,
        discount_percent: detail.discount_percent ? detail.discount_percent : 0,
        gross_amount: detail.gross_amount ? detail.gross_amount : 0,
        editable: detail.editable,
        received_quantity: detail.received_quantity ? parseFloat(detail.received_quantity) : 0,
        row_status: 'U',
        isDeleted: false
      }));
    });
    addCase(getSaleInvoice.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });
  }
});

export const { setSaleInvoiceListParams, setSaleInvoiceDeleteIDs, clearSaleInvoiceList, clearSaleInvoiceDetail } = saleInvoiceSlice.actions;
export default saleInvoiceSlice.reducer;
