import { BASE_URL } from '@/constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        mode: "cors",
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            // Try to get token from Redux state first
            let token = getState().auth.token;

            // If not in Redux, try localStorage as fallback
            if (!token) {
                token = localStorage.getItem('token');
            }

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User', 'Alumni', 'Teachers', 'Events', 'Blogs', 'Auth', 'Gallery'],
    endpoints: builder => ({}),
});