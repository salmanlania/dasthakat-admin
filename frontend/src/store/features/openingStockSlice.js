import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { roundUpto } from '../../utils/number';

export const getOpeningStockList = createAsyncThunk(
  'opening-stock/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/opening-stock', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteOpeningStock = createAsyncThunk(
  'opening-stock/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/opening-stock/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createOpeningStock = createAsyncThunk(
  'opening-stock/create',
  async (data, { rejectWithValue }) => {
    try {
      return await api.post('/opening-stock', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createImportOpeningStock = createAsyncThunk(
  'opening-stock/import-create',
  async (data, { rejectWithValue }) => {
    try {
      return await api.post('/opening-stock/upload/excel', data, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getOpeningStock = createAsyncThunk(
  'opening-stock/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/opening-stock/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getOpeningStockForPrint = createAsyncThunk(
  'opening-stockForPrint/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/opening-stock/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateOpeningStock = createAsyncThunk(
  'opening-stock/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/opening-stock/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteOpeningStock = createAsyncThunk(
  'opening-stock/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/opening-stock/bulk-delete', {
        opening_stock_ids: ids
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
  openingStockDetails: [],
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
    setOpeningStockListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setOpeningStockDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addOpeningStockDetail: (state, action) => {
      // const index = action.payload;
      const { index, defaultWarehouse } = typeof action.payload === 'object' ? action.payload : { index: action.payload };
      const newDetail = {
        id: Date.now(),
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        warehouse_id: defaultWarehouse || null,
        rate: null,
        amount: null,
        row_status: 'I'
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.openingStockDetails.splice(index + 1, 0, newDetail);
      } else {
        state.openingStockDetails.push(newDetail);
      }
    },

    copyOpeningStockDetail: (state, action) => {
      const index = action.payload;

      const detail = state.openingStockDetails[index];
      const newDetail = {
        ...detail,
        purchase_order_detail_id: null,
        id: Date.now(),
        row_status: 'I',
        isDeleted: false
      };

      state.openingStockDetails.splice(index + 1, 0, newDetail);
    },

    removeOpeningStockDetail: (state, action) => {
      const itemIndex = state.openingStockDetails.findIndex(item => item.id === action.payload);

      if (itemIndex !== -1) {
        if (state.openingStockDetails[itemIndex].row_status === 'I') {
          state.openingStockDetails = state.openingStockDetails.filter((item) => item.id !== action.payload);
        } else {
          state.openingStockDetails[itemIndex].row_status = 'D';
          state.openingStockDetails[itemIndex].isDeleted = true;
        }
      }
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeOpeningStockDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.openingStockDetails[from];
      state.openingStockDetails[from] = state.openingStockDetails[to];
      state.openingStockDetails[to] = temp;
    },

    changeOpeningStockDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.openingStockDetails[index];

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

    resetOpeningStockDetail: (state, action) => {
      const index = action.payload;

      state.openingStockDetails[index] = {
        id: state.openingStockDetails[index].id,
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        warehouse_id: null,
        rate: null,
        amount: null,
        row_status: state.openingStockDetails[index].row_status === 'U' ? 'U' : state.openingStockDetails[index].row_status
      };
    },

    setOpeningStockDetails: (state, action) => {
      state.openingStockDetails = action.payload;
    },

    setRebatePercentage: (state, action) => {
      state.rebatePercentage = action.payload;
    },

    setSalesmanPercentage: (state, action) => {
      state.salesmanPercentage = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getOpeningStockList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.openingStockDetails = [];
    });
    addCase(getOpeningStockList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getOpeningStockList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createOpeningStock.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createOpeningStock.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createOpeningStock.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getOpeningStock.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getOpeningStock.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data?.document_identity ? data?.document_identity : null,
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
            label: data.purchase_order.purchase_order_no ? data.purchase_order.purchase_order_no : data.purchase_order.document_identity
          }
          : null,
        warehouse_id: data?.opening_stock_detail
          ? {
            value: data?.opening_stock_detail[0]?.warehouse?.warehouse_id ? data?.opening_stock_detail[0]?.warehouse?.warehouse_id : data?.opening_stock_detail[0]?.warehouse_id ? data?.opening_stock_detail[0]?.warehouse_id : null,
            label: data?.opening_stock_detail[0]?.warehouse?.name ? data?.opening_stock_detail[0]?.warehouse?.name : null
          }
          : null,
      };

      if (!data.opening_stock_detail) return;
      state.openingStockDetails = data.opening_stock_detail
        .filter((detail) => detail?.product_type?.product_type_id === 2)
        .map((detail) => ({
          id: detail.opening_stock_detail_id,
          purchase_order_detail_id: detail.purchase_order_detail_id,
          poQuantity: detail?.purchase_order_detail?.quantity ? detail?.purchase_order_detail?.quantity : null,
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
          // quantity: detail.quantity ? parseFloat(detail.quantity) : null,
          cost_price: detail?.product_type?.product_type_id === 2 ? detail.cost_price || +detail.rate : null,
          quantity: detail.quantity ? detail.quantity : null,
          unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
          warehouse_id: detail.warehouse
            ? { value: detail.warehouse.warehouse_id, label: detail.warehouse.name }
            : null,
          rate: detail.rate,
          vendor_notes: detail.vendor_notes,
          amount: detail.amount,
          row_status: 'U',
          isDeleted: false
        }));
    });
    addCase(getOpeningStock.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(updateOpeningStock.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateOpeningStock.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.openingStockDetails = state.openingStockDetails
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
    addCase(updateOpeningStock.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteOpeningStock.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteOpeningStock.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteOpeningStock.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const {
  setOpeningStockListParams,
  setOpeningStockDeleteIDs,
  addOpeningStockDetail,
  removeOpeningStockDetail,
  copyOpeningStockDetail,
  changeOpeningStockDetailOrder,
  changeOpeningStockDetailValue,
  resetOpeningStockDetail,
  setOpeningStockDetails,
  setRebatePercentage,
  setSalesmanPercentage
} = goodsReceivedNoteSlice.actions;
export default goodsReceivedNoteSlice.reducer;
