import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../features/api/apiSlice";
import { authApiSlice } from "../features/api/authApiSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import galleryReducer from "../features/gallery/gallerySlice";
import profileReducer from '../features/profile/profileSlice'
import commentsReducer from '../features/comments/commentsSlice'



const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        auth: authReducer,
        user: userReducer,
        gallery: galleryReducer,
        profile: profileReducer,
        comments: commentsReducer
    },

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
            authApiSlice.middleware
        ),
});
setupListeners(store.dispatch);

export default store