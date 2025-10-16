import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../axiosInstance';

export const getLedgerReportForPrintPdf = createAsyncThunk(
  "reports/getLedgerReportForPrintPdf",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/ledger", { params });
      console.log('response' , response)
      const byteCharacters = atob(response?.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getChartOfAccountsReportForPrintPdf = createAsyncThunk(
  "reports/getChartOfAccountsReportForPrintPdf",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/ledger", { params });
      console.log('response' , response)
      const byteCharacters = atob(response?.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLedgerReportForPrintPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLedgerReportForPrintPdf.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getLedgerReportForPrintPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getChartOfAccountsReportForPrintPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChartOfAccountsReportForPrintPdf.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getChartOfAccountsReportForPrintPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default reportsSlice.reducer;