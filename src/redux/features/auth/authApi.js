import { apiSlice } from "../api/apiSlice"

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            // Invalidate user data to refetch after login
            invalidatesTags: ['User'],
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // Invalidate user data after logout
            invalidatesTags: ['User'],
        }),
        getCurrentUser: builder.query({
            query: () => '/auth/me',
            // Cache user data with 'User' tag
            providesTags: ['User'],
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
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: '/auth/profile',
                method: 'PUT',
                body: userData,
            }),
            // Invalidate user data to refetch after update
            invalidatesTags: ['User'],
        }),
        // Add other user-related endpoints that might be needed
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: passwordData,
            }),
        }),
        refreshToken: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
        }),
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useRefreshTokenMutation,
    // Export lazy query for manual triggering
    useLazyGetCurrentUserQuery
} = authApi