"use client"
import ElegantCard from '@/components/common/ElegantCard'
import DataTable from '@/components/antd/Table/DataTable'
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
                data={users}
                loading={isLoading}
                pageSize={pagination.pageSize}
                currentPage={pagination.current}
                setCurrentPage={onPageChange}
                total={pagination.total}
                className="user-management-table"
                rowKeyProp="id"
            />
        </ElegantCard>
    )
}

export default UserManagementTable