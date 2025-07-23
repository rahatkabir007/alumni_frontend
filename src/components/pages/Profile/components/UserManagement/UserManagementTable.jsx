"use client"
import ElegantCard from '@/components/common/ElegantCard'
import DataTable from '@/components/antd/Table/DataTable'
import CustomPagination from '@/components/antd/Pagination/CustomPagination'
import UserTableColumns from './UserTableColumns'

const UserManagementTable = ({
    users,
    pagination,
    isLoading,
    onTableChange,
    onPageChange,
    onActiveToggle,
    onConfirmModal,
    onRoleChange,
    canModifyUser,
    canBlockUser,
    permissions
}) => {
    const columns = UserTableColumns({
        onActiveToggle,
        onConfirmModal,
        onRoleChange,
        canModifyUser,
        canBlockUser,
        permissions
    })

    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <DataTable
                columns={columns}
                dataSource={users}
                loading={isLoading}
                onChange={onTableChange}
                locale={{
                    emptyText: 'No users found matching your criteria'
                }}
            />

            <CustomPagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={onPageChange}
                showTotal={pagination.showTotal}
            />
        </ElegantCard>
    )
}

export default UserManagementTable
