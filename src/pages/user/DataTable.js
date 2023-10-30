import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table, Pagination, Spin, Col, Row } from "antd";

const DataTable = ({
    usersData,
    pageSize,
    columns,
    indexPage,
    totalPage,
    onPageChange,
    loading,
}) => {
    const [pageSizeOptions, setPageSizeOptions] = useState([10, 20, 50, 100]);
    // const [showSizeChanger, setShowSizeChanger] = useState(true);

    useEffect(() => {
        if (totalPage >= 100) setPageSizeOptions([10, 20, 50, 100]);
        if (totalPage < 100) setPageSizeOptions([10, 20, 50, 100]);
        if (totalPage < 50) setPageSizeOptions([10, 20, 50]);
        if (totalPage < 20) setPageSizeOptions([10, 20]);
        if (totalPage < 10) setPageSizeOptions([10]);
        // eslint-disable-next-line
    }, [usersData])

    return (
        <>
            {loading ? (
                <div className='w-full min-h-[70vh] flex items-center justify-center '>
                    <Spin size='large' />
                </div>
            ) : (
                <div>
                    <Table
                        columns={columns}
                        dataSource={usersData}
                        pagination={false}
                    />
                    <Row gutter={10} className="pagination">
                        <Col span={24} className="mt-1 text-center">
                            <Pagination className="flex justify-end"
                                // showSizeChanger={showSizeChanger}
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
};
export default DataTable;
