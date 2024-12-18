import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getVendorList = createAsyncThunk(
  "supplier/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/supplier", {
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

export const deleteVendor = createAsyncThunk(
  "supplier/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/supplier/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createVendor = createAsyncThunk(
  "supplier/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/supplier", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getVendor = createAsyncThunk(
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

export const updateVendor = createAsyncThunk(
  "supplier/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/supplier/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteVendor = createAsyncThunk(
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

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendorListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setVendorDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getVendorList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getVendorList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getVendorList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createVendor.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createVendor.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createVendor.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getVendor.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getVendor.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

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
    addCase(getVendor.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateVendor.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateVendor.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateVendor.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteVendor.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteVendor.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteVendor.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const { setVendorListParams, setVendorDeleteIDs } = vendorSlice.actions;
export default vendorSlice.reducer;
