import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page = 1) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
    );
    const data = await response.json();
    return data;
  }
);

// Load read posts from localStorage at startup
const savedReadPosts = JSON.parse(localStorage.getItem("readPosts")) || [];

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    loading: false,
    page: 1,
    readPosts: new Set(savedReadPosts), // store as Set
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    markAsRead: (state, action) => {
      state.readPosts.add(action.payload);
      // Save back to localStorage
      localStorage.setItem("readPosts", JSON.stringify([...state.readPosts]));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, markAsRead } = postsSlice.actions;
export default postsSlice.reducer;
