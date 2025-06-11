import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardState, DashboardSummary } from "../../types/simulation";
import { dashboardAPI } from "../../services/api";

const initialState: DashboardState = {
  summary: null,
  isLoading: false,
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async () => {
    const response = await dashboardAPI.getSummary();
    return response.data;
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch dashboard data";
      });
  },
});

export const { clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
