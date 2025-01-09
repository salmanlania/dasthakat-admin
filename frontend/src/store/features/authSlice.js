import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../axiosInstance';

export const loginHandler = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const postSession = createAsyncThunk('session/post', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/session', data);
    return res.data.data;
  } catch (err) {
    throw rejectWithValue(err);
  }
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/reset-password', data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const initialState = {
  isLoggingIn: false,
  isSessionPosting: false,
  sessionData: null,
  user,
  isPasswordResetting: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(loginHandler.pending, (state) => {
      state.isLoggingIn = true;
    });
    addCase(loginHandler.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.sessionData = {
        company_and_branches: action.payload,
        ...action.meta.arg
      };
    });
    addCase(loginHandler.rejected, (state) => {
      state.isLoggingIn = false;
    });

    addCase(postSession.pending, (state) => {
      state.isSessionPosting = true;
    });
    addCase(postSession.fulfilled, (state, action) => {
      state.isSessionPosting = false;
      const { api_token, ...user } = action.payload;
      localStorage.setItem('token', api_token);
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    });
    addCase(postSession.rejected, (state) => {
      state.isSessionPosting = false;
    });

    addCase(resetPassword.pending, (state) => {
      state.isPasswordResetting = true;
    });
    addCase(resetPassword.fulfilled, (state) => {
      state.isPasswordResetting = false;
    });
    addCase(resetPassword.rejected, (state) => {
      state.isPasswordResetting = false;
    });
  }
});

export default authSlice.reducer;
