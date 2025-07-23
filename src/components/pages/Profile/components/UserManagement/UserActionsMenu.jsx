"use client"
import { EditOutlined, DeleteOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons'

const UserActionsMenu = ({ user, onRoleChange, onConfirmModal, permissions }) => {
    const { canChangeUserRole, canBlockUser, canDeleteUser } = permissions
    const menuItems = []

    if (canChangeUserRole) {
        menuItems.push({
            key: 'role-user',
            label: 'Set as User',
            icon: <EditOutlined />,
            onClick: () => onRoleChange(user.id, 'user')
        })
        menuItems.push({
            key: 'role-moderator',
            label: 'Set as Moderator',
            icon: <EditOutlined />,
            onClick: () => onRoleChange(user.id, 'moderator')
        })
        menuItems.push({
            key: 'role-admin',
            label: 'Set as Admin',
            icon: <EditOutlined />,
            onClick: () => onRoleChange(user.id, 'admin')
        })
        menuItems.push({ type: 'divider' })
    }

    if (canBlockUser) {
        menuItems.push({
            key: user.isActive ? 'block' : 'unblock',
            label: user.isActive ? 'Block User' : 'Unblock User',
            icon: user.isActive ? <StopOutlined /> : <CheckOutlined />,
            onClick: () => onConfirmModal(user.isActive ? 'block' : 'unblock', user)
        })
    }

    if (canDeleteUser) {
        menuItems.push({
            key: 'delete',
            label: 'Delete User',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => onConfirmModal('delete', user)
        })
    }

    return menuItems
}

export default UserActionsMenu
