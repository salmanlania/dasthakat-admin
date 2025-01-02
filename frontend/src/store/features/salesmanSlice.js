import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getSalesmanList = createAsyncThunk(
  "salesman/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/salesman", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getSalesman = createAsyncThunk(
  "salesman/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/salesman/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteSalesman = createAsyncThunk(
  "salesman/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/salesman/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createSalesman = createAsyncThunk(
  "salesman/create",
  async (data, { rejectWithValue }) => {
    try {
      await api.post("/salesman", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateSalesman = createAsyncThunk(
  "salesman/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/salesman/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteSalesman = createAsyncThunk(
  "salesman/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/salesman/bulk-delete", {
        salesman_ids: ids,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  isSubmitting: false,
  isBulkDeleting: false,
  isItemLoading: false,
  list: [],
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

export const salesmanSlice = createSlice({
  name: "salesman",
  initialState,
  reducers: {
    setSalesmanListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload,
      };
    },

    setSalesmanDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addNewSalesman: (state) => {
      const ifAlreadyNew = state.list.some(
        (item) => item.salesman_id === "new"
      );
      if (ifAlreadyNew) return;

      state.list = state.list.map((item) => {
        return {
          ...item,
          editable: false,
        };
      });

      state.list.unshift({
        salesman_id: "new",
        name: "",
        commission_percentage: "",
        editable: true,
        created_at: null,
      });
    },

    removeNewSalesman: (state) => {
      state.list = state.list.filter((item) => item.salesman_id !== "new");
    },

    setSalesmanEditable: (state, action) => {
      const { id, editable } = action.payload;

      // if record is new then simply update editable field for this item
      if (id === "new") {
        state.list = state.list.map((item) => ({
          ...item,
          editable,
        }));
        return;
      }

      // Filter out items with salesman_id as "new"
      state.list = state.list.filter((item) => item.salesman_id !== "new");

      // Update the list
      state.list = state.list.map((item) => {
        if (item.salesman_id === id) {
          return item.editable
            ? {
                ...item.prevRecord,
                editable: false,
              }
            : {
                ...item,
                editable: true,
                prevRecord: { ...item },
              };
        }

        // If any other item is editable, reset it
        return item.editable
          ? { ...item.prevRecord, editable: false }
          : { ...item, editable: false };
      });
    },

    updateSalesmanListValue: (state, action) => {
      const { id, field, value } = action.payload;
      state.list = state.list.map((item) => {
        if (item.salesman_id === id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getSalesmanList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getSalesmanList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getSalesmanList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createSalesman.pending, (state) => {
      state.isSubmitting = "new";
    });
    addCase(createSalesman.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(createSalesman.rejected, (state) => {
      state.isSubmitting = false;
      state.list = state.list.filter((item) => item.salesman_id !== "new");
    });

    addCase(updateSalesman.pending, (state, action) => {
      state.isSubmitting = action.meta.arg.id;
    });
    addCase(updateSalesman.fulfilled, (state) => {
      state.isSubmitting = false;
    });
    addCase(updateSalesman.rejected, (state) => {
      state.isSubmitting = false;
    });

    addCase(bulkDeleteSalesman.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteSalesman.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteSalesman.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  },
});

export const {
  setSalesmanListParams,
  setSalesmanDeleteIDs,
  addNewSalesman,
  removeNewSalesman,
  setSalesmanEditable,
  updateSalesmanListValue,
} = salesmanSlice.actions;
export default salesmanSlice.reducer;
