"use client"
import { useState } from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'

const UserManagement = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('all-users')
    const [searchTerm, setSearchTerm] = useState('')

    const canManageUsers = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS)
    const canDeleteUser = checkUserPermission(userData.roles, PERMISSIONS.DELETE_USER)
    const canBlockUser = checkUserPermission(userData.roles, PERMISSIONS.BLOCK_USER)
    const canChangeUserRole = checkUserPermission(userData.roles, PERMISSIONS.CHANGE_USER_ROLE)

    // Mock user data
    const mockUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            roles: ['user'],
            status: 'active',
            joinedAt: '2024-01-15',
            lastActive: '2024-02-01'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            roles: ['user', 'moderator'],
            status: 'active',
            joinedAt: '2023-12-10',
            lastActive: '2024-01-30'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            roles: ['user'],
            status: 'blocked',
            joinedAt: '2023-11-05',
            lastActive: '2024-01-20'
        }
    ]

    const tabs = [
        { id: 'all-users', label: 'All Users', count: mockUsers.length },
        { id: 'active-users', label: 'Active', count: mockUsers.filter(u => u.status === 'active').length },
        { id: 'blocked-users', label: 'Blocked', count: mockUsers.filter(u => u.status === 'blocked').length },
        { id: 'moderators', label: 'Moderators', count: mockUsers.filter(u => u.roles.includes('moderator')).length }
    ]

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        switch (activeTab) {
            case 'active-users':
                return matchesSearch && user.status === 'active'
            case 'blocked-users':
                return matchesSearch && user.status === 'blocked'
            case 'moderators':
                return matchesSearch && user.roles.includes('moderator')
            default:
                return matchesSearch
        }
    })

    const handleRoleChange = (userId, newRole) => {
        console.log(`Changing role for user ${userId} to ${newRole}`)
        // Implement role change logic
    }

    const handleUserAction = (userId, action) => {
        console.log(`Performing ${action} on user ${userId}`)
        // Implement user actions (block, unblock, delete)
    }

    if (!canManageUsers) {
        return (
            <ElegantCard>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h4>
                    <p className="text-gray-600">You don't have permission to manage users</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <ElegantCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                    <div className="flex items-center gap-2">
                        {canManageUsers && <BlackTag variant="outline">Admin Access</BlackTag>}
                    </div>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                <BlackTag variant="subtle" size="xs" className="ml-2">
                                    {tab.count}
                                </BlackTag>
                            </button>
                        ))}
                    </nav>
                </div>
            </ElegantCard>

            {/* Users List */}
            <ElegantCard>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role, index) => (
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
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <BlackTag
                                            variant={user.status === 'active' ? 'solid' : 'outline'}
                                            size="xs"
                                            className={
                                                user.status === 'active'
                                                    ? 'bg-green-600 text-white'
                                                    : 'border-red-500 text-red-600'
                                            }
                                        >
                                            {user.status}
                                        </BlackTag>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.joinedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            {canChangeUserRole && (
                                                <select
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="">Change Role</option>
                                                    <option value="user">User</option>
                                                    <option value="moderator">Moderator</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            )}

                                            {canBlockUser && (
                                                <BlackButton
                                                    size="xs"
                                                    variant="outline"
                                                    onClick={() => handleUserAction(user.id, user.status === 'active' ? 'block' : 'unblock')}
                                                >
                                                    {user.status === 'active' ? 'Block' : 'Unblock'}
                                                </BlackButton>
                                            )}

                                            {canDeleteUser && (
                                                <BlackButton
                                                    size="xs"
                                                    variant="outline"
                                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleUserAction(user.id, 'delete')}
                                                >
                                                    Delete
                                                </BlackButton>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No users found matching your criteria</p>
                    </div>
                )}
            </ElegantCard>
        </div>
    )
}

export default UserManagement
