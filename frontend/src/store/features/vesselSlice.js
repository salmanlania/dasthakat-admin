import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getVesselList = createAsyncThunk(
  "vessel/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/vessel", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteVessel = createAsyncThunk(
  "vessel/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/vessel/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createVessel = createAsyncThunk(
  "vessel/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/vessel", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getVessel = createAsyncThunk(
  "vessel/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/vessel/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateVessel = createAsyncThunk(
  "vessel/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/vessel/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteVessel = createAsyncThunk(
  "vessel/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/vessel/bulk-delete", {
        vessel_ids: ids,
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

export const vesselSlice = createSlice({
  name: "vessel",
  initialState,
  reducers: {
    setVesselListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setVesselDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getVesselList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getVesselList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getVesselList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createVessel.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createVessel.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createVessel.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getVessel.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getVessel.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      console.log(data);

      state.initialFormValues = {
        imo: data.imo,
        name: data.name,
        flag_id: data.flag_id
          ? {
              value: data.flag_id,
              label: data.flag_name,
            }
          : null,
        class1_id: data.class1_id
          ? {
              value: data.class1_id,
              label: data.class1_name,
            }
          : null,
        class2_id: data.class2_id
          ? {
              value: data.class2_id,
              label: data.class2_name,
            }
          : null,
      };
    });
    addCase(getVessel.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateVessel.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateVessel.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateVessel.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteVessel.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteVessel.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteVessel.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const { setVesselListParams, setVesselDeleteIDs } = vesselSlice.actions;
export default vesselSlice.reducer;
