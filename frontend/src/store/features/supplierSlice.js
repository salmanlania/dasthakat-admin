import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getSupplierList = createAsyncThunk(
  "supplier/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/supplier", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "supplier/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/supplier/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createSupplier = createAsyncThunk(
  "supplier/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/supplier", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getSupplier = createAsyncThunk(
  "supplier/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/supplier/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "supplier/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/supplier/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteSupplier = createAsyncThunk(
  "supplier/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/supplier/bulk-delete", {
        supplier_ids: ids,
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

export const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSupplierListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setSupplierDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getSupplierList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getSupplierList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getSupplierList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createSupplier.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createSupplier.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createSupplier.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getSupplier.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getSupplier.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      console.log(data);

      state.initialFormValues = {
        supplier_code: data.supplier_code,
        name: data.name,
        location: data.location,
        contact_person: data.contact_person,
        contact1: data.contact1,
        contact2: data.contact2,
        email: data.email,
        address: data.address,
        status: data.status,
      };
    });
    addCase(getSupplier.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateSupplier.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateSupplier.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateSupplier.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteSupplier.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteSupplier.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteSupplier.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const { setSupplierListParams, setSupplierDeleteIDs } =
  supplierSlice.actions;
export default supplierSlice.reducer;
