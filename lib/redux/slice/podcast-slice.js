import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/utils/axioxInstance";

// ===============================
// 🔹 CREATE / UPDATE PODCAST
// ===============================
export const createOrUpdatePodcast = createAsyncThunk(
  "podcasts/createOrUpdatePodcast",
  async ({ podcastId, podcastData }, { rejectWithValue }) => {
    try {
      let response;
      if (podcastId) {
        // Update existing podcast
        response = await axiosInstance.put(
          `/api/podcast/${podcastId}`,
          podcastData
        );
      } else {
        // Create new podcast
        response = await axiosInstance.post(`/api/podcast`, podcastData);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create or update podcast"
      );
    }
  }
);

// ===============================
// 🔹 GET ALL PODCASTS
// ===============================
export const fetchAllPodcasts = createAsyncThunk(
  "podcasts/fetchAllPodcasts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/podcast`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch podcasts"
      );
    }
  }
);

// ===============================
// 🔹 GET SINGLE PODCAST BY ID
// ===============================
export const fetchPodcastById = createAsyncThunk(
  "podcasts/fetchPodcastById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/podcast/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch podcast details"
      );
    }
  }
);

// ===============================
// 🔹 DELETE PODCAST BY ID
// ===============================
export const deletePodcastById = createAsyncThunk(
  "podcasts/deletePodcastById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/podcast/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete podcast"
      );
    }
  }
);

// ===============================
// 🔹 INITIAL STATE
// ===============================
const initialState = {
  podcasts: [],
  singlePodcast: {},
  selectedPodcast: null,
  loading: false,
  success: false,
  error: null,
  dataLoading: true,
};

// ===============================
// 🔹 SLICE
// ===============================
const podcastSlice = createSlice({
  name: "podcasts",
  initialState,
  reducers: {
    resetPodcastState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearSelectedPodcast: (state) => {
      state.selectedPodcast = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== CREATE / UPDATE =====
      .addCase(createOrUpdatePodcast.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrUpdatePodcast.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updated = action.payload?.data || action.payload;
        const index = state.podcasts.findIndex((p) => p._id === updated._id);

        if (index !== -1) {
          // Update existing
          state.podcasts[index] = updated;
        } else {
          // Add new
          state.podcasts.unshift(updated);
        }
      })
      .addCase(createOrUpdatePodcast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET ALL PODCASTS =====
      .addCase(fetchAllPodcasts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPodcasts.fulfilled, (state, action) => {
        state.loading = false;
        state.podcasts = action.payload?.data?.podcasts;
      })
      .addCase(fetchAllPodcasts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET SINGLE PODCAST =====
      .addCase(fetchPodcastById.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchPodcastById.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.singlePodcast = action.payload?.podcast || {};
      })
      .addCase(fetchPodcastById.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // ===== DELETE PODCAST =====
      .addCase(deletePodcastById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePodcastById.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.podcasts = state.podcasts.filter((p) => p._id !== deletedId);
      })
      .addCase(deletePodcastById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPodcastState, clearSelectedPodcast } = podcastSlice.actions;
export default podcastSlice.reducer;
