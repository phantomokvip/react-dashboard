import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table, Pagination, Spin, Col, Row, Checkbox } from "antd";

const DataTable = ({
    listData,
    pageSize,
    columns,
    indexPage,
    totalPage,
    onPageChange,
    loading,
    selectedRowKeys,
    setSelectedRowKeys
}) => {
    const [pageSizeOptions, setPageSizeOptions] = useState([10, 20, 50, 100]);
    const [showSizeChanger, setShowSizeChanger] = useState(true);
    
    useEffect(() => {
        if (totalPage >= 100) setPageSizeOptions([10, 20, 50, 100]);
        if (totalPage < 100) setPageSizeOptions([10, 20, 50, 100]);
        if (totalPage < 50) setPageSizeOptions([10, 20, 50]);
        if (totalPage < 20) setPageSizeOptions([10, 20]);
        if (totalPage < 10) setPageSizeOptions([10]);
    }, [listData])
    
    const handleSelect = (record, selected) => {
        if (selected) {
            setSelectedRowKeys((keys) => [...keys, record.key]);
        } else {
            setSelectedRowKeys((keys) => {
                const index = keys.indexOf(record.key);
                return [...keys.slice(0, index), ...keys.slice(index + 1)];
            });
        }
    };

    const toggleSelectAll = () => {
        setSelectedRowKeys((keys) =>
            keys.length === listData.length ? [] : listData.map((r) => r.key)
        );
    };

    const headerCheckbox = (
        selectedRowKeys ? 
        <Checkbox
            checked={selectedRowKeys?.length}
            indeterminate={
                selectedRowKeys?.length > 0 && selectedRowKeys?.length < listData?.length
            }
            onChange={toggleSelectAll}
        /> : null
    );
    
    const rowSelection = {
        selectedRowKeys,
        type: "checkbox",
        fixed: true,
        onSelect: handleSelect,
        columnTitle: headerCheckbox
    };

    return (
        <>
            {listData.length === 0 || loading ? (
                <Spin size="large" className="spin" />
            ) : (
                <div>
                    <Table
                        columns={columns}
                        dataSource={listData}
                        pagination={false}
                        rowSelection={selectedRowKeys ? rowSelection : null}
                    />
                    <Row gutter={10} className="pagination">
                        <Col span={24} className="mt-1 text-center">
                            <Pagination
                                showSizeChanger={showSizeChanger}
                                pageSizeOptions={pageSizeOptions}
                                current={indexPage}
                                total={totalPage}
                                pageSize={pageSize}
                                onChange={onPageChange}

                            />
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
};

DataTable.propTypes = {
    listData: PropTypes.any,
    pageSize: PropTypes.number,
    columns: PropTypes.array,
    indexPage: PropTypes.number,
    totalPage: PropTypes.number,
    onPageChange: PropTypes.func,
    loading: PropTypes.bool,
    selectedRowKeys: PropTypes.any,
    setSelectedRowKeys: PropTypes.any
};
export default DataTable;
