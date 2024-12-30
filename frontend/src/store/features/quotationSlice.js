import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import api from "../../axiosInstance";
import { roundUpto } from "../../utils/number";

export const getQuotationList = createAsyncThunk(
  "quotation/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/quotation", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteQuotation = createAsyncThunk(
  "quotation/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quotation/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createQuotation = createAsyncThunk(
  "quotation/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/quotation", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getQuotation = createAsyncThunk(
  "quotation/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/quotation/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateQuotation = createAsyncThunk(
  "quotation/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/quotation/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteQuotation = createAsyncThunk(
  "quotation/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/quotation/bulk-delete", {
        quotation_ids: ids,
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
  quotationDetails: [],
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

export const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    setQuotationListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setQuotationDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addQuotationDetail: (state, action) => {
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
        state.quotationDetails.splice(index + 1, 0, newDetail);
      } else {
        state.quotationDetails.push(newDetail);
      }
    },

    copyQuotationDetail: (state, action) => {
      const index = action.payload;

      const detail = state.quotationDetails[index];
      const newDetail = {
        ...detail,
        id: Date.now(),
      };

      state.quotationDetails.splice(index + 1, 0, newDetail);
    },

    removeQuotationDetail: (state, action) => {
      state.quotationDetails = state.quotationDetails.filter(
        (item) => item.id !== action.payload
      );
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeQuotationDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.quotationDetails[from];
      state.quotationDetails[from] = state.quotationDetails[to];
      state.quotationDetails[to] = temp;
    },

    changeQuotationDetailValue: (state, action) => {
      const { index, key, value } = action.payload;
      const detail = state.quotationDetails[index];
      detail[key] = value;

      if (key !== "rate" && detail.cost_price && detail.markup) {
        console.log(
          roundUpto(
            +detail.cost_price * (+detail.markup / 100) + +detail.cost_price
          )
        );
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
    addCase(getQuotationList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.quotationDetails = [];
    });
    addCase(getQuotationList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getQuotationList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createQuotation.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createQuotation.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createQuotation.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getQuotation.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getQuotation.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        imo: data.imo,
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
              value: data.class1.class1_id,
              label: data.class1.name,
            }
          : null,
        class2_id: data.class2
          ? {
              value: data.class2.class2_id,
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

      state.quotationDetails = data.quotation_detail.map((detail) => ({
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
    addCase(getQuotation.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(updateQuotation.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateQuotation.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });
    addCase(updateQuotation.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteQuotation.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteQuotation.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteQuotation.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setQuotationListParams,
  setQuotationDeleteIDs,
  addQuotationDetail,
  removeQuotationDetail,
  copyQuotationDetail,
  changeQuotationDetailOrder,
  changeQuotationDetailValue,
  setRebatePercentage,
  setSalesmanPercentage,
} = quotationSlice.actions;
export default quotationSlice.reducer;
