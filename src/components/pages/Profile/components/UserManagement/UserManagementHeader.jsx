"use client"
import { Input, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'

const UserManagementHeader = ({
    searchTerm,
    onSearchChange,
    activeTab,
    onTabChange,
    tabItems,
    canManageUsers,
    onRefresh,
    isFetching
}) => {
    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                <div className="flex items-center gap-2">
                    {canManageUsers && <BlackTag variant="outline">Admin Access</BlackTag>}
                    <BlackButton
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
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
                    onChange={onSearchChange}
                    prefix={<SearchOutlined />}
                    size="large"
                    className="w-full"
                />
            </div>

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onChange={onTabChange}
                className="user-management-tabs"
                items={tabItems}
            />
        </ElegantCard>
    )
}

export default UserManagementHeader
