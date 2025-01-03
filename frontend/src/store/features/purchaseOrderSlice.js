import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import api from "../../axiosInstance";
import { roundUpto } from "../../utils/number";

export const getPurchaseOrderList = createAsyncThunk(
  "purchase-order/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/purchase-order", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  "purchase-order/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/purchase-order/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  "purchase-order/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/purchase-order", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPurchaseOrder = createAsyncThunk(
  "purchase-order/get",
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
  "purchase-orderForPrint/get",
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
  "purchase-order/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/purchase-order/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePurchaseOrder = createAsyncThunk(
  "purchase-order/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/purchase-order/bulk-delete", {
        purchase_order_ids: ids,
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
    search: "",
    sort_column: null,
    sort_direction: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState,
  reducers: {
    setPurchaseOrderListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setPurchaseOrderDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addPurchaseOrderDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: Date.now(),
        product_code: null,
        product_id: null,
        description: null,
        stock_quantity: null,
        quantity: null,
        unit_id: null,
        supplier_id: null,
        cost_price: null,
        markup: "0",
        rate: null,
        amount: null,
        discount_percent: "0",
        gross_amount: null,
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

      const detail = state.purchaseOrderDetails[index];
      const newDetail = {
        ...detail,
        id: Date.now(),
      };

      state.purchaseOrderDetails.splice(index + 1, 0, newDetail);
    },

    removePurchaseOrderDetail: (state, action) => {
      state.purchaseOrderDetails = state.purchaseOrderDetails.filter(
        (item) => item.id !== action.payload
      );
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
      detail[key] = value;

      if (key !== "rate" && detail.cost_price && detail.markup) {
        detail.rate = roundUpto(
          +detail.cost_price * (+detail.markup / 100) + +detail.cost_price
        );
      }

      if (detail.quantity && detail.rate) {
        detail.amount = roundUpto(+detail.quantity * +detail.rate);
      } else {
        detail.amount = "";
      }

      if (detail.discount_percent && detail.amount) {
        detail.discount_amount = roundUpto(
          +detail.amount * (+detail.discount_percent / 100)
        );
      } else {
        detail.discount_amount = "";
      }

      if (detail.amount) {
        detail.gross_amount =
          roundUpto(+detail.amount - +detail.discount_amount) || 0;
      } else {
        detail.gross_amount = "";
      }
    },

    setRebatePercentage: (state, action) => {
      state.rebatePercentage = action.payload;
    },

    setSalesmanPercentage: (state, action) => {
      state.salesmanPercentage = action.payload;
    },
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
        total_pages: rest.last_page,
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
        document_type_id: data.document_type_id,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        imo: data.vessel ? data.vessel.imo : null,
        internal_notes: data.internal_notes,
        salesman_id: data.salesman
          ? {
              value: data.salesman.salesman_id,
              label: data.salesman.name,
            }
          : null,
        event_id: data.event
          ? {
              value: data.event.event_id,
              label: data.event.event_code,
            }
          : null,
        vessel_id: data.vessel
          ? {
              value: data.vessel.vessel_id,
              label: data.vessel.name,
            }
          : null,
        customer_id: data.customer
          ? {
              value: data.customer.customer_id,
              label: data.customer.name,
            }
          : null,
        class1_id: data.class1
          ? {
              value: data.class1.class_id,
              label: data.class1.name,
            }
          : null,
        class2_id: data.class2
          ? {
              value: data.class2.class_id,
              label: data.class2.name,
            }
          : null,
        flag_id: data.flag
          ? {
              value: data.flag.flag_id,
              label: data.flag.name,
            }
          : null,
        person_incharge_id: data.person_incharge
          ? {
              value: data.person_incharge.user_id,
              label: data.person_incharge.user_name,
            }
          : null,
        validity_id: data.validity
          ? {
              value: data.validity.validity_id,
              label: data.validity.name,
            }
          : null,
        payment_id: data.payment
          ? {
              value: data.payment.payment_id,
              label: data.payment.name,
            }
          : null,
        customer_ref: data.customer_ref,
        due_date: data.due_date ? dayjs(data.due_date) : null,
        attn: data.attn,
        delivery: data.delivery,
        inclosure: data.inclosure,
        port_id: data.port
          ? {
              value: data.port.port_id,
              label: data.port.name,
            }
          : null,
        term_id: data.term_id || null,
        term_desc: data.term_desc,
      };

      if (!data.quotation_detail) return;

      state.purchaseOrderDetails = data.quotation_detail.map((detail) => ({
        id: detail.quotation_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.name }
          : null,
        description: detail.description,
        quantity: detail.quantity,
        unit_id: detail.unit
          ? { value: detail.unit.unit_id, label: detail.unit.name }
          : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null,
        cost_price: detail.cost_price,
        markup: detail.markup,
        rate: detail.rate,
        amount: detail.amount,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_amount,
        gross_amount: detail.gross_amount,
      }));

      state.rebatePercentage = data.rebate_percent;
      state.salesmanPercentage = data.salesman_percent;
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
  },
});

export const {
  setPurchaseOrderListParams,
  setPurchaseOrderDeleteIDs,
  addPurchaseOrderDetail,
  removePurchaseOrderDetail,
  copyPurchaseOrderDetail,
  changePurchaseOrderDetailOrder,
  changePurchaseOrderDetailValue,
  setRebatePercentage,
  setSalesmanPercentage,
} = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
