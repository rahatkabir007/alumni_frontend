import { BASE_URL } from '@/constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        mode: "cors",
        prepareHeaders: (headers, { getState }) => {
            // headers.set('authorization', `Bearer ${getState().authToken.token || localStorage.getItem('access_token')}`);
            headers.set('authorization', `Bearer ${localStorage.getItem('token')}`);
            return headers
        },
    }),
    // tagTypes: ['tour', 'stop', 'stop-custom-map'],
    endpoints: builder => ({}),
})