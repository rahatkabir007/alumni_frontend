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
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import {
    useGetUsersQuery,
    useUpdateUserMutation,
    useUpdateStatusMutation,
    useDeleteUserMutation,
    useUpdateRoleMutation,
    useRemoveRoleMutation
} from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { handleApiError } from '@/utils/errorHandler'
import '@/styles/antd.css'

const UserManagement = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('all-users')
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        type: '',
        user: null,
        loading: false
    })

    // Separate queries for each tab to maintain counts
    const [tabCounts, setTabCounts] = useState({
        all: 0,
        active: 0,
        inactive: 0,
        pending: 0,
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
    // const [updateUser] = useUpdateUserMutation()
    const [updateStatus] = useUpdateStatusMutation()
    const [updateRole] = useUpdateRoleMutation()
    const [removeRole] = useRemoveRoleMutation()
    const [deleteUser] = useDeleteUserMutation()

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Main query based on active tab
    const getQueryParams = () => {
        const baseParams = {
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
            sortBy,
            sortOrder
        }

        switch (activeTab) {
            case 'active-users':
                return { ...baseParams, status: 'active' }
            case 'inactive-users':
                return { ...baseParams, status: 'inactive' }
            case 'pending-users':
                return { ...baseParams, status: 'pending' }
            case 'moderators':
                return { ...baseParams, role: 'moderator' }
            default:
                return { ...baseParams, status: 'all', role: 'all' }
        }
    }

    // Fetch users with server-side filtering
    const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery(
        getQueryParams(),
        { skip: !permissions.canManageUsers }
    )

    // Separate queries for tab counts (without pagination and search)
    const { data: allUsersData } = useGetUsersQuery(
        { page: 1, limit: 1000, status: 'all', role: 'all' },
        { skip: !permissions.canManageUsers }
    )
    const { data: activeUsersData } = useGetUsersQuery(
        { page: 1, limit: 1000, status: 'active' },
        { skip: !permissions.canManageUsers }
    )
    const { data: inactiveUsersData } = useGetUsersQuery(
        { page: 1, limit: 1000, status: 'inactive' },
        { skip: !permissions.canManageUsers }
    )
    const { data: pendingUsersData } = useGetUsersQuery(
        { page: 1, limit: 1000, status: 'pending' },
        { skip: !permissions.canManageUsers }
    )
    const { data: moderatorsData } = useGetUsersQuery(
        { page: 1, limit: 1000, role: 'moderator' },
        { skip: !permissions.canManageUsers }
    )

    // Update tab counts when data changes
    useEffect(() => {
        setTabCounts({
            all: allUsersData?.totalItems || 0,
            active: activeUsersData?.totalItems || 0,
            inactive: inactiveUsersData?.totalItems || 0,
            pending: pendingUsersData?.totalItems || 0,
            moderators: moderatorsData?.totalItems || 0
        })
    }, [allUsersData, activeUsersData, inactiveUsersData, pendingUsersData, moderatorsData])

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
    const handleSearchChange = (e) => setSearchTerm(e.target.value)
    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        setCurrentPage(1)
    }
    const handlePageChange = (page) => setCurrentPage(page)

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateStatus({
                userId,
                status: newStatus
            }).unwrap()
            ToastMessage.notifySuccess(`User status updated to ${newStatus}`)
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

    const handleConfirmAction = async () => {
        const { type, user } = confirmModal
        setConfirmModal(prev => ({ ...prev, loading: true }))

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
            setConfirmModal({ open: false, type: '', user: null, loading: false })
        } catch (error) {
            handleApiError(error, null, true, `Failed to ${type} user`)
            setConfirmModal(prev => ({ ...prev, loading: false }))
        }
    }

    const openConfirmModal = (type, user) => {
        setConfirmModal({
            open: true,
            type,
            user,
            loading: false
        })
    }

    const closeConfirmModal = () => {
        setConfirmModal({ open: false, type: '', user: null, loading: false })
    }

    // Helper functions
    const isAdminUser = (user) => user.roles?.includes('admin')
    const canModifyUser = (targetUser) => {
        // Only allow modification if current user is admin and target is not admin
        const isCurrentUserAdmin = userData.roles?.includes('admin')
        const isTargetAdmin = targetUser.roles?.includes('admin')
        return isCurrentUserAdmin && !isTargetAdmin
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
        currentUserRoles: userData.roles
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
            {error && (
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
            )}

            {/* Combined Header, Filters and Table */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                    <div className="flex items-center gap-2">
                        {permissions.canManageUsers && <BlackTag variant="outline">Admin Access</BlackTag>}
                    </div>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
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
                />
            </ElegantCard>

            {/* Confirmation Modal */}
            <UserManagementModal
                confirmModal={confirmModal}
                onConfirm={handleConfirmAction}
                onClose={closeConfirmModal}
            />
        </div>
    )
}

export default UserManagement
