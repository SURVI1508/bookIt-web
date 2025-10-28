import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/utils/axioxInstance";

// ===============================
// 🔹 CREATE / UPDATE POST
// ===============================
export const createOrUpdatePost = createAsyncThunk(
  "posts/createOrUpdatePost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      let response;
      if (postId) {
        // Update existing post
        response = await axiosInstance.put(`/api/blog/${postId}`, postData);
      } else {
        // Create new post
        response = await axiosInstance.post(`/api/blog`, postData);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create or update post"
      );
    }
  }
);

// ===============================
// 🔹 GET ALL POSTS
// ===============================
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/blog`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

// ===============================
// 🔹 GET SINGLE POST BY ID
// ===============================
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/blog/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post details"
      );
    }
  }
);

// ===============================
// 🔹 DELETE POST BY ID
// ===============================
export const deletePostById = createAsyncThunk(
  "posts/deletePostById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/api/blog/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

// ===============================
// 🔹 INITIAL STATE
// ===============================
const initialState = {
  posts: [],
  singlePost: {},
  selectedPost: null,
  loading: false,
  success: false,
  error: null,
  dataLoading: true,
};

// ===============================
// 🔹 SLICE
// ===============================
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== CREATE / UPDATE =====
      .addCase(createOrUpdatePost.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrUpdatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updated = action.payload?.data || action.payload;
        const index = state.posts.findIndex((p) => p._id === updated._id);

        if (index !== -1) {
          // Update existing
          state.posts[index] = updated;
        } else {
          // Add new
          state.posts.unshift(updated);
        }
      })
      .addCase(createOrUpdatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET ALL POSTS =====
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload?.blogs;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET SINGLE POST =====
      .addCase(fetchPostById.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.singlePost = action.payload?.blog;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // ===== DELETE POST =====
      .addCase(deletePostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.posts = state.posts.filter((p) => p._id !== deletedId);
      })
      .addCase(deletePostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPostState, clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;
