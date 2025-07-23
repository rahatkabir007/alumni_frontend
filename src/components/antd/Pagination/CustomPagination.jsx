"use client"
import { Pagination } from 'antd'
import '@/styles/antd.css'

const CustomPagination = ({
    current = 1,
    pageSize = 10,
    total = 0,
    onChange,
    showSizeChanger = false,
    showQuickJumper = false,
    showTotal,
    className = "",
    ...paginationProps
}) => {
    const defaultShowTotal = (total, range) =>
        `Showing ${range[0]} to ${range[1]} of ${total} results`

    return (
        <div className={`flex justify-between items-center mt-6 pt-4 border-t border-gray-200 ${className}`}>
            <div className="text-sm text-gray-700">
                {(showTotal || defaultShowTotal)(total, [
                    ((current - 1) * pageSize) + 1,
                    Math.min(current * pageSize, total)
                ])}
            </div>
            <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={onChange}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
                {...paginationProps}
            />
        </div>
    )
}

export default CustomPagination
