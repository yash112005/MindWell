import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/journal/';


export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const config = { headers: { Authorization: `Bearer ${auth.user.token}` } };
      const response = await axios.get(API_URL + 'stats', config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const quickCreateJournal = createAsyncThunk(
  'dashboard/quickCreate',
  async (entryData, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const config = { headers: { Authorization: `Bearer ${auth.user.token}` } };
      const response = await axios.post(API_URL, entryData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isSaving: false,
    saveSuccess: false,
    message: '',
  },
  reducers: {
    resetDashboard: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isSaving = false;
      state.saveSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(quickCreateJournal.pending, (state) => {
        state.isSaving = true;
        state.saveSuccess = false;
      })
      .addCase(quickCreateJournal.fulfilled, (state) => {
        state.isSaving = false;
        state.saveSuccess = true;
      })
      .addCase(quickCreateJournal.rejected, (state, action) => {
        state.isSaving = false;
        state.message = action.payload;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
