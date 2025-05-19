import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getPurchaseReturnList = createAsyncThunk(
  'purchaseReturn/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/purchase-return', {
        params
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getPickListListDetail = createAsyncThunk(
  'picklist/detail',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/picklist/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const returnPurchaseOrder = createAsyncThunk(
  'picklist/detailPost',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/purchase-return', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const initialState = {
  isListLoading: false,
  list: [],
  pickListOpenModalId: null,
  initialFormValues: null,
  pickListDetail: [],
  pickListReceives: null,
  isPickListReceivesLoading: false,
  isPickListReceivesSaving: false,
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    sort_direction: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const pickListSlice = createSlice({
  name: 'purchaseReturn',
  initialState,
  reducers: {
    setPickListListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setPickListOpenModalId: (state, action) => {
      state.pickListOpenModalId = action.payload;

      if (!action.payload) {
        state.pickListReceives = null;
      }
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getPurchaseReturnList.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getPurchaseReturnList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getPurchaseReturnList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(getPickListListDetail.pending, (state) => {
      state.isListLoading = true;
    });
    addCase(getPickListListDetail.fulfilled, (state, action) => {
      state.isListLoading = false;
      const data = action.payload;
      console.log('data', data)
      state.initialFormValues = {
        document_date: data?.document_date,
        customer_po_no: data?.charge_order?.customer_po_no,
        ref_document_identity: data?.charge_order?.ref_document_identity,
        salesman: data?.charge_order?.salesman?.name,
        event_id: data?.charge_order?.event?.event_name ? data?.charge_order?.event?.event_name : data?.charge_order?.event?.event_code ? data?.charge_order?.event?.event_code : null,
        vessel_id: data?.charge_order?.vessel?.name,
        charger_order_id: data?.charge_order?.document_identity,
        customer: data?.charge_order?.customer?.name,
        port_id: data?.charge_order?.port?.name,
        billing_address: data?.charge_order?.vessel?.billing_address,
      }

      state.pickListDetail = data.picklist_detail.map((detail) => ({
        id: detail?.picklist_detail_id,
        picklist_id: detail?.picklist_id,
        sr: detail?.sort_order + 1,
        product_type: detail?.product?.product_type?.name,
        product_name: detail?.product?.name,
        product_description: detail?.product?.name,
        quantity: detail?.quantity,
        cost_price: detail?.product?.cost_price,
        sale_price: detail?.product?.sale_price,
      }))
    });
    addCase(getPickListListDetail.rejected, (state) => {
      state.isListLoading = false;
    });
  }
});

export const { setPickListListParams, setPickListOpenModalId } = pickListSlice.actions;
export default pickListSlice.reducer;