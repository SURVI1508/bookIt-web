"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import {
  AUTH_LOGIN,
  AUTH_PROFILE,
  AUTH_ROLE,
  AUTH_SEND_OTP,
  AUTH_SIGNUP,
  USER_REGISTER,
} from "~/constants/ApiRoute";
import axiosInstance from "~/utils/axioxInstance";
import { successToast } from "~/utils/toastMessage";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

// OTP SEND
export const Otpsend = createAsyncThunk(
  "auth/otpsend",
  async ({ mobile }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BACKEND_API_URL}${AUTH_SEND_OTP}`, {
        mobile,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Otp sending failed");
    }
  },
);

// LOGIN
export const loginuser = createAsyncThunk(
  "auth/loginuser",
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BACKEND_API_URL}${AUTH_LOGIN}`, {
        mobile,
        otp,
      });
      const role = data?.user?.role;
      const token = data.token;
      if (role !== "vendor") {
        return rejectWithValue("Only vendor can login in this panel.");
      }
      Cookies.set("token", token, { expires: 6 });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "User login failed");
    }
  },
);

// SIGNUP
export const Signupuser = createAsyncThunk(
  "auth/signupuser",
  async (userdata, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BACKEND_API_URL}${AUTH_SIGNUP}`, {
        ...userdata,
      });
      const role = data?.user?.role;
      if (role !== "vendor") {
        return rejectWithValue("Only vendor can signup in this panel.");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "User signup failed");
    }
  },
);

//OTP VERIFY FOR SIGNUP
export const signupuserotpverification = createAsyncThunk(
  "auth/signupuserotpverification", // ✅ fixed unique type
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BACKEND_API_URL}${AUTH_LOGIN}`, {
        mobile,
        otp,
      });
      const role = data?.user?.role;
      const temporarytoken = data.token;
      if (role !== "vendor") {
        return rejectWithValue("Only vendor can Register in this panel.");
      }
      Cookies.set("temporarytoken", temporarytoken, { expires: 6 });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "User OTP verification failed",
      );
    }
  },
);

// UPDATE SIGNUP USER
export const updatesignupuser = createAsyncThunk(
  "auth/updatesignupuser",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(AUTH_PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return data?.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "User update failed");
    }
  },
);

// GET USER DETAILS
// export const fetchUserDetails = createAsyncThunk(
//   "auth/fetchUserDetails",
//   async (token, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.get(AUTH_PROFILE, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return data?.user;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Fetching user failed");
//     }
//   },
// );

// UPDATE USER DETAILS
export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(AUTH_PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return data?.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "User update failed");
    }
  },
);

// get logged in user details
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(AUTH_PROFILE);
      return data?.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "user login failed");
    }
  },
);

// fetch role list
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const {data}= await axiosInstance.get("/api/users", {
        params: filters,
      });

      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch roles");
    }
  },
);

// fetch single role details
export const fetchSingleRole = createAsyncThunk(
  "auth/fetchSingleRole",
  async ({ roleId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${AUTH_ROLE}/${roleId}`);
      return data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch roles");
    }
  },
);

// create new role
export const createRole = createAsyncThunk(
  "auth/createRole",
  async ({ roleData, roleId }, { rejectWithValue }) => {
    const url = roleId ? `${AUTH_ROLE}/${roleId}` : AUTH_ROLE;
    try {
      const response = await axiosInstance({
        method: roleId ? "PUT" : "POST",
        url,
        data: roleData,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed role");
    }
  },
);

// delete role
export const deleteRole = createAsyncThunk(
  "auth/deleteRole",
  async ({ roleId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`${AUTH_ROLE}/${roleId}`);
      return data;
    } catch (error) {
      // console.log(error);
      return rejectWithValue(error.response?.data || "Failed to delete role!");
    }
  },
);

// create new member
export const createMember = createAsyncThunk(
  "auth/createMember",
  async ({ memberData, memberId }, { rejectWithValue }) => {
    const url = memberId ? `${USER_REGISTER}/${memberId}` : AUTH_SIGNUP;
    try {
      const { data } = await axiosInstance({
        method: memberId ? "PUT" : "POST",
        url,
        data: memberData,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create member");
    }
  },
);

const token = Cookies.get("token");

const initialState = {
  user: {},
  token: token || null,
  loading: false,
  error: null,
  isAuthenticated: false,
  userLoading: true,
  userList: [],
  singleRole: {},
  userList: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("token");
      successToast("User logged out successfully");
      state.user = {};
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // OTP SEND
      .addCase(Otpsend.pending, (state) => {
        state.loading = true;
      })
      .addCase(Otpsend.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(Otpsend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // LOGIN
      .addCase(loginuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginuser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(loginuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
        state.isAuthenticated = false;
      })

      // SIGNUP
      .addCase(Signupuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(Signupuser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(Signupuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // SIGNUP OTP VERIFY
      .addCase(signupuserotpverification.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupuserotpverification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signupuserotpverification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // FETCH USER DETAILS
      // .addCase(fetchUserDetails.pending, (state) => {
      //   state.userLoading = true;
      // })
      // .addCase(fetchUserDetails.fulfilled, (state, action) => {
      //   state.isAuthenticated = true;
      //   state.userLoading = false;
      //   state.user = action.payload;
      // })
      // .addCase(fetchUserDetails.rejected, (state, action) => {
      //   state.userLoading = false;
      //   state.error = action.payload || null;
      // })

      // UPDATE SIGNUP USER
      .addCase(updatesignupuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatesignupuser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updatesignupuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // UPDATE USER DETAILS
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      .addCase(fetchUserDetails.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userLoading = false;

        console.log(action.payload, "user");
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload || null;
      })

      // Role create
      .addCase(createRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      .addCase(createMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      .addCase(fetchSingleRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleRole.fulfilled, (state, action) => {
        state.loading = false;
        state.singleRole = action.payload.data;
      })
      .addCase(fetchSingleRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        // state.userList = action.payload.data;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
