import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getCurrencyList = createAsyncThunk(
  "currency/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/currency", {
        params: {
          ...params,
          all: 1,
        },
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteCurrency = createAsyncThunk(
  "currency/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/currency/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createCurrency = createAsyncThunk(
  "currency/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/currency", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getCurrency = createAsyncThunk(
  "currency/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/currency/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateCurrency = createAsyncThunk(
  "currency/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/currency/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteCurrency = createAsyncThunk(
  "currency/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/currency/bulk-delete", {
        currency_ids: ids,
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
  params: {
    page: 1,
    limit: 50,
    search: "",
    sort_column: null,
    sort_direction: null,
    name: null,
    description: null,
    catering_type: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrencyListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setCurrencyDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getCurrencyList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getCurrencyList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getCurrencyList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createCurrency.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createCurrency.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createCurrency.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getCurrency.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCurrency.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        currency_code: data.currency_code,
        name: data.name,
        symbol_left: data.symbol_left,
        symbol_right: data.symbol_right,
        value: data.value ? data.value + "" : "",
        status: data.status,
      };
    });
    addCase(getCurrency.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateCurrency.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateCurrency.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateCurrency.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteCurrency.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteCurrency.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteCurrency.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const { setCurrencyListParams, setCurrencyDeleteIDs } =
  currencySlice.actions;
export default currencySlice.reducer;
