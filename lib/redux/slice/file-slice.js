import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/utils/axioxInstance";

// ===============================
// 🔹 UPLOAD FILE (CREATE)
// ===============================
export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "File upload failed"
      );
    }
  }
);

// ===============================
// 🔹 GET ALL FILES
// ===============================
export const fetchAllFiles = createAsyncThunk(
  "files/fetchAllFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/file`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch files"
      );
    }
  }
);

// ===============================
// 🔹 GET SINGLE FILE BY ID
// ===============================
export const fetchFileById = createAsyncThunk(
  "files/fetchFileById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/file/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch file details"
      );
    }
  }
);

// ===============================
// 🔹 DELETE FILE BY ID
// ===============================
export const deleteFileById = createAsyncThunk(
  "files/deleteFileById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/file/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete file"
      );
    }
  }
);

// ===============================
// 🔹 INITIAL STATE
// ===============================
const initialState = {
  files: [],
  singleFile: {},
  selectedFile: null,
  loading: false,
  success: false,
  error: null,
  dataLoading: true,
};

// ===============================
// 🔹 SLICE
// ===============================
const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    resetFileState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== UPLOAD FILE =====
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const newFile = action.payload?.data || action.payload;
        state.files.unshift(newFile);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET ALL FILES =====
      .addCase(fetchAllFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload?.data?.files || [];
      })
      .addCase(fetchAllFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET SINGLE FILE =====
      .addCase(fetchFileById.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchFileById.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.singleFile = action.payload?.file || {};
      })
      .addCase(fetchFileById.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // ===== DELETE FILE =====
      .addCase(deleteFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFileById.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.files = state.files.filter((f) => f._id !== deletedId);
      })
      .addCase(deleteFileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFileState, clearSelectedFile } = fileSlice.actions;
export default fileSlice.reducer;
