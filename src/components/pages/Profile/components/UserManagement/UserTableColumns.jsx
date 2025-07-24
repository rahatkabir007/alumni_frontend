"use client"
import { useState } from 'react'
import { Select } from 'antd'
import BlackTag from '@/components/common/BlackTag'
import CustomSwitch from '@/components/antd/Swtich/CustomSwitch'
import ActionPopover from '@/components/antd/Popover/ActionPopover'
import UserActionsMenu from './UserActionsMenu'

const UserTableColumns = ({
    onConfirmModal,
    onRoleChange,
    onStatusChange,
    canModifyUser,
    canBlockUser,
    permissions
}) => {
    const [editingStatus, setEditingStatus] = useState(null) // Track which row is being edited

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
    ]

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    border: 'border-green-200'
                }
            case 'inactive':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                    border: 'border-red-200'
                }
            case 'pending':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                    border: 'border-yellow-200'
                }
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-200'
                }
        }
    }

    const handleStatusEdit = (recordId) => {
        setEditingStatus(recordId)
    }

    const handleStatusCancel = () => {
        setEditingStatus(null)
    }

    const handleStatusSave = async (recordId, newStatus) => {
        try {
            await onStatusChange(recordId, newStatus)
            setEditingStatus(null)
        } catch (error) {
            // Error is handled in parent component
        }
    }

    const renderStatusField = (status, record) => {
        const currentStatus = status || 'pending'
        const canModify = canModifyUser(record) && canBlockUser
        const isEditing = editingStatus === record.id
        const styles = getStatusStyles(currentStatus)

        if (!canModify) {
            return (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles.bg} ${styles.text} ${styles.border}`}>
                    {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
                </div>
            )
        }

        if (isEditing) {
            return (
                <div className="flex items-center gap-2">
                    <Select
                        value={currentStatus}
                        onChange={(newStatus) => handleStatusSave(record.id, newStatus)}
                        size="small"
                        className="min-w-[110px]"
                        options={statusOptions}
                        autoFocus
                    />
                    <button
                        onClick={handleStatusCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cancel"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles.bg} ${styles.text} ${styles.border}`}>
                    {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
                </div>
                <button
                    onClick={() => handleStatusEdit(record.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit status"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            </div>
        )
    }

    return [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (text, record) => (
                <div className="flex items-center space-x-3">
                    {/* Profile Picture or Initial */}
                    <div className="flex-shrink-0">
                        {record.profilePhoto ? (
                            <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={record.profilePhoto}
                                alt={record.name}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                                {record.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {record.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                            {record.email}
                        </div>
                        {record.alumni_type && (
                            <div className="text-xs text-gray-400 capitalize">
                                {record.alumni_type}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            width: '20%',
            render: (roles) => (
                <div className="flex flex-wrap gap-1">
                    {roles?.map((role, index) => (
                        <BlackTag
                            key={index}
                            variant={role === 'admin' ? 'solid' : 'outline'}
                            size="xs"
                            className={
                                role === 'admin'
                                    ? 'bg-red-600 text-white border-red-600'
                                    : role === 'moderator'
                                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                                        : 'border-blue-500 text-blue-600 bg-blue-50'
                            }
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </BlackTag>
                    ))}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            render: (status, record) => renderStatusField(status, record),
        },
        {
            title: 'Joined',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '15%',
            render: (date) => {
                if (!date) return <span className="text-gray-400">N/A</span>

                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })

                return (
                    <div className="text-sm">
                        <div className="text-gray-900">{formattedDate}</div>
                        <div className="text-xs text-gray-500">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                    </div>
                )
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%',
            align: 'center',
            render: (_, record) => {
                const canModify = canModifyUser(record)
                if (!canModify) {
                    return (
                        <BlackTag variant="subtle" size="xs" className="text-gray-500 bg-gray-100">
                            Protected
                        </BlackTag>
                    )
                }

                const menuItems = UserActionsMenu({
                    user: record,
                    onRoleChange,
                    onConfirmModal,
                    permissions
                })

                if (!menuItems || menuItems.length === 0) {
                    return (
                        <BlackTag variant="subtle" size="xs" className="text-gray-400">
                            No Actions
                        </BlackTag>
                    )
                }

                return (
                    <ActionPopover
                        menuItems={menuItems}
                        buttonClassName="hover:bg-gray-100 rounded-md p-1"
                    />
                )
            },
        },
    ]
}

export default UserTableColumns
