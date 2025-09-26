import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { roundUpto } from '../../utils/number';
import { v4 as uuidv4 } from 'uuid';

export const getChargeOrderList = createAsyncThunk(
  'chargeOrder/list',
  async (params, { rejectWithValue }) => {
    try {
      let apiParams = { ...params };
      if (apiParams.event_id && typeof apiParams.event_id === 'object' && apiParams.event_id !== null) {
        apiParams.event_id = apiParams.event_id.value;
      }
      const res = await api.get('/charge-order', {
        params: apiParams
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteChargeOrder = createAsyncThunk(
  'chargeOrder/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/charge-order/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createChargeOrder = createAsyncThunk(
  'chargeOrder/create',
  async ({ data }, { rejectWithValue }) => {
    try {
      return await api.post('/charge-order', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const cancelledChargeOrder = createAsyncThunk(
  'chargeOrder/cancel',
  async (id, { rejectWithValue }) => {
    try {
      return await api.post('/charge-order/actions', {
        id,
        is_deleted: true,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const temporaryServiceOrder = createAsyncThunk(
  'temporary/service_order',
  async ({ data }, { rejectWithValue }) => {
    try {
      return await api.post('/service_order', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getChargeOrder = createAsyncThunk(
  'chargeOrder/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/charge-order/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const printProformaInvoicePrint = createAsyncThunk(
  'proforma-invoice/print',
  async (id, { rejectWithValue }) => {

    try {
      const response = await api.get("charge-order/print/" + id);

      console.log('response', response);
      const byteCharacters = atob(response?.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
)

export const getChargeOrderVendorWise = createAsyncThunk(
  'chargeOrder/getDetailsVenderWise',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/charge-order/${id}/vendor-wise-details`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const updateChargeOrder = createAsyncThunk(
  'chargeOrder/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/charge-order/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createChargeOrderPO = createAsyncThunk(
  'chargeOrder/PO',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.post(`charge-order/${id}/purchase-orders`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createChargeOrderPickList = createAsyncThunk(
  'chargeOrder/PickList',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/picklist', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const createChargeOrderServiceList = createAsyncThunk(
  'chargeOrder/ServiceList',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/servicelist', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteChargeOrder = createAsyncThunk(
  'chargeOrder/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/charge-order/bulk-delete', {
        charge_order_ids: ids
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const viewBeforeCreate = createAsyncThunk(
  'tempList/view-before-create',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/service_order/view-before-create', {
        params
      });
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const chargeOrderAnalysis = createAsyncThunk(
  'charger-order/analysis',
  async (id, { rejectWithValue }) => {
    const newId = id.charge_order_id
    try {
      const res = await api.get(`/charge-order/${newId}/analysis`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

//vendor


export const getVendorCharge = createAsyncThunk('vendor-charge/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/vendor-platform/charge-order/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const postVendorChargeSelection = createAsyncThunk(
  'vendor-charge/postSelection',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(`/vendor-platform/charge-order/`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const postChargeRfq = createAsyncThunk(
  'rfg-charge/postSelection',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(`/vendor-platform/charge-order/rfq`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {

  // Meta state
  isListLoading: false,
  isFormSubmitting: false,
  isBulkDeleting: false,
  isTempDataLoading: false,
  isAnalysisLoading: false,
  isItemLoading: false,

  // IDs and references
  initialFormValues: null,
  tempChargeOrderID: null,
  analysisChargeOrderID: null,
  chargeQuotationID: null,

  // Entities (normalized structure)
  tempChargeDetails: [],
  chargeOrderDetailId: null,
  analysisChargeDetails: [],
  isItemVendorChargeLoading: false,
  list: [],
  deleteIDs: [],
  isVendorChargeModalOpen: false,
  rebatePercentage: null,
  salesmanPercentage: null,
  chargeOrderDetails: [],
  commissionAgentData: [],
  vendorChargeDetails: [],
  vendorDetails: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    event_id: null,
    sort_direction: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const chargeOrderSlice = createSlice({
  name: 'chargeOrder',
  initialState,
  reducers: {
    setChargeQuotationID: (state, action) => {
      state.chargeQuotationID = action.payload;
    },

    setTempChargeOrderID: (state, action) => {
      state.tempChargeOrderID = action.payload;
    },

    setAnalysisChargeOrderID: (state, action) => {
      state.analysisChargeOrderID = action.payload;
    },

    setViewChargeOrderID: (state, action) => {
      state.tempChargeOrderID = action.payload;
    },

    setChargeOrderListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setVendorChargeModalOpen: (state, action) => {
      state.isVendorChargeModalOpen = action.payload;
    },

    setChargeOrderDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addChargeOrderDetail: (state, action) => {
      const index = action.payload;
      const newDetail = {
        id: uuidv4(),
        product_code: null,
        product_id: null,
        product_nature: null,
        description: null,
        stock_quantity: null,
        quantity: null,
        unit_id: null,
        supplier_id: null,
        row_status: 'I'
      };

      if (index || index === 0) {
        state.chargeOrderDetails.splice(index + 1, 0, newDetail);
      } else {
        state.chargeOrderDetails.push(newDetail);
      }
    },

    copyChargeOrderDetail: (state, action) => {
      const index = action.payload;

      const { editable, purchase_order_id, purchase_order_detail_id, ...detail } =
        state.chargeOrderDetails[index];
      const newDetail = {
        ...detail,
        purchase_order_id: null,
        purchase_order_detail_id: null,
        quotation_detail_id: null,
        picklist_id: null,
        picklist_detail_id: null,
        servicelist_id: null,
        servicelist_detail_id: null,
        job_order_id: null,
        job_order_detail_id: null,
        shipment_id: null,
        shipment_detail_id: null,
        id: uuidv4(),
        row_status: 'I',
        isDeleted: false
      };

      state.chargeOrderDetails.splice(index + 1, 0, newDetail);
    },

    setTotalCommissionAmount: (state, action) => {
      state.totalCommissionAmount = action.payload;
    },

    removeChargeOrderDetail: (state, action) => {
      const itemIndex = state.chargeOrderDetails.findIndex(item => item.id === action.payload);

      if (itemIndex !== -1) {
        if (state.chargeOrderDetails[itemIndex].row_status === 'I') {
          state.chargeOrderDetails = state.chargeOrderDetails.filter((item) => item.id !== action.payload);
        } else {
          state.chargeOrderDetails[itemIndex].row_status = 'D';
          state.chargeOrderDetails[itemIndex].isDeleted = true;
        }
      }
    },

    resetChargeOrderDetail: (state, action) => {
      const index = action.payload;

      state.chargeOrderDetails[index] = {
        id: state.chargeOrderDetails[index].id,
        product_code: null,
        product_id: null,
        description: null,
        stock_quantity: null,
        quantity: null,
        unit_id: null,
        supplier_id: null,
        cost_price: null,
        markup: '0',
        amount: null,
        discount_percent: '0',
        gross_amount: null,
        row_status: state.chargeOrderDetails[index].row_status === 'U' ? 'U' : state.chargeOrderDetails[index].row_status
      };
    },

    setRebatePercentage: (state, action) => {
      state.rebatePercentage = action.payload;
    },

    setSalesmanPercentage: (state, action) => {
      state.salesmanPercentage = action.payload;
    },

    // Change the order of chargeOrder details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeChargeOrderDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.chargeOrderDetails[from];
      state.chargeOrderDetails[from] = state.chargeOrderDetails[to];
      state.chargeOrderDetails[to] = temp;
    },

    // changeChargeOrderDetailValue: (state, action) => {
    //   const { index, key, value } = action.payload;
    //   const detail = state.chargeOrderDetails[index];

    //   if (
    //     detail.row_status === 'U' &&
    //     detail[key] !== value
    //   ) {
    //     detail.row_status = 'U';
    //   }

    //   detail[key] = value;

    //   const productType = detail.product_type_id;

    //   if (
    //     productType?.label !== 'Service' &&
    //     !['rate', 'supplier_id', 'vendor_part_no', 'unit_id'].includes(key) &&
    //     detail.cost_price &&
    //     detail.markup
    //   ) {
    //     detail.rate = roundUpto(+detail.cost_price * (+detail.markup / 100) + +detail.cost_price);
    //     detail.full_rate = (+detail.cost_price * (+detail.markup / 100) + +detail.cost_price);
    //     detail.old_rate = roundUpto(+detail.cost_price * (+detail.markup / 100) + +detail.cost_price);
    //   }

    //   if (detail.quantity && detail.rate) {
    //     detail.amount = roundUpto(+detail.quantity * +detail.rate);

    //     if (key === 'rate' && +detail.cost_price && +detail.rate) {
    //       if (detail.old_rate != detail.rate) {
    //         detail.markup = roundUpto(
    //           ((+detail.rate - +detail.cost_price) / +detail.cost_price) * 100
    //         );
    //       }
    //     }
    //   } else {
    //     detail.amount = '';
    //   }

    //   if (detail.discount_percent && detail.amount) {
    //     detail.discount_amount = roundUpto(+detail.amount * (+detail.discount_percent / 100));
    //   } else {
    //     detail.discount_amount = '';
    //   }

    //   if (detail.amount) {
    //     detail.gross_amount = roundUpto(+detail.amount - +detail.discount_amount) || 0;
    //   } else {
    //     detail.gross_amount = '';
    //   }
    // },

    changeChargeOrderDetailValue: (state, action) => {
      const { index, key, value } = action.payload;

      const detail = state.chargeOrderDetails[index];

      if (detail.row_status === 'U' && detail[key] !== value) {
        detail.row_status = 'U';
      }

      detail[key] = value;
      const productType = detail.product_type_id;

      if (
        productType?.label !== 'Service' &&
        (key === 'markup' || key === 'cost_price') &&
        detail.cost_price &&
        detail.markup !== null &&
        detail.markup !== undefined
      ) {
        detail.rate = roundUpto(+detail.cost_price * (+detail.markup / 100) + +detail.cost_price);
        detail.full_rate = +detail.cost_price * (+detail.markup / 100) + +detail.cost_price;
        detail.old_rate = roundUpto(
          +detail.cost_price * (+detail.markup / 100) + +detail.cost_price,
        );
      }

      if (detail.quantity && detail.rate) {
        detail.amount = roundUpto(+detail.quantity * +detail.rate);

        if (key === 'rate' && +detail.cost_price && +detail.rate) {
          if (detail.old_rate != detail.rate) {
            detail.markup = roundUpto(
              ((+detail.rate - +detail.cost_price) / +detail.cost_price) * 100,
            );
          }
        }
      } else {
        detail.amount = '';
      }

      if (detail.discount_percent && detail.amount) {
        detail.discount_amount = roundUpto(+detail.amount * (+detail.discount_percent / 100));
      } else {
        detail.discount_amount = '';
      }

      if (detail.amount) {
        detail.gross_amount = roundUpto(+detail.amount - +detail.discount_amount) || 0;
      } else {
        detail.gross_amount = '';
      }
    },

    splitChargeOrderQuantity: (state, action) => {
      const index = action.payload;
      const detail = state.chargeOrderDetails[index];
      const splittedQuantity = parseFloat(detail.quantity) - parseFloat(detail.stock_quantity);

      const row = {
        ...detail,
        quantity: detail.stock_quantity,
        rate: detail.rate,
        full_rate: detail.full_rate,
        old_rate: detail.old_rate,
        cost_price: detail.cost_price,
        markup: detail.markup,
        amount: detail.rate * detail.stock_quantity,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_percent
          ? detail.rate * detail.stock_quantity * (detail.discount_percent / 100)
          : '',
        gross_amount:
          detail.rate * detail.stock_quantity -
          (detail.discount_percent
            ? detail.rate * detail.stock_quantity * (detail.discount_percent / 100)
            : 0)
      };

      const splittedRow = {
        product_type_id: {
          value: 4,
          label: 'Others'
        },
        product_name: detail.product_id?.label,
        product_description: detail.product_description,
        description: detail.description,
        unit_id: detail.unit_id,
        supplier_id: detail.supplier_id,
        quantity: splittedQuantity,
        rate: detail.rate,
        full_rate: detail.full_rate,
        old_rate: detail.old_rate,
        amount: detail.rate * splittedQuantity,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_percent
          ? detail.rate * splittedQuantity * (detail.discount_percent / 100)
          : '',
        gross_amount:
          detail.rate * splittedQuantity -
          (detail.discount_percent
            ? detail.rate * splittedQuantity * (detail.discount_percent / 100)
            : 0),
        id: uuidv4(),
        row_status: 'I',
        cost_price: detail.cost_price,
        markup: detail.markup,
      };

      state.chargeOrderDetails.splice(index, 1, row, splittedRow);
    },

    resetVendorDetails: (state) => {
      state.vendorDetails = [];
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getChargeOrderList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.chargeOrderDetails = [];
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });
    addCase(getChargeOrderList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getChargeOrderList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createChargeOrder.pending, (state, action) => {
      const additionalRequest = action.meta.arg?.additionalRequest || false;
      state.isFormSubmitting = additionalRequest || true;
    });
    addCase(createChargeOrder.fulfilled, (state, action) => {
      state.chargeOrderDetailId = action?.payload?.data?.data?.charge_order_id
      state.isFormSubmitting = false;
    });
    addCase(createChargeOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(temporaryServiceOrder.pending, (state, action) => {
      const additionalRequest = action.meta.arg?.additionalRequest || false;
      state.isFormSubmitting = additionalRequest || true;
    });
    addCase(temporaryServiceOrder.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(temporaryServiceOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getChargeOrder.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getChargeOrder.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        charge_order_id: data?.charge_order_id,
        is_deleted: data?.is_deleted,
        document_identity: data.document_identity,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        customer_po_no: data.customer_po_no,
        ref_document_identity: data.ref_document_identity,
        remarks: data.remarks,
        technician_id:
          data.technicians && data.technicians.length
            ? data.technicians.map((technician) => ({
              value: technician.user_id,
              label: technician.user_name
            }))
            : null,
        agent_notes: data.agent_notes,
        technician_notes: data.technician_notes,
        agent_id: data.agent
          ? {
            value: data.agent.agent_id,
            label: data.agent.name
          }
          : null,
        salesman_id: data.salesman
          ? {
            value: data.salesman.salesman_id,
            label: data.salesman.name
          }
          : null,
        event_id: data.event
          ? {
            value: data.event.event_id,
            label: data.event.event_name
          }
          : null,
        vessel_id: data.vessel
          ? {
            value: data.vessel.vessel_id,
            label: data.vessel.name
          }
          : null,
        customer_id: data.customer
          ? {
            value: data.customer.customer_id,
            label: data.customer.name
          }
          : null,
        class1_id: data.class1
          ? {
            value: data.class1.class_id,
            label: data.class1.name
          }
          : null,
        class2_id: data.class2
          ? {
            value: data.class2.class_id,
            label: data.class2.name
          }
          : null,
        port_id: data?.port
          ? { value: data?.port?.port_id, label: data?.port?.name }
          : data?.port_id || null,
        flag_id: data.flag
          ? {
            value: data.flag.flag_id,
            label: data.flag.name
          }
          : null,
        total_amount: data?.total_amount
      };

      state.commissionAgentData = Array.isArray(data?.commission_agent)
        ? data?.commission_agent.map((detail) => ({
          name: detail?.name ? detail.name : null,
          commission_percentage: detail?.percentage ? detail.percentage : null,
          amount: detail?.amount ? detail.amount : null,
          row_status: 'U',
          isDeleted: false,
          commission_agent_id: detail?.commission_agent_id ? detail.commission_agent_id : null,
        }))
        : [];

      state.chargeOrderDetails = data?.charge_order_detail.map((detail) => ({
        id: detail.charge_order_detail_id,
        purchase_order_id: detail.purchase_order_id,
        purchase_order_detail_id: detail.purchase_order_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        product_type_id: detail.product_type
          ? {
            value: detail.product_type.product_type_id,
            label: detail.product_type.name
          }
          : null,
        product_name: detail.product_name.trim(),
        product_description: detail?.product_description ? detail?.product_description.trim() : null,
        description: detail?.description ? detail?.description : null,
        internal_notes: detail?.internal_notes ? detail?.internal_notes : null,
        technician_notes: detail?.technician_notes ? detail?.technician_notes : null,
        agent_notes: detail?.agent_notes ? detail?.agent_notes : null,
        vendor_notes: detail?.vendor_notes ? detail?.vendor_notes : null,
        quotation_detail_id: detail.quotation_detail_id || null,
        picklist_id: detail.picklist_id || null,
        picklist_detail_id: detail.picklist_detail_id || null,
        servicelist_id: detail.servicelist_id || null,
        servicelist_detail_id: detail.servicelist_detail_id || null,
        job_order_id: detail.job_order_id || null,
        job_order_detail_id: detail.job_order_detail_id || null,
        shipment_id: detail.shipment_id || null,
        shipment_detail_id: detail.shipment_detail_id || null,
        stock_quantity: detail?.product?.stock?.quantity
          ? parseFloat(detail.product.stock.quantity)
          : 0,
        quantity: detail.quantity ? detail.quantity : null,
        picked_quantity: detail.picked_quantity ? parseFloat(detail.picked_quantity) : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null,
        vendor_part_no: detail.vendor_part_no,
        markup: detail.markup,
        cost_price: detail.cost_price,
        rate: detail.rate !== undefined ? parseFloat(detail.rate) : null,
        amount: detail.amount,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_amount,
        gross_amount: detail.gross_amount,
        editable: detail.editable,
        purchase_order_exists: detail?.purchase_order_exists,
        row_status: 'U',
        isDeleted: false
      }));

      state.vendorChargeDetails = data?.charge_order_detail.map((detail) => ({
        id: detail.charge_order_detail_id,
        vendor_charge_order_detail_id: detail?.vendor_charge_order_detail_id ? detail?.vendor_charge_order_detail_id : null,
        charge_order_detail_id: detail?.charge_order_detail_id,
        purchase_order_id: detail.purchase_order_id,
        purchase_order_detail_id: detail.purchase_order_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        product_type_id: detail.product_type
          ? {
            value: detail.product_type.product_type_id,
            label: detail.product_type.name
          }
          : null,
        product_name: detail.product_name.trim(),
        product_description: detail?.product_description ? detail?.product_description.trim() : null,
        description: detail?.description ? detail?.description : null,
        internal_notes: detail?.internal_notes ? detail?.internal_notes : null,
        technician_notes: detail?.technician_notes ? detail?.technician_notes : null,
        agent_notes: detail?.agent_notes ? detail?.agent_notes : null,
        vendor_notes: detail?.vendor_notes ? detail?.vendor_notes : null,
        quotation_detail_id: detail.quotation_detail_id || null,
        picklist_id: detail.picklist_id || null,
        picklist_detail_id: detail.picklist_detail_id || null,
        servicelist_id: detail.servicelist_id || null,
        servicelist_detail_id: detail.servicelist_detail_id || null,
        job_order_id: detail.job_order_id || null,
        job_order_detail_id: detail.job_order_detail_id || null,
        shipment_id: detail.shipment_id || null,
        shipment_detail_id: detail.shipment_detail_id || null,
        stock_quantity: detail?.product?.stock?.quantity
          ? parseFloat(detail.product.stock.quantity)
          : 0,
        quantity: detail.quantity ? detail.quantity : null,
        picked_quantity: detail.picked_quantity ? parseFloat(detail.picked_quantity) : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null,
        vendor_part_no: detail.vendor_part_no,
        markup: detail.markup,
        cost_price: detail.cost_price,
        rate: detail.rate !== undefined ? parseFloat(detail.rate) : null,
        amount: detail.amount,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_amount,
        gross_amount: detail.gross_amount,
        editable: detail.editable,
        purchase_order_exists: detail?.purchase_order_exists,
        row_status: 'U',
        isDeleted: false
      }));

      state.rebatePercentage = data?.rebate_percent ? data?.rebate_percent : 0;
      state.salesmanPercentage = data?.salesman_percent
        ? data?.salesman_percent
        : data?.commission_percentage
          ? data?.commission_percentage
          : 0;
    });
    addCase(getChargeOrder.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(getVendorCharge.pending, (state) => {
      state.isItemVendorChargeLoading = true;
    });

    addCase(getVendorCharge.fulfilled, (state, action) => {
      state.isItemVendorChargeLoading = false;
      const data = action.payload;

      state.vendorDetails = data.map((item) => ({
        charge_order_detail_id: item?.charge_order_detail_id ? item?.charge_order_detail_id : null,
        vendor: item.vendor
          ? { supplier_id: item.vendor.supplier_id, name: item.vendor.name }
          : null,
        vendor_rate: item.vendor_rate,
        vendor_charge_order_detail_id: item?.vendor_charge_order_detail_id ? item?.vendor_charge_order_detail_id : null,
        is_primary_vendor: item.is_primary_vendor,
        rfq: item.rfq,
        rfq_responded: item.rfq_responded,
        vendor_part_no: item.vendor_part_no,
        vendor_notes: item.vendor_notes,
      }));

    });

    addCase(getVendorCharge.rejected, (state) => {
      state.isItemVendorChargeLoading = false;
      state.vendorDetails = null;
    });

    addCase(updateChargeOrder.pending, (state, action) => {
      const additionalRequest = action.meta.arg?.additionalRequest || false;
      state.isFormSubmitting = additionalRequest || true;
    });
    addCase(updateChargeOrder.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.chargeOrderDetails = state.chargeOrderDetails
        .filter(item => item.row_status !== 'D')
        .map(item => ({
          ...item,
          row_status: 'U',
          isDeleted: false
        }));
    });
    addCase(updateChargeOrder.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(createChargeOrderPO.pending, (state) => {
      state.isFormSubmitting = 'CREATE_PO';
    });
    addCase(createChargeOrderPO.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createChargeOrderPO.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(createChargeOrderPickList.pending, (state) => {
      state.isFormSubmitting = 'CREATE_PICK_LIST';
    });
    addCase(createChargeOrderPickList.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(createChargeOrderPickList.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(createChargeOrderServiceList.pending, (state) => {
      state.isFormSubmitting = 'CREATE_SERVICE_LIST';
    });
    addCase(createChargeOrderServiceList.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(createChargeOrderServiceList.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteChargeOrder.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteChargeOrder.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteChargeOrder.rejected, (state) => {
      state.isBulkDeleting = false;
    });

    addCase(viewBeforeCreate.pending, (state) => {
      state.isTempDataLoading = true;
      state.tempChargeDetails = [];
    });
    addCase(viewBeforeCreate.fulfilled, (state, action) => {
      state.isTempDataLoading = false;
      state.tempChargeDetails = action.payload || [];
    });
    addCase(viewBeforeCreate.rejected, (state) => {
      state.isTempDataLoading = false;
    });

    addCase(chargeOrderAnalysis.pending, (state) => {
      state.isAnalysisLoading = true;
      state.analysisChargeDetails = [];
    });
    addCase(chargeOrderAnalysis.fulfilled, (state, action) => {
      state.isAnalysisLoading = false;
      state.analysisChargeDetails = action.payload || [];
    });
    addCase(chargeOrderAnalysis.rejected, (state) => {
      state.isAnalysisLoading = false;
    });
  }
});

export const {
  setRebatePercentage,
  setSalesmanPercentage,
  setTotalCommissionAmount,
  setChargeOrderListParams,
  setChargeOrderDeleteIDs,
  addChargeOrderDetail,
  removeChargeOrderDetail,
  copyChargeOrderDetail,
  resetChargeOrderDetail,
  changeChargeOrderDetailOrder,
  changeChargeOrderDetailValue,
  setChargeQuotationID,
  setTempChargeOrderID,
  setAnalysisChargeOrderID,
  setViewChargeOrderID,
  splitChargeOrderQuantity,
  setVendorChargeModalOpen,
  resetVendorDetails
} = chargeOrderSlice.actions;
export default chargeOrderSlice.reducer;
