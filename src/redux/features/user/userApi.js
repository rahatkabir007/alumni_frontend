import { apiSlice } from '../api/apiSlice'

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 10, search = '', isActive = 'all', role = 'all', sortBy = 'created_at', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (search) queryParams.append('search', search)
                if (isActive !== 'all') queryParams.append('isActive', isActive)
                if (role !== 'all') queryParams.append('role', role)

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
                method: 'PUT',
                body: userData,
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
    }),
})

export const {
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi