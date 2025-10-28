import {
  createSlice,
  createAsyncThunk,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { DASHBOARD, ORDER, SALES_GRAPH } from "~/constants/ApiRoute";
import axiosInstance from "~/utils/axioxInstance";

const token = Cookies.get("token");

// === FETCH ALL ORDER ===
export const fetcDashboard = createAsyncThunk(
  "ORDER/fetcDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${DASHBOARD}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch  ORDER",
      );
    }
  },
);

export const fetchsalesgraph = createAsyncThunk(
  "ORDER/fetcDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${SALES_GRAPH}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch  ORDER",
      );
    }
  },
);

// === INITIAL STATE ===
const initialState = {
  dashboardList: [],
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// === SLICE ===
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetorderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetcDashboard.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetcDashboard.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.dashboardList = action.payload;
      })
      .addCase(fetcDashboard.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetorderError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
