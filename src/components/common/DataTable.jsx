"use client"
import { Table } from 'antd'
import '@/styles/antd.css'

const DataTable = ({
    columns,
    dataSource,
    loading = false,
    rowKey = "id",
    onChange,
    scroll = { x: 800 },
    locale = { emptyText: 'No data found' },
    ...tableProps
}) => {
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={rowKey}
            loading={loading}
            pagination={false}
            onChange={onChange}
            locale={locale}
            scroll={scroll}
            {...tableProps}
        />
    )
}

export default DataTable
