"use client"
import BlackTag from '@/components/common/BlackTag'
import CustomSwitch from '@/components/antd/Swtich/CustomSwitch'
import ActionPopover from '@/components/common/ActionPopover'
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
                        onChange={(checked) => onActiveToggle(record.id, checked)}
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

                const menuItems = UserActionsMenu({
                    user: record,
                    onRoleChange,
                    onConfirmModal,
                    permissions
                })

                return (
                    <ActionPopover menuItems={menuItems} />
                )
            },
        },
    ]
}

export default UserTableColumns
