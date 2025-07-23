"use client";
import { useState } from "react";
import { Table, Pagination } from "antd";
import "@/styles/antd.css";

//  <CustomTable2
//    columns={columns}
//    data={savedSearchList}
//    className="deal-hunter-saved-search-table"
//    pageSize={5}
//    currentPage={currentPage}
//    setCurrentPage={setCurrentPage}
//    total={savedSearchCount?.total}
//    loading={loading}
//  />;

const DataTable = ({
    columns,
    data,
    className = "",
    pageSize = null,
    selectedRows = null,
    setSelectedRows = null,
    // scrollWidth,
    currentPage = null,
    setCurrentPage = null,
    total = null,
    loading = false,
    rowClassName,
    customStyles,
    rowKeyProp = "id",
}) => {
    const [currentPageInside, setCurrentPageInside] = useState(1);

    // console.log("selected Rows ", selectedRows);

    const onChangePagination = (page) => {
        if (currentPage !== null) {
            setCurrentPage(page);
        } else {
            setCurrentPageInside(page);
        }
    };
    let paginatedData, startRange, endRange;

    if (pageSize !== null) {
        const startIndex =
            currentPage !== null
                ? (currentPage - 1) * pageSize
                : (currentPageInside - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        paginatedData = data?.slice(startIndex, endIndex);

        startRange = startIndex + 1;
        endRange = Math.min(startIndex + data?.length);
    }

    let finalData = data;

    if (pageSize !== null) {
        finalData = paginatedData?.length === 0 ? data : paginatedData;
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log("params", pagination, filters, sorter, extra);
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            if (selectedRows) {
                setSelectedRows(selectedRowKeys);
            }
        },
    };


    return (
        <>


            <div className="flex flex-col gap-4 font-roboto">
                <Table
                    rowSelection={selectedRows && {
                        ...rowSelection,
                    }}
                    size={className === "sku-matching-table" ? "small" : ""}
                    rowKey={(data) => data[rowKeyProp]}
                    columns={columns}
                    className={`custom-table-1 ${className} ${customStyles}`}
                    dataSource={finalData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    rowClassName={rowClassName}
                    onChange={onChange}
                    loading={loading}
                />

                {pageSize !== null && (
                    <div className="flex justify-between items-center pagination-container sticky px-2">
                        <div className="showing-result-number">
                            {
                                finalData?.length > 0 && <span className="text-[#6B7280] text-base font-inter_i">
                                    Showing{" "}
                                    <span className="text-foundation-green-medium font-semibold">
                                        {startRange}-{endRange}
                                    </span>{" "}
                                    of{" "}
                                    <span className="text-foundation-green-medium font-semibold">
                                        {total}
                                    </span>{" "}
                                    Data
                                </span>
                            }
                        </div>
                        <Pagination
                            showSizeChanger={false}
                            current={currentPage !== null ? currentPage : currentPageInside}
                            pageSize={pageSize}
                            onChange={onChangePagination}
                            total={total !== null ? total : data?.length}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default DataTable;