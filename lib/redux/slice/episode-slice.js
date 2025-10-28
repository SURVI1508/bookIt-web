// ===============================
// 🎧 episodeSlice.js
// ===============================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/utils/axioxInstance";

// ===============================
// 🔹 CREATE / UPDATE EPISODE
// ===============================
export const createOrUpdateEpisode = createAsyncThunk(
  "episodes/createOrUpdateEpisode",
  async ({ episodeId, episodeData }, { rejectWithValue }) => {
    try {
      let response;
      if (episodeId) {
        // Update existing episode
        response = await axiosInstance.put(
          `/api/episodes/${episodeId}`,
          episodeData
        );
      } else {
        // Create new episode
        response = await axiosInstance.post(`/api/episodes`, episodeData);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create or update episode"
      );
    }
  }
);

// ===============================
// 🔹 GET ALL EPISODES
// ===============================
export const fetchAllEpisodes = createAsyncThunk(
  "episodes/fetchAllEpisodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/episodes`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch episodes"
      );
    }
  }
);

// ===============================
// 🔹 GET SINGLE EPISODE BY ID
// ===============================
export const fetchEpisodeById = createAsyncThunk(
  "episodes/fetchEpisodeById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/episodes/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch episode details"
      );
    }
  }
);

// ===============================
// 🔹 DELETE EPISODE BY ID
// ===============================
export const deleteEpisodeById = createAsyncThunk(
  "episodes/deleteEpisodeById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/episodes/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete episode"
      );
    }
  }
);

// ===============================
// 🔹 INITIAL STATE
// ===============================
const initialState = {
  episodes: [],
  singleEpisode: {},
  selectedEpisode: null,
  loading: false,
  success: false,
  error: null,
  dataLoading: true,
};

// ===============================
// 🔹 SLICE
// ===============================
const episodeSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    resetEpisodeState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearSelectedEpisode: (state) => {
      state.selectedEpisode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== CREATE / UPDATE =====
      .addCase(createOrUpdateEpisode.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrUpdateEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updated = action.payload?.data || action.payload;
        const index = state.episodes.findIndex((e) => e._id === updated._id);

        if (index !== -1) {
          // Update existing
          state.episodes[index] = updated;
        } else {
          // Add new
          state.episodes.unshift(updated);
        }
      })
      .addCase(createOrUpdateEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET ALL EPISODES =====
      .addCase(fetchAllEpisodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEpisodes.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.loading = false;
        state.episodes = data;
      })
      .addCase(fetchAllEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET SINGLE EPISODE =====
      .addCase(fetchEpisodeById.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchEpisodeById.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.singleEpisode = action.payload?.data || {};
      })
      .addCase(fetchEpisodeById.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // ===== DELETE EPISODE =====
      .addCase(deleteEpisodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEpisodeById.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.episodes = state.episodes.filter((e) => e._id !== deletedId);
      })
      .addCase(deleteEpisodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetEpisodeState, clearSelectedEpisode } = episodeSlice.actions;
export default episodeSlice.reducer;
