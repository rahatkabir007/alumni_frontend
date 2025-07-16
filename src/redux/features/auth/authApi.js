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
            // Transform response to ensure consistency and normalize field names
            transformResponse: (response) => {
                console.log('API Response for getCurrentUser:', response);
                if (response.success && response.data) {
                    // Normalize the field names to match frontend expectations
                    const normalizedData = {
                        ...response.data,
                        createdAt: response.data.created_at,
                        updatedAt: response.data.updated_at,
                        // Remove the snake_case versions
                        created_at: undefined,
                        updated_at: undefined
                    };

                    // Clean up undefined fields
                    Object.keys(normalizedData).forEach(key => {
                        if (normalizedData[key] === undefined) {
                            delete normalizedData[key];
                        }
                    });

                    console.log('Normalized user data:', normalizedData);
                    return normalizedData;
                }
                throw new Error(response.message || 'Failed to fetch user data');
            },
            // Handle errors gracefully
            transformErrorResponse: (response) => {
                console.error('API Error for getCurrentUser:', response);
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
            // Transform response to normalize field names
            transformResponse: (response) => {
                if (response.success && response.data) {
                    const normalizedData = {
                        ...response.data,
                        createdAt: response.data.created_at,
                        updatedAt: response.data.updated_at,
                        created_at: undefined,
                        updated_at: undefined
                    };

                    Object.keys(normalizedData).forEach(key => {
                        if (normalizedData[key] === undefined) {
                            delete normalizedData[key];
                        }
                    });

                    return normalizedData;
                }
                return response;
            },
            // Invalidate user data to refetch after update
            invalidatesTags: ['User'],
        }),
        updateProfilePhoto: builder.mutation({
            query: (photoData) => ({
                url: '/auth/profile-photo',
                method: 'PATCH',
                body: photoData,
            }),
            transformResponse: (response) => {
                if (response.success && response.data) {
                    const normalizedData = {
                        ...response.data,
                        createdAt: response.data.created_at,
                        updatedAt: response.data.updated_at,
                        created_at: undefined,
                        updated_at: undefined
                    };

                    Object.keys(normalizedData).forEach(key => {
                        if (normalizedData[key] === undefined) {
                            delete normalizedData[key];
                        }
                    });

                    return normalizedData;
                }
                return response;
            },
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