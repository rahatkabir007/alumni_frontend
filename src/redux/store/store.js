import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import galleryReducer from "../features/gallery/gallerySlice";
import { authApiSlice } from "../features/api/authApiSlice";



const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        auth: authReducer,
        user: userReducer,
        gallery: galleryReducer
    },

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
            authApiSlice.middleware
        ),
});
setupListeners(store.dispatch);

export default store