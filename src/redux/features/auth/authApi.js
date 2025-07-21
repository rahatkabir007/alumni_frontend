import { apiSlice } from "../api/apiSlice"

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            // Invalidate user data to refetch after login
            invalidatesTags: ['Auth'],
        }),

        logout: builder.mutation({
            query: (token) => ({
                url: '/auth/logout',
                method: 'POST',
                body: { token },
            }),
            // Invalidate user data after logout
            invalidatesTags: ['User', 'Auth'],
        }),
        getCurrentUser: builder.query({
            query: () => '/auth/me',
            // Cache user data with 'User' tag
            providesTags: ['User', 'Auth'],
            // Transform response to ensure consistency
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch user data');
            },
            // Handle errors gracefully
            transformErrorResponse: (response) => {
                return {
                    message: response.data?.message || 'Failed to fetch user data',
                    status: response.status
                };
            }
        }),

    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
    useUpdateProfilePhotoMutation,
    useChangePasswordMutation,
    // Export lazy query for manual triggering
    useLazyGetCurrentUserQuery
} = authApi