"use client"
import { useState, useEffect } from 'react'
import { Input, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import DataTable from '@/components/antd/Table/DataTable'
import UserTableColumns from './UserTableColumns'
import UserManagementModal from './UserManagementModal'
import UserDetailsModal from './UserDetailsModal'
import { useUserManagement } from '@/hooks/useUserManagement'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import {
    useGetUsersQuery,
    useUpdateStatusMutation,
    useDeleteUserMutation,
    useUpdateRoleMutation,
    useRemoveRoleMutation
} from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { handleApiError } from '@/utils/errorHandler'
import '@/styles/antd.css'

const UserManagement = ({ userData }) => {
    const {
        activeTab,
        currentPage,
        searchTerm,
        confirmModal,
        userDetailsModal,
        handleTabChange,
        handlePageChange,
        handleSearchChange,
        openConfirmModal,
        closeConfirmModal,
        setConfirmModalLoading,
        openUserDetailsModal,
        closeUserDetailsModal
    } = useUserManagement()

    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')

    // Separate queries for each tab to maintain counts
    const [tabCounts, setTabCounts] = useState({
        all: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        applied_for_verification: 0,
        rejected: 0,
        moderators: 0
    })

    // Permissions
    const permissions = {
        canManageUsers: checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS),
        canDeleteUser: checkUserPermission(userData.roles, PERMISSIONS.DELETE_USER),
        canBlockUser: checkUserPermission(userData.roles, PERMISSIONS.BLOCK_USER),
        canChangeUserRole: checkUserPermission(userData.roles, PERMISSIONS.CHANGE_USER_ROLE)
    }

    // Mutations
    const [updateStatus] = useUpdateStatusMutation()
    const [updateRole] = useUpdateRoleMutation()
    const [removeRole] = useRemoveRoleMutation()
    const [deleteUser] = useDeleteUserMutation()

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            handlePageChange(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm, handlePageChange])

    // Main query based on active tab
    const getQueryParams = () => {
        // MODERATOR RESTRICTION: Filter admin users for moderators
        const isCurrentUserModerator = userData.roles?.includes('moderator')
        const isCurrentUserAdmin = userData.roles?.includes('admin')

        const baseParams = {
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
            sortBy,
            sortOrder,
            // MODERATOR RESTRICTION: Exclude admin users for moderators
            excludeAdmins: isCurrentUserModerator && !isCurrentUserAdmin
        }

        switch (activeTab) {
            case 'active-users':
                return { ...baseParams, status: 'active' }
            case 'inactive-users':
                return { ...baseParams, status: 'inactive' }
            case 'pending-users':
                return { ...baseParams, status: 'pending' }
            case 'applied_for_verification':
                return { ...baseParams, status: 'applied_for_verification' }
            case 'rejected-users':
                return { ...baseParams, status: 'rejected' }
            case 'moderators':
                return { ...baseParams, role: 'moderator' }
            default:
                return { ...baseParams, status: 'all', role: 'all' }
        }
    }

    // Fetch users with server-side filtering
    const { data, isLoading, error, refetch } = useGetUsersQuery(
        getQueryParams(),
        { skip: !permissions.canManageUsers }
    )

    // Separate queries for tab counts (without pagination and search)
    const getCountQueryParams = (status = 'all', role = 'all') => {
        // MODERATOR RESTRICTION: Filter admin users for moderators in count queries
        const isCurrentUserModerator = userData.roles?.includes('moderator')
        const isCurrentUserAdmin = userData.roles?.includes('admin')

        return {
            page: 1,
            limit: 1000,
            status,
            role,
            // MODERATOR RESTRICTION: Exclude admin users for moderators
            excludeAdmins: isCurrentUserModerator && !isCurrentUserAdmin
        }
    }

    const { data: allUsersData } = useGetUsersQuery(
        getCountQueryParams('all', 'all'),
        { skip: !permissions.canManageUsers }
    )
    const { data: activeUsersData } = useGetUsersQuery(
        getCountQueryParams('active'),
        { skip: !permissions.canManageUsers }
    )
    const { data: inactiveUsersData } = useGetUsersQuery(
        getCountQueryParams('inactive'),
        { skip: !permissions.canManageUsers }
    )
    const { data: pendingUsersData } = useGetUsersQuery(
        getCountQueryParams('pending'),
        { skip: !permissions.canManageUsers }
    )
    const { data: appliedForVerificationData } = useGetUsersQuery(
        getCountQueryParams('applied_for_verification'),
        { skip: !permissions.canManageUsers }
    )
    const { data: rejectedUsersData } = useGetUsersQuery(
        getCountQueryParams('rejected'),
        { skip: !permissions.canManageUsers }
    )
    const { data: moderatorsData } = useGetUsersQuery(
        getCountQueryParams('all', 'moderator'),
        { skip: !permissions.canManageUsers }
    )

    // Update tab counts when data changes
    useEffect(() => {
        setTabCounts({
            all: allUsersData?.totalItems || 0,
            active: activeUsersData?.totalItems || 0,
            inactive: inactiveUsersData?.totalItems || 0,
            pending: pendingUsersData?.totalItems || 0,
            applied_for_verification: appliedForVerificationData?.totalItems || 0,
            rejected: rejectedUsersData?.totalItems || 0,
            moderators: moderatorsData?.totalItems || 0
        })
    }, [allUsersData, activeUsersData, inactiveUsersData, pendingUsersData, appliedForVerificationData, rejectedUsersData, moderatorsData])

    // Extract users and pagination from API response
    const users = data?.users || []
    const pagination = {
        current: currentPage,
        pageSize: data?.itemsPerPage || 10,
        total: data?.totalItems || 0,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
    }

    // Event Handlers
    const handleSearchInputChange = (e) => {
        handleSearchChange(e.target.value)
    }

    const handleConfirmAction = async () => {
        const { type, user } = confirmModal
        setConfirmModalLoading(true)

        try {
            if (type === 'delete') {
                await deleteUser(user.id).unwrap()
                ToastMessage.notifySuccess('User deleted successfully')
            } else if (type === 'block') {
                await updateStatus({
                    userId: user.id,
                    status: 'inactive'
                }).unwrap()
                ToastMessage.notifySuccess('User blocked successfully')
            } else if (type === 'unblock') {
                await updateStatus({
                    userId: user.id,
                    status: 'active'
                }).unwrap()
                ToastMessage.notifySuccess('User unblocked successfully')
            }
            refetch()
            closeConfirmModal()
        } catch (error) {
            handleApiError(error, null, true, `Failed to ${type} user`)
            setConfirmModalLoading(false)
        }
    }

    // Helper functions
    const canModifyUser = (targetUser) => {
        const isCurrentUserAdmin = userData.roles?.includes('admin')
        const isCurrentUserModerator = userData.roles?.includes('moderator')
        const isTargetAdmin = targetUser.roles?.includes('admin')
        const isTargetModerator = targetUser.roles?.includes('moderator')
        const targetUserStatus = targetUser.status || 'pending'


        // MODERATOR RESTRICTION: Moderators should never see admin users (this is a safety check)
        if (isCurrentUserModerator && !isCurrentUserAdmin && isTargetAdmin) {
            return false
        }

        // Admins can modify anyone except other admins
        if (isCurrentUserAdmin) {
            return !isTargetAdmin
        }

        // MODERATOR RESTRICTION: Moderators can only modify regular users who are pending
        if (isCurrentUserModerator) {
            return !isTargetAdmin && !isTargetModerator && (targetUserStatus === 'pending' || targetUserStatus === 'applied_for_verification' || targetUserStatus === 'rejected')
        }

        return false
    }

    // MODERATOR RESTRICTION: Client-side filter function to ensure no admin users are shown to moderators
    const filterUsersForModerator = (user) => {
        const isCurrentUserModerator = userData.roles?.includes('moderator')
        const isCurrentUserAdmin = userData.roles?.includes('admin')
        const isUserAdmin = user.roles?.includes('admin')

        // If current user is moderator (but not admin), filter out admin users
        if (isCurrentUserModerator && !isCurrentUserAdmin && isUserAdmin) {
            return false
        }

        return true
    }

    // Add missing handler functions
    const handleStatusChange = async (userId, newStatus) => {
        try {
            // MODERATOR RESTRICTION: Enhanced validation for moderator actions
            const isCurrentUserModerator = userData.roles?.includes('moderator')
            const isCurrentUserAdmin = userData.roles?.includes('admin')

            // Find the target user to check their current status
            const targetUser = users.find(user => user.id === userId)
            const currentUserStatus = targetUser?.status || 'pending'

            // MODERATOR RESTRICTION: Moderators can only edit pending users
            if (isCurrentUserModerator && !isCurrentUserAdmin) {
                if (currentUserStatus !== 'pending' && currentUserStatus !== 'applied_for_verification' && currentUserStatus !== 'rejected') {
                    ToastMessage.notifyWarning('Moderators can only edit pending, ongoing or rejected users. Once a user is active or inactive, only admins can modify their status.')
                    return
                }

                // MODERATOR RESTRICTION: Moderators can only change pending users to active
                if (newStatus === 'inactive') {
                    ToastMessage.notifyWarning('Moderators cannot set users to inactive status. Only admins can block users.')
                    return
                }
            }

            await updateStatus({
                userId,
                status: newStatus
            }).unwrap()

            // MODERATOR RESTRICTION: Show appropriate success message
            if (isCurrentUserModerator && !isCurrentUserAdmin && newStatus === 'active') {
                ToastMessage.notifySuccess('User has been successfully activated!')
            } else {
                ToastMessage.notifySuccess(`User status updated to ${newStatus}`)
            }

            refetch()
        } catch (error) {
            handleApiError(error, null, true, 'Failed to update user status')
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateRole({
                userId,
                role: newRole
            }).unwrap()
            ToastMessage.notifySuccess(`User role updated to ${newRole}`)
            refetch()
        } catch (error) {
            handleApiError(error, null, true, 'Failed to update user role')
        }
    }

    const handleRoleRemove = async (userId, roleToRemove) => {
        try {
            await removeRole({
                userId,
                role: roleToRemove
            }).unwrap()
            ToastMessage.notifySuccess(`${roleToRemove} role removed successfully`)
            refetch()
        } catch (error) {
            handleApiError(error, null, true, `Failed to remove ${roleToRemove} role`)
        }
    }

    // Handler for user name click
    const handleUserClick = (userId) => {
        openUserDetailsModal(userId)
    }

    // Table columns configuration
    const columns = UserTableColumns({
        onStatusChange: handleStatusChange,
        onConfirmModal: openConfirmModal,
        onRoleChange: handleRoleChange,
        onRoleRemove: handleRoleRemove,
        canModifyUser,
        canBlockUser: permissions.canBlockUser,
        permissions,
        currentUserRoles: userData.roles,
        onUserClick: handleUserClick // Pass the click handler
    })

    // Tab items configuration with dynamic counts
    const tabItems = [
        {
            key: 'all-users',
            label: `All Users (${tabCounts.all})`,
        },
        {
            key: 'active-users',
            label: `Active (${tabCounts.active})`,
        },
        {
            key: 'inactive-users',
            label: `Inactive (${tabCounts.inactive})`,
        },
        {
            key: 'pending-users',
            label: `Pending (${tabCounts.pending})`,
        },
        {
            key: 'applied_for_verification',
            label: `Applied for Verification (${tabCounts.applied_for_verification})`,
        },
        {
            key: 'rejected-users',
            label: `Rejected (${tabCounts.rejected})`,
        },
        {
            key: 'moderators',
            label: `Moderators (${tabCounts.moderators})`,
        },
    ]

    // Access denied component
    if (!permissions.canManageUsers) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h4>
                    <p className="text-gray-600">You don&apos;t have permission to manage users</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <div className="space-y-6">
            {/* Error Display */}
            {/* {error && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-6 text-red-600">
                        <p>Error: {error.message || 'Something went wrong'}</p>
                        <BlackButton
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="mt-2"
                        >
                            Try Again
                        </BlackButton>
                    </div>
                </ElegantCard>
            )} */}

            {/* Combined Header, Filters and Table */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                    <div className="flex items-center gap-2">
                        {/* MODERATOR RESTRICTION: Show different access badges */}
                        {userData.roles?.includes('admin') && (
                            <BlackTag variant="outline">Admin Access</BlackTag>
                        )}
                        {userData.roles?.includes('moderator') && !userData.roles?.includes('admin') && (
                            <BlackTag variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                Moderator Access
                            </BlackTag>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        prefix={<SearchOutlined />}
                        size="large"
                        className="w-full"
                    />
                </div>

                {/* Tabs */}
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    className="user-management-tabs mb-6"
                    items={tabItems}
                />

                {/* Users Table */}
                <DataTable
                    columns={columns}
                    data={users}
                    loading={isLoading}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.current}
                    setCurrentPage={handlePageChange}
                    total={pagination.total}
                    className="user-management-table"
                    rowKeyProp="id"
                    // MODERATOR RESTRICTION: Apply client-side filtering for moderators
                    filterFunction={userData.roles?.includes('moderator') && !userData.roles?.includes('admin') ? filterUsersForModerator : null}
                />
            </ElegantCard>

            {/* Confirmation Modal */}
            <UserManagementModal
                confirmModal={confirmModal}
                onConfirm={handleConfirmAction}
                onClose={closeConfirmModal}
            />

            {/* User Details Modal */}
            <UserDetailsModal
                isOpen={userDetailsModal.isOpen}
                onClose={closeUserDetailsModal}
                userId={userDetailsModal.userId}
            />
        </div>
    )
}

export default UserManagement