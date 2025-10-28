// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth-slice";
import sessionReducer from "./slice/session-slice";
import categoryReducer from "./slice/category-slice";

import userReducer from "./slice/user-slice";
import dashboardReducer from "./slice/dashboard-slice";

import { injectStore } from "~/utils/axioxInstance";
import postsSlice from "./slice/post-slice";
import podcastsSlice from "./slice/podcast-slice";
import episodesSlice from "./slice/episode-slice";
import filesSlice from "./slice/file-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    category: categoryReducer,

    users: userReducer,
    dashboard: dashboardReducer,
    posts: postsSlice,
    podcasts: podcastsSlice,
    episodes: episodesSlice,
    files: filesSlice,
  },
});

injectStore(store);
