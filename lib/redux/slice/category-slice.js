import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CATEGORY } from "~/constants/ApiRoute";
import axiosInstance from "~/utils/axioxInstance";

// === CREATE category ===
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ categoryData, categoryId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance({
        method: categoryId ? "PUT" : "POST",
        url: categoryId ? `${CATEGORY}/${categoryId}` : CATEGORY,
        data: categoryData,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create main product"
      );
    }
  }
);

// === FETCH ALL category ===
export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${CATEGORY}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch  product"
      );
    }
  }
);

// === FETCH SINGLE category ===
export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${CATEGORY}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch  product"
      );
    }
  }
);

// === INITIAL STATE ===
const initialState = {
  categoryList: [],
  singleCategory: {},
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// === SLICE ===
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetcategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH
      .addCase(fetchCategory.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        const { categories, count } = action.payload;
        state.dataLoading = false;
        state.categoryList = categories;
        state.documentCount = count;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // FETCH SINGLE
      .addCase(fetchCategoryById.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        const { category, count } = action.payload;
        state.dataLoading = false;
        state.singleCategory = category;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetcategoryError } = categorySlice.actions;
export default categorySlice.reducer;
