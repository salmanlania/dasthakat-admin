import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import api from '../../axiosInstance';
import { v4 as uuidv4 } from 'uuid';
import { roundUpto } from '../../utils/number';

export const getQuotationList = createAsyncThunk(
  'quotation/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/quotation', {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getBidResponseList = createAsyncThunk(
  'quotation/bid-response',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/report/bid-response', {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getQuotationListReport = createAsyncThunk(
  'quotation/list-report',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/report/quote-report', {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getQuotationListPrint = createAsyncThunk(
  'quotation/list-print',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/quotation', {
        params: {
          ...params,
          all: 1,
        },
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteQuotation = createAsyncThunk(
  'quotation/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quotation/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createQuotation = createAsyncThunk(
  'quotation/create',
  async (data, { rejectWithValue }) => {
    try {
      return await api.post('/quotation', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getQuotation = createAsyncThunk('quotation/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/quotation/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const getQuotationModal = createAsyncThunk(
  'quotation/getModal',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/quotation/${id}`, {
        params: {
          hasAvailableQty: true,
        },
      });
      return res.data.data;
    } catch (err) {
      // Use return rejectWithValue, not throw
      return rejectWithValue(err);
    }
  },
);

export const getQuotationForPrint = createAsyncThunk(
  'quotationForPrint/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/quotation/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateQuotation = createAsyncThunk(
  'quotation/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/quotation/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const bulkDeleteQuotation = createAsyncThunk(
  'quotation/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/quotation/bulk-delete', {
        quotation_ids: ids,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

// Vendor

export const getVendor = createAsyncThunk('vendor/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/vendor-platform/quotation/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const postVendorSelection = createAsyncThunk(
  'vendor/postSelection',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(`/vendor-platform/quotation/`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const postRfq = createAsyncThunk(
  'rfg/postSelection',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(`/vendor-platform/quotation/rfq`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  isListLoading: false,
  isFormSubmitting: false,
  isBulkDeleting: false,
  initialFormValues: null,
  isItemLoading: false,
  isItemVendorLoading: false,
  list: [],
  deleteIDs: [],
  rebatePercentage: null,
  salesmanPercentage: null,
  quotationDetails: [],
  vendorQuotationDetails: [],
  vendorDetails: [],
  params: {
    page: 1,
    limit: 50,
    search: '',
    sort_column: null,
    sort_direction: null,
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    resetQuotationState: (state) => {
      state.isItemLoading = false;
      state.quotationDetails = [];
      state.initialFormValues = null;
    },
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
      const index = action.payload;
      const newDetail = {
        // id: Date.now(),
        id: uuidv4(),
        product_code: null,
        product_id: null,
        description: null,
        quantity: null,
        unit_id: null,
        rate: null,
        amount: null,
        row_status: 'I',
        markup: 0,
      };

      // If index is provided, insert the new detail after that index, otherwise push it to the end
      if (index || index === 0) {
        state.quotationDetails.splice(index + 1, 0, newDetail);
      } else {
        state.quotationDetails.push(newDetail);
      }
    },

    copyQuotationDetail: (state, action) => {
      const index = action.payload;

      const detail = state.quotationDetails[index];
      const newDetail = {
        ...detail,
        // id: Date.now(),
        id: uuidv4(),
        row_status: 'I',
        isDeleted: false,
      };

      state.quotationDetails.splice(index + 1, 0, newDetail);
    },

    removeQuotationDetail: (state, action) => {
      const itemIndex = state.quotationDetails.findIndex((item) => item.id === action.payload);

      if (itemIndex !== -1) {
        if (state.quotationDetails[itemIndex].row_status === 'I') {
          state.quotationDetails = state.quotationDetails.filter(
            (item) => item.id !== action.payload,
          );
        } else {
          state.quotationDetails[itemIndex].row_status = 'D';
          state.quotationDetails[itemIndex].isDeleted = true;
        }
      }
    },

    // Change the order of quotation details, from is the index of the item to be moved, to is the index of the item to be moved to
    changeQuotationDetailOrder: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.quotationDetails[from];
      state.quotationDetails[from] = state.quotationDetails[to];
      state.quotationDetails[to] = temp;
    },

    changeQuotationDetailValue: (state, action) => {
      const { index, key, value } = action.payload;

      const detail = state.quotationDetails[index];

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
      }

      if (detail.quantity && detail.rate) {
        console.log(detail.rate)
        detail.amount = roundUpto(+detail.quantity * +detail.rate);

        if (key === 'rate' && +detail.cost_price && +detail.rate) {
          detail.markup = roundUpto(
            ((+detail.rate - +detail.cost_price) / +detail.cost_price) * 100,
          );
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

    resetQuotationDetail: (state, action) => {
      const index = action.payload;

      state.quotationDetails[index] = {
        id: state.quotationDetails[index].id,
        product_code: null,
        product_id: null,
        description: null,
        stock_quantity: null,
        quantity: null,
        unit_id: null,
        supplier_id: null,
        cost_price: null,
        markup: '0',
        rate: null,
        amount: null,
        discount_percent: '0',
        gross_amount: null,
        row_status:
          state.quotationDetails[index].row_status === 'U'
            ? 'U'
            : state.quotationDetails[index].row_status,
      };
    },

    setRebatePercentage: (state, action) => {
      state.rebatePercentage = action.payload;
    },

    setSalesmanPercentage: (state, action) => {
      state.salesmanPercentage = action.payload;
    },
    splitQuotationQuantity: (state, action) => {
      const index = action.payload;
      const detail = state.quotationDetails[index];
      const splittedQuantity = parseFloat(detail.quantity) - parseFloat(detail.stock_quantity);

      const row = {
        ...detail,
        quantity: detail.stock_quantity,
        rate: detail.rate,
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
            : 0),
      };

      const splittedRow = {
        product_type_id: {
          value: 4,
          label: 'Others',
        },
        product_name: detail.product_id?.label,
        product_description: detail.product_description,
        description: detail.description,
        unit_id: detail.unit_id,
        supplier_id: detail.supplier_id,
        quantity: splittedQuantity,
        rate: detail.rate,
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

      state.quotationDetails.splice(index, 1, row, splittedRow);
    },

    resetVendorDetails: (state) => {
      state.vendorDetails = [];
    },

  },
  extraReducers: ({ addCase }) => {
    addCase(getQuotationList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.quotationDetails = [];
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
    addCase(getQuotationListReport.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(getQuotationListReport.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
      state.quotationDetails = [];
    });
    addCase(getQuotationListReport.fulfilled, (state, action) => {
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
      state.initialFormValues = {
        quotation_id: data.quotation_id,
        document_identity: data.document_identity,
        document_type_id: data.document_type_id,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        service_date: data.service_date,
        imo: data.vessel ? data.vessel.imo : null,
        internal_notes: data.internal_notes,
        salesman_id: data.salesman
          ? {
            value: data.salesman.salesman_id,
            label: data.salesman.name,
          }
          : null,
        event_id: data.event
          ? {
            value: data.event.event_id,
            label: data.event.event_name,
          }
          : null,
        vessel_id: data.vessel
          ? {
            value: data.vessel.vessel_id,
            label: data.vessel.name,
          }
          : null,
        customer_id: data.customer
          ? {
            value: data.customer.customer_id,
            label: data.customer.name,
          }
          : null,
        class1_id: data.class1
          ? {
            value: data.class1.class_id,
            label: data.class1.name,
          }
          : null,
        class2_id: data.class2
          ? {
            value: data.class2.class_id,
            label: data.class2.name,
          }
          : null,
        flag_id: data.flag
          ? {
            value: data.flag.flag_id,
            label: data.flag.name,
          }
          : null,
        person_incharge_id: data.person_incharge
          ? {
            value: data.person_incharge.user_id,
            label: data.person_incharge.user_name,
          }
          : null,
        validity_id: data.validity
          ? {
            value: data.validity.validity_id,
            label: data.validity.name,
          }
          : null,
        payment_id: data.payment
          ? {
            value: data.payment.payment_id,
            label: data.payment.name,
          }
          : null,
        customer_ref: data.customer_ref,
        due_date: data.due_date,
        attn: data.attn,
        delivery: data.delivery,
        inclosure: data.inclosure,
        remarks: data.remarks,
        port_id: data.port
          ? {
            value: data.port.port_id,
            label: data.port.name,
          }
          : null,
        port: data.port
          ? {
            value: data.port.port_id,
            label: data.port.name,
          }
          : null,
        term_id: data.term_id || null,
        term_desc: data.term_desc,
        status: data.status,
      };

      if (!data.quotation_detail) return;
      state.quotationDetails = data.quotation_detail.map((detail) => ({
        id: detail.quotation_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        product_type_id: detail.product_type
          ? {
            value: detail.product_type.product_type_id,
            label: detail.product_type.name,
          }
          : null,
        product_name: detail.product_name
          ? detail.product_name
          : detail?.product?.product_name || null,
        product_description: detail.product_description,
        description: detail.description,
        stock_quantity: detail?.product?.stock?.quantity
          ? parseFloat(detail.product.stock.quantity)
          : 0,
        quantity: detail.quantity ? detail.quantity : null,
        available_quantity: detail.available_quantity ? detail.available_quantity : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null,
        vendor_part_no: detail.vendor_part_no,
        internal_notes: detail.internal_notes,
        cost_price:
          detail?.product_type?.product_type_id === 4
            ? detail.cost_price
            : +detail.cost_price || +detail.rate,
        markup: detail.markup,
        rate: detail.rate,
        amount: detail.amount,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_amount,
        gross_amount: detail.gross_amount,
        quotation_detail_id: detail?.quotation_detail_id,
        row_status: 'U',
        isDeleted: false,
      }));

      state.vendorQuotationDetails = data.quotation_detail.map((detail) => ({
        id: detail.quotation_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        product_type_id: detail.product_type
          ? {
            value: detail.product_type.product_type_id,
            label: detail.product_type.name,
          }
          : null,
        product_name: detail.product_name
          ? detail.product_name
          : detail?.product?.product_name || null,
        product_description: detail.product_description,
        description: detail.description,
        stock_quantity: detail?.product?.stock?.quantity
          ? parseFloat(detail.product.stock.quantity)
          : 0,
        quantity: detail.quantity ? detail.quantity : null,
        available_quantity: detail.available_quantity ? detail.available_quantity : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null,
        vendor_part_no: detail.vendor_part_no,
        internal_notes: detail.internal_notes,
        cost_price:
          detail?.product_type?.product_type_id === 4
            ? detail.cost_price
            : +detail.cost_price || +detail.rate,
        markup: detail.markup,
        rate: detail.rate,
        amount: detail.amount,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_amount,
        gross_amount: detail.gross_amount,
        quotation_detail_id: detail?.quotation_detail_id,
        row_status: 'U',
        isDeleted: false,
      })).filter((detail) => [3, 4].includes(detail.product_type_id?.value));;

      state.rebatePercentage = data?.rebate_percent ? data?.rebate_percent : 0;
      state.salesmanPercentage = data?.salesman_percent ? data?.salesman_percent : 0;
    });
    addCase(getQuotation.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(getVendor.pending, (state) => {
      state.isItemVendorLoading = true;
    });
    
    addCase(getVendor.fulfilled, (state, action) => {
      state.isItemVendorLoading = false;
      const data = action.payload;

      state.vendorDetails = data.map((item) => ({
        quotation_detail_id: item.quotation_detail_id,
        vendor: item.vendor
          ? { supplier_id: item.vendor.supplier_id, name: item.vendor.name }
          : null,
        vendor_rate: item.vendor_rate,
        is_primary_vendor: item.is_primary_vendor,
        rfq: item.rfq,
        vendor_part_no: item.vendor_part_no,
      }));
    });

    addCase(getVendor.rejected, (state) => {
      state.isItemVendorLoading = false;
      state.vendorDetails = null;
    });

    addCase(getQuotationModal.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getQuotationModal.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;
      state.initialFormValues = {
        document_identity: data.document_identity,
        document_type_id: data.document_type_id,
        document_date: data.document_date ? dayjs(data.document_date) : null,
        service_date: data.service_date,
        imo: data.vessel ? data.vessel.imo : null,
        internal_notes: data.internal_notes,
        salesman_id: data.salesman
          ? {
            value: data.salesman.salesman_id,
            label: data.salesman.name,
          }
          : null,
        event_id: data.event
          ? {
            value: data.event.event_id,
            label: data.event.event_name,
          }
          : null,
        vessel_id: data.vessel
          ? {
            value: data.vessel.vessel_id,
            label: data.vessel.name,
          }
          : null,
        customer_id: data.customer
          ? {
            value: data.customer.customer_id,
            label: data.customer.name,
          }
          : null,
        class1_id: data.class1
          ? {
            value: data.class1.class_id,
            label: data.class1.name,
          }
          : null,
        class2_id: data.class2
          ? {
            value: data.class2.class_id,
            label: data.class2.name,
          }
          : null,
        flag_id: data.flag
          ? {
            value: data.flag.flag_id,
            label: data.flag.name,
          }
          : null,
        person_incharge_id: data.person_incharge
          ? {
            value: data.person_incharge.user_id,
            label: data.person_incharge.user_name,
          }
          : null,
        validity_id: data.validity
          ? {
            value: data.validity.validity_id,
            label: data.validity.name,
          }
          : null,
        payment_id: data.payment
          ? {
            value: data.payment.payment_id,
            label: data.payment.name,
          }
          : null,
        customer_ref: data.customer_ref,
        due_date: data.due_date,
        attn: data.attn,
        delivery: data.delivery,
        inclosure: data.inclosure,
        remarks: data.remarks,
        port_id: data.port
          ? {
            value: data.port.port_id,
            label: data.port.name,
          }
          : null,
        port: data.port
          ? {
            value: data.port.port_id,
            label: data.port.name,
          }
          : null,
        term_id: data.term_id || null,
        term_desc: data.term_desc,
        status: data.status,
        customer_block_status: data?.customer?.block_status ? data?.customer?.block_status : null,
        vessel_block_status: data?.vessel?.block_status ? data?.vessel?.block_status : null,
      };

      if (!data.quotation_detail) return;
      state.quotationDetails = data.quotation_detail.map((detail) => ({
        id: detail.quotation_detail_id,
        product_code: detail.product ? detail.product.product_code : null,
        product_id: detail.product
          ? { value: detail.product.product_id, label: detail.product.product_name }
          : null,
        product_type_id: detail.product_type
          ? {
            value: detail.product_type.product_type_id,
            label: detail.product_type.name,
          }
          : null,
        product_name: detail.product_name
          ? detail.product_name
          : detail?.product?.product_name || null,
        product_description: detail.product_description,
        description: detail.description,
        stock_quantity: detail?.product?.stock?.quantity
          ? parseFloat(detail.product.stock.quantity)
          : 0,
        quantity: detail.quantity ? detail.quantity : null,
        available_quantity: detail.available_quantity ? detail.available_quantity : null,
        unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null,
        supplier_id: detail.supplier
          ? { value: detail.supplier.supplier_id, label: detail.supplier.name }
          : null,
        vendor_part_no: detail.vendor_part_no,
        internal_notes: detail.internal_notes,
        cost_price:
          detail?.product_type?.product_type_id === 4
            ? detail.cost_price
            : +detail.cost_price || +detail.rate,
        markup: detail.markup,
        rate: detail.rate,
        amount: detail.amount,
        discount_percent: detail.discount_percent,
        discount_amount: detail.discount_amount,
        gross_amount: detail.gross_amount,
        row_status: 'U',
        isDeleted: false,
      }));

      state.rebatePercentage = data?.rebate_percent ? data?.rebate_percent : 0;
      state.salesmanPercentage = data?.salesman_percent ? data?.salesman_percent : 0;
    });
    addCase(getQuotationModal.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
    });

    addCase(updateQuotation.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateQuotation.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.quotationDetails = state.quotationDetails
        .filter((item) => item.row_status !== 'D')
        .map((item) => ({
          ...item,
          row_status: 'U',
          isDeleted: false,
        }));
      state.initialFormValues = null;
      state.rebatePercentage = null;
      state.salesmanPercentage = null;
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
  removeQuotationDetail,
  copyQuotationDetail,
  changeQuotationDetailOrder,
  changeQuotationDetailValue,
  resetQuotationDetail,
  setRebatePercentage,
  setSalesmanPercentage,
  resetQuotationState,
  splitQuotationQuantity,
  resetVendorDetails
} = quotationSlice.actions;
export default quotationSlice.reducer;
