import { BASE_URL } from "@/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        mode: "cors",
        credentials: 'include', // Add this for cookie handling
    }),
    endpoints: (builder) => ({}),
});
