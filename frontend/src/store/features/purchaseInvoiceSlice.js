import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { roundUpto } from '../../utils/number';

export const getPurchaseInvoiceList = createAsyncThunk(
  'purchase-invoice/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/purchase-invoice', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deletePurchaseInvoice = createAsyncThunk(
  'purchase-invoice/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/purchase-invoice/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createPurchaseInvoice = createAsyncThunk(
  'purchase-invoice/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/purchase-invoice', data);
      return response.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPurchaseInvoice = createAsyncThunk(
  'purchase-invoice/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/purchase-invoice/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPurchaseInvoiceForPrint = createAsyncThunk(
  'purchase-invoiceForPrint/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/purchase-invoice/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePurchaseInvoice = createAsyncThunk(
  'purchase-invoice/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/purchase-invoice/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePurchaseInvoice = createAsyncThunk(
  'purchase-invoice/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/purchase-invoice/bulk-delete', {
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

export const purchaseInvoiceSlice = createSlice({
  name: 'purchaseInvoice',
  initialState,
  reducers: {
    setPurchaseInvoiceListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setPurchaseInvoiceDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addPurchaseInvoiceDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: Date.now(),
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        rate: null,
        amount: null
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.purchaseOrderDetails.splice(index + 1, 0, newDetail);
      } else {
        state.purchaseOrderDetails.push(newDetail);
      }
    },

    copyPurchaseInvoiceDetail: (state, action) => {
      const index = action.payload;

      const detail = state.purchaseOrderDetails[index];
      const newDetail = {
        ...detail,
        id: Date.now()
      };

      state.purchaseOrderDetails.splice(index + 1, 0, newDetail);
    },

    removePurchaseInvoiceDetail: (state, action) => {
      state.purchaseOrderDetails = state.purchaseOrderDetails.filter(
        (item) => item.id !== action.payload
      );
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changePurchaseInvoiceDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.purchaseOrderDetails[from];
      state.purchaseOrderDetails[from] = state.purchaseOrderDetails[to];
      state.purchaseOrderDetails[to] = temp;
    },

    changePurchaseInvoiceDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.purchaseOrderDetails[index];
      detail[key] = value;

      if (detail.quantity && detail.rate) {
        detail.amount = roundUpto(+detail.quantity * +detail.rate);
      } else {
        detail.amount = '';
      }
    },

    setRebatePercentage: (state, action) => {
      state.rebatePercentage = action.payload;
    },

    setSalesmanPercentage: (state, action) => {
      state.salesmanPercentage = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getPurchaseInvoiceList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.purchaseOrderDetails = [];
    });
    addCase(getPurchaseInvoiceList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getPurchaseInvoiceList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createPurchaseInvoice.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createPurchaseInvoice.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createPurchaseInvoice.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getPurchaseInvoice.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getPurchaseInvoice.fulfilled, (state, action) => {
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
        department: data.department ? data.department : "",
        remarks: data.remarks,
        ship_to: data.ship_to,
        freight: data?.freight,
        net_amount: data?.net_amount,
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
        supplier: data?.supplier?.name,

        supplier_id: data.supplier
          ? {
            value: data.supplier.supplier_id,
            label: data.supplier.name
          }
          : null,
      };

      state.purchaseOrderDetails = data.purchase_invoice_detail.map((detail) => ({
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
        po_price: detail.po_price,
        vendor_notes: detail.vendor_notes,
        amount: detail.amount,
        editable: detail.editable,
        received_quantity: detail.received_quantity ? parseFloat(detail.received_quantity) : null,
        row_status: 'U',
        isDeleted: false,
        grn_date: detail?.grn_date
      }));

    });
    addCase(getPurchaseInvoice.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(updatePurchaseInvoice.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updatePurchaseInvoice.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });
    addCase(updatePurchaseInvoice.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeletePurchaseInvoice.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePurchaseInvoice.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePurchaseInvoice.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setPurchaseInvoiceListParams,
  setPurchaseInvoiceDeleteIDs,
  addPurchaseInvoiceDetail,
  removePurchaseInvoiceDetail,
  copyPurchaseInvoiceDetail,
  changePurchaseInvoiceDetailOrder,
  changePurchaseInvoiceDetailValue,
  setRebatePercentage,
  setSalesmanPercentage
} = purchaseInvoiceSlice.actions;
export default purchaseInvoiceSlice.reducer;
