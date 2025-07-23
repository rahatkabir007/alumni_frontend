"use client"
import BlackTag from '@/components/common/BlackTag'
import CustomSwitch from '@/components/antd/Swtich/CustomSwitch'
import ActionPopover from '@/components/antd/Popover/ActionPopover'
import UserActionsMenu from './UserActionsMenu'

const UserTableColumns = ({
    onActiveToggle,
    onConfirmModal,
    onRoleChange,
    canModifyUser,
    canBlockUser,
    permissions
}) => {
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
            dataIndex: 'isActive',
            key: 'isActive',
            width: '20%',
            render: (isActive, record) => (
                <div className="flex items-center gap-3">
                    <CustomSwitch
                        checked={isActive}
                        onChange={(checked) => onActiveToggle(record.id, checked)}
                        disabled={!canModifyUser(record) || !canBlockUser}
                        size="small"
                    />
                    <BlackTag
                        variant={isActive ? 'solid' : 'outline'}
                        size="xs"
                        className={
                            isActive
                                ? 'bg-green-600 text-white border-green-600'
                                : 'border-red-500 text-red-600 bg-red-50'
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
