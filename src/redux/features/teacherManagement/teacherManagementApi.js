import { apiSlice } from '../api/apiSlice'

export const teacherManagementApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeacherManagementList: builder.query({
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
                queryParams.append('alumni_type', "teacher_management")

                return `/users/verified?${queryParams.toString()}`
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

        updateTeacherManagement: builder.mutation({
            query: ({ userId, userData }) => ({
                url: `/users/${userId}`,
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        getTeacherManagementById: builder.query({
            query: ({ userId, includeDetails }) => `/users/${userId}?includeDetails=${includeDetails}`,
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                throw new Error(response.message || 'Failed to fetch user data')
            },
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
        }),
    }),
})

export const {
    useGetTeacherManagementListQuery,
    useGetTeacherManagementByIdQuery,
    useLazyGetTeacherManagementByIdQuery,
    useUpdateTeacherManagementMutation,
} = teacherManagementApi