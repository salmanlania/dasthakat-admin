import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const getCompanySetting = createAsyncThunk('setting/get', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/setting');
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const updateCompanySetting = createAsyncThunk(
  'setting/update',
  async (data, { rejectWithValue }) => {
    try {
      await api.put('/setting', data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const sendTestEmail = createAsyncThunk(
  'setting/testMail',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/setting/test-mail');
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const dbBackup = createAsyncThunk(
  'setting/dbbackup',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/setting/dbbackup');
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  isItemLoading: false,
  isFormSubmitting: false,
  initialFormValues: null,
  isTestEmailSending  : null,
  testEmailResponse  : null
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getCompanySetting.pending, (state) => {
      state.isItemLoading = true;
    });
    addCase(getCompanySetting.fulfilled, (state, action) => {
      state.isItemLoading = false;
      state.initialFormValues = action.payload;
    });
    addCase(getCompanySetting.rejected, (state) => {
      state.isItemLoading = false;
      state.initialFormValues = null;
    });

    addCase(updateCompanySetting.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(updateCompanySetting.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(updateCompanySetting.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(sendTestEmail.pending, (state) => {
      state.isTestEmailSending = true;
    });
    addCase(sendTestEmail.fulfilled, (state, action) => {
      state.isTestEmailSending = false;
      state.testEmailResponse = action.payload;
    });
    addCase(sendTestEmail.rejected, (state) => {
      state.isTestEmailSending = false;
      state.testEmailResponse = null;
    });
  }
});

export default settingSlice.reducer;