import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../features/api/apiSlice";
import { exampleApiSlice } from "../features/example/exampleApiSlice";
import { signupStateSlice } from "../features/signup/signupStateSlice";



const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        //remove this example slice from here when we work on actual slices
        [exampleApiSlice.reducerPath]: exampleApiSlice.reducer,
        signupStateSlice: signupStateSlice.reducer,

    },

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            apiSlice.middleware, exampleApiSlice.middleware
        ),
});
setupListeners(store.dispatch);

export default store