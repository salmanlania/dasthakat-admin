import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getProductList = createAsyncThunk(
  'product/list',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/product', {
        params: {
          ...params,
          all: 1
        }
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const deleteProduct = createAsyncThunk('product/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/product/${id}`);
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const createProduct = createAsyncThunk(
  'product/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/product', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const getProduct = createAsyncThunk('product/get', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/product/${id}`);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateProduct = createAsyncThunk(
  'product/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/product/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const bulkDeleteProduct = createAsyncThunk(
  'product/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      await api.post('/product/bulk-delete', {
        product_ids: ids
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
    search: '',
    sort_column: null,
    sort_direction: null,
    name: null,
    description: null,
    catering_type: null
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0
  }
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductListParams: (state, action) => {
      state.params = {
        ...state.params,
        ...action.payload
      };
    },

    setProductDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getProductList.pending, (state) => {
      state.isListLoading = true;
      state.initialFormValues = null;
    });
    addCase(getProductList.fulfilled, (state, action) => {
      state.isListLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page
      };
    });
    addCase(getProductList.rejected, (state) => {
      state.isListLoading = false;
    });

    addCase(createProduct.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createProduct.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(createProduct.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getProduct.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getProduct.fulfilled, (state, action) => {
      state.isItemLoading = false;
      const data = action.payload;

      state.initialFormValues = {
        product_code: data.product_code,
        name: data.name,
        product_type_id: data.product_type_id
          ? {
            value: data.product_type_id,
            label: data.product_type_name
          }
          : null,
        impa_code: data.impa_code,
        short_code: data.short_code,
        category_id: data.category_id
          ? {
            value: data.category_id,
            label: data.category_name
          }
          : null,
        sub_category_id: data.sub_category_id
          ? {
            value: data.sub_category_id,
            label: data.sub_category_name
          }
          : null,
        brand_id: data.brand_id
          ? {
            value: data.brand_id,
            label: data.brand_name
          }
          : null,
        unit_id: data.unit_id
          ? {
            value: data.unit_id,
            label: data.unit_name
          }
          : null,
        cost_price: data.cost_price,
        sale_price: data.sale_price,
        status: data.status,
        image: data.image,
        image_url: data.image_url,
        adjustment_account_id: data?.adjustment_account_id && data?.adjustment_account_name ? {
          value: data?.adjustment_account_id,
          label: data?.adjustment_account_name
        } : null,
        cogs_account_id: data?.cogs_account_id && data?.cogs_account_name  ? {
          value: data?.cogs_account_id,
          label: data?.cogs_account_name
        } : null,
        inventory_account_id: data?.inventory_account_id && data?.inventory_account_name ? {
          value: data?.inventory_account_id,
          label: data?.inventory_account_name
        } : null,
        revenue_account_id: data?.revenue_account_id && data?.revenue_account_name ? {
          value: data?.revenue_account_id,
          label: data?.revenue_account_name
        } : null,
      };
    });
    addCase(getProduct.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateProduct.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateProduct.fulfilled, (state) => {
      state.isFormSubmitting = false;
      state.initialFormValues = null;
    });
    addCase(updateProduct.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(bulkDeleteProduct.pending, (state) => {
      state.isBulkDeleting = true;
    });
    addCase(bulkDeleteProduct.fulfilled, (state) => {
      state.isBulkDeleting = false;
      state.deleteIDs = [];
    });
    addCase(bulkDeleteProduct.rejected, (state) => {
      state.isBulkDeleting = false;
    });
  }
});

export const { setProductListParams, setProductDeleteIDs } = productSlice.actions;
export default productSlice.reducer;
