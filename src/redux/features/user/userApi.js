import { apiSlice } from '../api/apiSlice'

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 10, search = '', status = 'all', role = 'all', sortBy = 'created_at', sortOrder = 'desc', excludeAdmins = false } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (search) queryParams.append('search', search)
                if (status !== 'all') queryParams.append('status', status)
                if (role !== 'all') queryParams.append('role', role)
                if (excludeAdmins) queryParams.append('excludeAdmins', 'true')

                return `/users?${queryParams.toString()}`
            },
            transformResponse: (response) => {
                // Transform the API response to match our expected structure
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    users: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            },
            providesTags: ['User'],
        }),

        updateUser: builder.mutation({
            query: ({ userId, userData }) => ({
                url: `/users/${userId}`,
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        updateStatus: builder.mutation({
            query: ({ userId, status }) => ({
                url: `/users/${userId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['User'],
        }),

        updateRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/users/${userId}/role`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),

        removeRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/users/${userId}/role/remove`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        getUserById: builder.query({
            query: ({ userId, includeDetails }) => {
                // console.log(`Fetching user with ID: ${userId}, includeDetails: ${includeDetails}`)
                return `/users/${userId}?includeDetails=${includeDetails}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                throw new Error(response.message || 'Failed to fetch user data')
            },
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
        }),

        changePassword: builder.mutation({
            query: ({ currentPassword, newPassword }) => ({
                url: `/users/change-password`,
                method: 'PATCH',
                body: { currentPassword, newPassword },
            }),
            invalidatesTags: ['User'],
        }),

        applyForVerification: builder.mutation({
            query: ({ userId, verificationData }) => ({
                url: `/users/${userId}/apply_for_verification`,
                method: 'PATCH',
                body: { verification_fields: verificationData },
            }),
            invalidatesTags: ['User'],
        }),
    }),
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery,
    useUpdateUserMutation,
    useUpdateStatusMutation,
    useUpdateRoleMutation,
    useRemoveRoleMutation,
    useDeleteUserMutation,
    useChangePasswordMutation,
    useApplyForVerificationMutation,
} = userApi