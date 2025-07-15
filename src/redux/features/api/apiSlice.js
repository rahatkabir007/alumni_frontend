import { BASE_URL } from '@/constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        mode: "cors",
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers
        },
    }),
    // Add tag types for caching and invalidation
    tagTypes: ['User', 'Alumni', 'Teachers', 'Events', 'Blogs', 'Auth'],
    endpoints: builder => ({}),
})