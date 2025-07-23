"use client"
import { useState, useEffect } from 'react'
import { Table, Pagination, Input, Tabs, Popover, Menu, Button } from 'antd'
import { SearchOutlined, MoreOutlined, EditOutlined, DeleteOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import CustomSwitch from '@/components/antd/Swtich/CustomSwitch'
import ConfirmationModal from '@/components/antd/Modal/ConfirmationModal'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import {
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
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

    // Permissions
    const canManageUsers = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS)
    const canDeleteUser = checkUserPermission(userData.roles, PERMISSIONS.DELETE_USER)
    const canBlockUser = checkUserPermission(userData.roles, PERMISSIONS.BLOCK_USER)
    const canChangeUserRole = checkUserPermission(userData.roles, PERMISSIONS.CHANGE_USER_ROLE)

    // Mutations
    const [updateUser] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1) // Reset to first page when searching
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Fetch users with server-side filtering
    const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        isActive: activeTab === 'active-users' ? true : activeTab === 'blocked-users' ? false : 'all',
        role: activeTab === 'moderators' ? 'moderator' : 'all',
        sortBy,
        sortOrder
    }, {
        skip: !canManageUsers
    })

    // Extract users and pagination from API response
    const users = data?.users || []
    const pagination = {
        current: data?.currentPage || 1,
        pageSize: data?.itemsPerPage || 10,
        total: data?.totalItems || 0,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        setCurrentPage(1)
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page)
    }

    const handleTableChange = (pagination, filters, sorter) => {
        if (sorter.field) {
            setSortBy(sorter.field)
            setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc')
            setCurrentPage(1)
        }
    }

    const handleActiveToggle = async (userId, newStatus) => {
        try {
            await updateUser({
                userId,
                userData: { isActive: newStatus }
            }).unwrap()
            ToastMessage.notifySuccess(`User ${newStatus ? 'activated' : 'deactivated'} successfully`)
            refetch()
        } catch (error) {
            handleApiError(error, null, true, 'Failed to update user status')
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUser({
                userId,
                userData: { roles: [newRole] }
            }).unwrap()
            ToastMessage.notifySuccess(`User role updated to ${newRole}`)
            refetch()
        } catch (error) {
            handleApiError(error, null, true, 'Failed to update user role')
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
                await updateUser({
                    userId: user.id,
                    userData: { isActive: false }
                }).unwrap()
                ToastMessage.notifySuccess('User blocked successfully')
            } else if (type === 'unblock') {
                await updateUser({
                    userId: user.id,
                    userData: { isActive: true }
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

    // Helper functions
    const isAdminUser = (user) => user.roles?.includes('admin')
    const canModifyUser = (targetUser) => !isAdminUser(targetUser)

    // User Actions Menu for Popover
    const getUserActionsMenu = (user) => {
        const canModify = canModifyUser(user)
        if (!canModify) return null

        const menuItems = []

        if (canChangeUserRole) {
            menuItems.push({
                key: 'role-user',
                label: 'Set as User',
                icon: <EditOutlined />,
                onClick: () => handleRoleChange(user.id, 'user')
            })
            menuItems.push({
                key: 'role-moderator',
                label: 'Set as Moderator',
                icon: <EditOutlined />,
                onClick: () => handleRoleChange(user.id, 'moderator')
            })
            menuItems.push({
                key: 'role-admin',
                label: 'Set as Admin',
                icon: <EditOutlined />,
                onClick: () => handleRoleChange(user.id, 'admin')
            })
            menuItems.push({ type: 'divider' })
        }

        if (canBlockUser) {
            menuItems.push({
                key: user.isActive ? 'block' : 'unblock',
                label: user.isActive ? 'Block User' : 'Unblock User',
                icon: user.isActive ? <StopOutlined /> : <CheckOutlined />,
                onClick: () => openConfirmModal(user.isActive ? 'block' : 'unblock', user)
            })
        }

        if (canDeleteUser) {
            menuItems.push({
                key: 'delete',
                label: 'Delete User',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => openConfirmModal('delete', user)
            })
        }

        return { items: menuItems }
    }

    // Table columns configuration
    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (text, record) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    <div className="text-sm text-gray-500">{record.email}</div>
                </div>
            ),
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <div className="flex flex-wrap gap-1">
                    {roles?.map((role, index) => (
                        <BlackTag
                            key={index}
                            variant={role === 'admin' ? 'solid' : 'outline'}
                            size="xs"
                            className={
                                role === 'admin'
                                    ? 'bg-red-600 text-white'
                                    : role === 'moderator'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-blue-500 text-blue-600'
                            }
                        >
                            {role}
                        </BlackTag>
                    ))}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            sorter: true,
            render: (isActive, record) => (
                <div className="flex items-center gap-2">
                    <CustomSwitch
                        checked={isActive}
                        onChange={(checked) => handleActiveToggle(record.id, checked)}
                        disabled={!canModifyUser(record) || !canBlockUser}
                    />
                    <BlackTag
                        variant={isActive ? 'solid' : 'outline'}
                        size="xs"
                        className={
                            isActive
                                ? 'bg-green-600 text-white'
                                : 'border-red-500 text-red-600'
                        }
                    >
                        {isActive ? 'Active' : 'Blocked'}
                    </BlackTag>
                </div>
            ),
        },
        {
            title: 'Joined',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: true,
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_, record) => {
                const canModify = canModifyUser(record)
                if (!canModify) {
                    return (
                        <BlackTag variant="subtle" size="xs" className="text-gray-500">
                            Protected
                        </BlackTag>
                    )
                }

                const menu = getUserActionsMenu(record)
                if (!menu || menu.items.length === 0) return null

                return (
                    <Popover
                        content={<Menu {...menu} className="user-action-menu" />}
                        trigger="click"
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            size="small"
                            className="hover:bg-gray-100"
                        />
                    </Popover>
                )
            },
        },
    ]

    const tabItems = [
        {
            key: 'all-users',
            label: `All Users (${pagination.total || 0})`,
        },
        {
            key: 'active-users',
            label: `Active (${users.filter(u => u.isActive).length})`,
        },
        {
            key: 'blocked-users',
            label: `Blocked (${users.filter(u => !u.isActive).length})`,
        },
        {
            key: 'moderators',
            label: `Moderators (${users.filter(u => u.roles?.includes('moderator')).length})`,
        },
    ]

    const getConfirmModalProps = () => {
        const { type, user } = confirmModal

        const props = {
            isModalOpen: confirmModal.open,
            setModalHandler: () => setConfirmModal({ open: false, type: '', user: null, loading: false }),
            onConfirm: handleConfirmAction,
            loading: confirmModal.loading,
            centered: true,
            width: 500,
        }

        switch (type) {
            case 'delete':
                return {
                    ...props,
                    title: `Delete ${user?.name || 'User'}?`,
                    confirmButtonTitle: 'Delete',
                    confirmButtonClassName: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                }
            case 'block':
                return {
                    ...props,
                    title: `Block ${user?.name || 'User'}?`,
                    confirmButtonTitle: 'Block',
                    confirmButtonClassName: 'bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700',
                }
            case 'unblock':
                return {
                    ...props,
                    title: `Unblock ${user?.name || 'User'}?`,
                    confirmButtonTitle: 'Unblock',
                    confirmButtonClassName: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
                }
            default:
                return props
        }
    }

    if (!canManageUsers) {
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
            {/* Header */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                    <div className="flex items-center gap-2">
                        {canManageUsers && <BlackTag variant="outline">Admin Access</BlackTag>}
                        <BlackButton
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isFetching}
                        >
                            {isFetching ? 'Refreshing...' : 'Refresh'}
                        </BlackButton>
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
                    className="user-management-tabs"
                    items={tabItems}
                />
            </ElegantCard>

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

            {/* Users Table */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={isLoading}
                    pagination={false}
                    onChange={handleTableChange}
                    locale={{
                        emptyText: 'No users found matching your criteria'
                    }}
                    scroll={{ x: 800 }}
                />

                {/* Custom Pagination */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                        {pagination.showTotal(pagination.total, [
                            ((pagination.current - 1) * pagination.pageSize) + 1,
                            Math.min(pagination.current * pagination.pageSize, pagination.total)
                        ])}
                    </div>
                    <Pagination
                        {...pagination}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                    />
                </div>
            </ElegantCard>

            {/* Confirmation Modal */}
            <ConfirmationModal {...getConfirmModalProps()} />
        </div>
    )
}

export default UserManagement
