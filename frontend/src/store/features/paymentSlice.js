import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getPaymentList = createAsyncThunk(
  "payment/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/payment", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deletePayment = createAsyncThunk(
  "payment/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/payment/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createPayment = createAsyncThunk(
  "payment/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/payment", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPayment = createAsyncThunk(
  "payment/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payment/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updatePayment = createAsyncThunk(
  "payment/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/payment/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeletePayment = createAsyncThunk(
  "payment/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/payment/bulk-delete", {
        payment_ids: ids,
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
  list: [
    {
      key: "1",
      payment_id: "1",
      name: "30 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "2",
      payment_id: "2",
      name: "60 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "3",
      payment_id: "3",
      name: "90 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "4",
      payment_id: "4",
      name: "120 Days",
      created_at: "01-01-2023 10:00 AM",
    },
    {
      key: "5",
      payment_id: "5",
      name: "180 Days",
      created_at: "01-01-2023 10:00 AM",
    },
  ],
  deleteIDs: [],
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

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setPaymentDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewPayment: (state) => {
      state.list.unshift({
        key: "new",
        payment_id: "new",
        name: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewPayment: (state) => {
      state.list = state.list.filter((item) => item.key !== "new");
    },

    setPaymentEditable: (state, action) => {
      state.list = state.list.map((item) => {
        if (item.key === action.payload.key) {
          return {
            ...item,
            editable: action.payload.editable,
          };
        }
        return item;
      });
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getPaymentList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getPaymentList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getPaymentList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createPayment.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createPayment.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createPayment.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getPayment.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getPayment.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      console.log(data);

      state.initialFormValues = {};
    });
    addCase(getPayment.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updatePayment.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updatePayment.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updatePayment.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeletePayment.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeletePayment.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeletePayment.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setPaymentListParams,
  setPaymentDeleteIDs,
  addNewPayment,
  removeNewPayment,
  setPaymentEditable,
} = paymentSlice.actions;
export default paymentSlice.reducer;
