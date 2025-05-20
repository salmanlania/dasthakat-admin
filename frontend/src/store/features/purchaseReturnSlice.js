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
      console.log('res' , res.data)
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

const initialState = {
  isListLoading: false,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  pickListOpenModalId: null,
  initialFormValues: null,
  pickListDetail: [],
  // purchaseReturnDetail: [],yyy
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
    }
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
      console.log('purchase_return_detail' , data)
      state.initialFormValues = {
        document_identity: data.document_identity || '',
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
        ref_document_identity: data?.charge_order?.ref_document_identity
      };
      // state.purchaseReturnDetail = data.purchase_return_detail.map((detail) => ({
      //   id: detail.charge_order_detail_id,
      //   product_code: detail.product ? detail.product.product_code : null,
      //   product_id: detail.product
      //     ? { value: detail.product.product_id, label: detail.product.product_name }
      //     : null,
      //   product_type_id: detail.product_type
      //     ? {
      //       value: detail.product_type.product_type_id,
      //       label: detail.product_type.name
      //     }
      //     : null,
      //   product_name:
      //     detail.charge_order_detail.product_type_id == '4'
      //       ? detail.product_name || detail.charge_order_detail.product_name
      //       : detail?.product?.name,
      //   product_description: detail.product_description,
      //   charge_order_detail_id: detail.charge_order_detail_id,
      //   description: detail.description,
      //   charge_order_detail_id: detail.charge_order_detail_id,
      //   vpart: detail.vpart,
      //   quantity: detail.quantity ? parseFloat(detail.quantity) : null,
      //   unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
      //   rate: detail.rate,
      //   vendor_notes: detail.vendor_notes,
      //   amount: detail.amount,
      //   editable: detail.editable,
      //   received_quantity: detail.received_quantity ? parseFloat(detail.received_quantity) : null,
      //   row_status: 'U',
      //   isDeleted: false
      // }));
    });
    addCase(getPurchaseReturn.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
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

export const { setPurchaseReturnListParams, setPickListOpenModalId, setPurchaseReturnDeleteIDs } = purchaseReturnListSlice.actions;
export default purchaseReturnListSlice.reducer;