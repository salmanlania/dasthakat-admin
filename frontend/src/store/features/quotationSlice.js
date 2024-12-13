import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

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
      const newDetail = {
        id: Date.now(),
        product_code: null,
        product_id: null,
        description: null,
        delivery: null,
        stock_quantity: null,
        quantity: null,
        unit_id: null,
        supplier_id: null,
        cost_price: null,
        markup: null,
        rate: null,
        amount: null,
        discount_percent: null,
        gross_amount: null,
      };
      state.quotationDetails.push(newDetail);
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getQuotationList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
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
      console.log(data);
      state.initialFormValues = {};
    });
    addCase(getQuotation.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateQuotation.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateQuotation.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
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
} = quotationSlice.actions;
export default quotationSlice.reducer;
