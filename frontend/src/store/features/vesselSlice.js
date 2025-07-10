import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';
import { v4 as uuidv4 } from 'uuid';

export const getVesselList = createAsyncThunk(
  'vessel/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/vessel', {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteVessel = createAsyncThunk('vessel/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/vessel/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createVessel = createAsyncThunk('vessel/create', async (data, { rejectWithValue }) => {
  try {
    await api.post('/vessel', data);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getVessel = createAsyncThunk('vessel/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/vessel/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateVessel = createAsyncThunk(
  'vessel/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/vessel/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateVesselAgent = createAsyncThunk(
  'vessel-agent/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/vessel/${id}/commission-agents`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const bulkDeleteVessel = createAsyncThunk(
  'vessel/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/vessel/bulk-delete', {
        vessel_ids: ids,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  isBulkDeleting: false,
  initialFormValues: null,
  isItemLoading: false,
  list: [],
  deleteIDs: [],
  commissionDetails: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
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
  name: 'vessel',
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

    addCommissionDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        commission_type: null,
        commission_agent: null,
        commission_percentage: null,
        status: 'Active',
        row_status: 'I',
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.commissionDetails.splice(index + 1, 0, newDetail);
      } else {
        state.commissionDetails.push(newDetail);
      }
    },

    copyCommissionDetail: (state, action) => {
      const index = action.payload;

      const detail = state.commissionDetails[index];
      const newDetail = {
        ...detail,
        id: uuidv4(),
        row_status: 'I',
        isDeleted: false,
      };

      state.commissionDetails.splice(index + 1, 0, newDetail);
    },

    removeCommissionDetail: (state, action) => {
      const itemIndex = state.commissionDetails.findIndex((item) => item.id === action.payload);

      if (itemIndex !== -1) {
        if (state.commissionDetails[itemIndex].row_status === 'I') {
          state.commissionDetails = state.commissionDetails.filter(
            (item) => item.id !== action.payload,
          );
        } else {
          state.commissionDetails[itemIndex].row_status = 'D';
          state.commissionDetails[itemIndex].isDeleted = true;
        }
      }
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeCommissionDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.commissionDetails[from];
      state.commissionDetails[from] = state.commissionDetails[to];
      state.commissionDetails[to] = temp;
    },

    changeCommissionDetailValue: (state, action) => {
      const { index, key, value } = action.payload;

      const detail = state.commissionDetails[index];

      if (detail.row_status === 'U' && detail[key] !== value) {
        detail.row_status = 'U';
      }

      detail[key] = value;
    },

    resetCommissionDetails: (state) => {
      state.commissionDetails = [];
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

      state.initialFormValues = {
        imo: data.imo,
        name: data.name,
        billing_address: data.billing_address,
        block_status: data.block_status,
        customer_id: data.customer_id
          ? {
            value: data.customer_id,
            label: data.customer_name,
          }
          : null,
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

      if (!data.vessel_commission_agent) return;
      if (Array.isArray(data.vessel_commission_agent)) {
        state.commissionDetails = data.vessel_commission_agent.map((detail) => ({
          id: detail.vessel_commission_agent_id,
          commission_agent_id: detail.commission_agent
            ? {
              value: detail.commission_agent.commission_agent_id,
              label: detail.commission_agent.name,
            }
            : null,
          type: detail.type,
          commission_percentage: detail.commission_percentage,
          status: detail.status,
          row_status: 'U',
          isDeleted: false,
        }));
      }
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

export const {
  setVesselListParams,
  setVesselDeleteIDs,
  addCommissionDetail,
  copyCommissionDetail,
  removeCommissionDetail,
  changeCommissionDetailOrder,
  changeCommissionDetailValue,
  resetCommissionDetails,
} = vesselSlice.actions;
export default vesselSlice.reducer;
