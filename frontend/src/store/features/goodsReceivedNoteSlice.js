import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { roundUpto } from '../../utils/number';

export const getGoodsReceivedNoteList = createAsyncThunk(
  'good-received-note/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/good-received-note', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteGoodsReceivedNote = createAsyncThunk(
  'good-received-note/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/good-received-note/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createGoodsReceivedNote = createAsyncThunk(
  'good-received-note/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/good-received-note', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getGoodsReceivedNote = createAsyncThunk(
  'good-received-note/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/good-received-note/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getGoodsReceivedNoteForPrint = createAsyncThunk(
  'good-received-noteForPrint/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/good-received-note/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateGoodsReceivedNote = createAsyncThunk(
  'good-received-note/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/good-received-note/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteGoodsReceivedNote = createAsyncThunk(
  'good-received-note/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/good-received-note/bulk-delete', {
        good_received_note_ids: ids
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
  goodsReceivedNoteDetails: [],
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

export const goodsReceivedNoteSlice = createSlice({
  name: 'goodsReceivedNote',
  initialState,
  reducers: {
    setGoodsReceivedNoteListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setGoodsReceivedNoteDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addGoodsReceivedNoteDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: Date.now(),
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        warehouse_id: null,
        rate: null,
        amount: null
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.goodsReceivedNoteDetails.splice(index + 1, 0, newDetail);
      } else {
        state.goodsReceivedNoteDetails.push(newDetail);
      }
    },

    copyGoodsReceivedNoteDetail: (state, action) => {
      const index = action.payload;

      const detail = state.goodsReceivedNoteDetails[index];
      const newDetail = {
        ...detail,
        purchase_order_detail_id: null,
        id: Date.now()
      };

      state.goodsReceivedNoteDetails.splice(index + 1, 0, newDetail);
    },

    removeGoodsReceivedNoteDetail: (state, action) => {
      state.goodsReceivedNoteDetails = state.goodsReceivedNoteDetails.filter(
        (item) => item.id !== action.payload
      );
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeGoodsReceivedNoteDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.goodsReceivedNoteDetails[from];
      state.goodsReceivedNoteDetails[from] = state.goodsReceivedNoteDetails[to];
      state.goodsReceivedNoteDetails[to] = temp;
    },

    changeGoodsReceivedNoteDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.goodsReceivedNoteDetails[index];
      detail[key] = value;

      if (detail.quantity && detail.rate) {
        detail.amount = roundUpto(+detail.quantity * +detail.rate);
      } else {
        detail.amount = '';
      }
    },

    resetGoodsReceivedNoteDetail: (state, action) => {
      const index = action.payload;

      state.goodsReceivedNoteDetails[index] = {
        id: state.goodsReceivedNoteDetails[index].id,
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        warehouse_id: null,
        rate: null,
        amount: null
      };
    },

    setGoodsReceivedNoteDetails: (state, action) => {
      state.goodsReceivedNoteDetails = action.payload;
    },

    setRebatePercentage: (state, action) => {
      state.rebatePercentage = action.payload;
    },

    setSalesmanPercentage: (state, action) => {
      state.salesmanPercentage = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getGoodsReceivedNoteList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.goodsReceivedNoteDetails = [];
    });
    addCase(getGoodsReceivedNoteList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getGoodsReceivedNoteList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createGoodsReceivedNote.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createGoodsReceivedNote.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createGoodsReceivedNote.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getGoodsReceivedNote.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getGoodsReceivedNote.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        remarks: data.remarks,
        quotation_id: data.quotation_id,
        charge_order_id: data.charge_order_id,
        type: data?.purchase_order?.type || null,
        charge_no: data?.purchase_order?.charge_order?.purchase_order_no,
        purchase_order_no: data?.purchase_order?.charge_order?.customer_po_no,
        event_id: data?.purchase_order?.charge_order?.event
          ? {
              value: data?.purchase_order?.charge_order?.event.event_id,
              label: data?.purchase_order?.charge_order?.event.event_name
            }
          : null,
        customer_id: data?.purchase_order?.charge_order?.customer
          ? {
              value: data?.purchase_order?.charge_order?.customer.customer_id,
              label: data?.purchase_order?.charge_order?.customer.name
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
          : null,
          vessel_id: data.vessel
          ? {
              value: data.vessel.vessel_id,
              label: data.vessel.name
            }
          : null,
        purchase_order_id: data.purchase_order
          ? {
              value: data.purchase_order.purchase_order_id,
              label: data.purchase_order.purchase_order_no || data.purchase_order.document_identity
            }
          : null,
      };

      if (!data.grn_detail) return;
      state.goodsReceivedNoteDetails = data.grn_detail.map((detail) => ({
        id: detail.good_received_note_detail_id,
        purchase_order_detail_id: detail.purchase_order_detail_id,
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
        description: detail.description,
        quantity: detail.quantity ? parseFloat(detail.quantity) : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        warehouse_id: detail.warehouse
          ? { value: detail.warehouse.warehouse_id, label: detail.warehouse.name }
          : null,
        rate: detail.rate,
        vendor_notes: detail.vendor_notes,
        amount: detail.amount
      }));
    });
    addCase(getGoodsReceivedNote.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(updateGoodsReceivedNote.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateGoodsReceivedNote.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });
    addCase(updateGoodsReceivedNote.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteGoodsReceivedNote.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteGoodsReceivedNote.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteGoodsReceivedNote.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setGoodsReceivedNoteListParams,
  setGoodsReceivedNoteDeleteIDs,
  addGoodsReceivedNoteDetail,
  removeGoodsReceivedNoteDetail,
  copyGoodsReceivedNoteDetail,
  changeGoodsReceivedNoteDetailOrder,
  changeGoodsReceivedNoteDetailValue,
  resetGoodsReceivedNoteDetail,
  setGoodsReceivedNoteDetails,
  setRebatePercentage,
  setSalesmanPercentage
} = goodsReceivedNoteSlice.actions;
export default goodsReceivedNoteSlice.reducer;
