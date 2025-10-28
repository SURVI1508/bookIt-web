"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { USER_REGISTER } from "~/constants/ApiRoute";
import axiosInstance from "~/utils/axioxInstance";
// import axiosInstance from "~/utils/axiosInstance";
import { successToast, errorToast } from "~/utils/toastMessage";

// 📌 Get All Users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ filters }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/vendor/users`, {
        params: filters,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  },
);

// 📌 Get Single User
export const fetchSingleUser = createAsyncThunk(
  "users/fetchSingleUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/vendor/users/${userId}`);
      return data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  },
);

// 📌 Create User
export const createUser = createAsyncThunk(
  "users/createUser",
  async ({ userData, userId }, { rejectWithValue }) => {
    const url = userId ? `${USER_REGISTER}/${userId}` : USER_REGISTER;
    try {
      const { data } = await axiosInstance({
        method: userId ? "PUT" : "POST",
        url,
        data: userData,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create member");
    }
  },
);

// 📌 Update User
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/vendor/users/${userId}`,
        userData,
      );
      successToast("User updated successfully");
      return data;
    } catch (error) {
      errorToast("User update failed");
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  },
);

// 📌 Delete User
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/vendor/users/${userId}`,
      );
      successToast("User deleted successfully");
      return { userId };
    } catch (error) {
      errorToast("User deletion failed");
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  },
);

// 🔰 Initial State
const initialState = {
  users: [],
  singleUser: {},
  loading: false,
  error: null,
  documentCount: 0,
};

// 📦 Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetSingleUser: (state) => {
      state.singleUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || [];
        state.documentCount = action.payload?.count || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single user
      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload?.data || null;
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload?.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload?.data;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (u) => u._id !== action.payload.userId,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✨ Export
export const { resetSingleUser } = userSlice.actions;
export default userSlice.reducer;
