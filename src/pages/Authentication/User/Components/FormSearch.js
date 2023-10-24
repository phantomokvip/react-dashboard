import React from "react";
import PropTypes from "prop-types";
import {
    Input,
    Button,
    Form,
    Space,
    Select,
    DatePicker,
    Col,
    Row,
    Card,
    TreeSelect,
} from "antd";

const { Option } = Select;
const { TreeNode } = TreeSelect;
const FormSearch = ({
    isLoadingExportExcel,
    treeSelectProps,
    formSearch,
    handleSearch,
    handleRefresh,
    handleNewEmployee,
    listRole,
    handleImportExcel,
    handleExportExcel,
    handleDeleteSelectRows,
    selectedRowKeys,
    loadingDeleteRows,
    userStatus
}) => {
    const { treeData, treeDataDepartmentValue } = treeSelectProps;

    return (
        <Card>
            <Form
                form={formSearch}
                layout="vertical"
                autoComplete="off"
                className="pl-1"
            >
                <Row gutter={10}>
                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập:"
                            rules={[
                                {
                                    message: "Vui lòng nhập tên đăng nhập!",
                                    type: "string",
                                    min: 1,
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tên đăng nhập" allowClear={true} />
                        </Form.Item>
                    </Col>
                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item
                            name="fullName"
                            label="Họ tên:"
                            rules={[
                                {
                                    message: "Vui lòng nhập họ tên!",
                                    type: "string",
                                    min: 1,
                                },
                            ]}
                        >
                            <Input placeholder="Nhập họ tên" allowClear={true} />
                        </Form.Item>
                    </Col>

                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item name="phoneNumber" label="Số điện thoại:">
                            <Input placeholder="Nhập số điện thoại" allowClear={true} />
                        </Form.Item>
                    </Col>

                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item name="email" label="Email:">
                            <Input placeholder="Nhập email" allowClear={true} />
                        </Form.Item>
                    </Col>

                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item name="department" label="Công ty, bộ phận và tổ:">
                            <TreeSelect
                                showSearch
                                treeNodeFilterProp="title"
                                style={{ width: "100%" }}
                                value={treeDataDepartmentValue}
                                placeholder="Chọn công ty, bộ phận và tổ"
                                allowClear
                                onChange={() => handleSearch()}
                            >
                                {treeData &&
                                    treeData?.map((data) => {
                                        return (
                                            <TreeNode
                                                key={data.key}
                                                value={data.value}
                                                title={data.title}
                                            >
                                                {data.children.length > 0
                                                    ? data.children.map((child) => {
                                                        return (
                                                            <TreeNode
                                                                key={child.key}
                                                                value={child.value}
                                                                title={child.title}
                                                            >
                                                                {child.children.length > 0
                                                                    ? child.children.map((childOfChild) => {
                                                                        return (
                                                                            <TreeNode
                                                                                key={childOfChild.key}
                                                                                value={childOfChild.value}
                                                                                title={childOfChild.title}
                                                                            />
                                                                        );
                                                                    })
                                                                    : null}
                                                            </TreeNode>
                                                        );
                                                    })
                                                    : null}
                                            </TreeNode>
                                        );
                                    })}
                            </TreeSelect>
                        </Form.Item>
                    </Col>

                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item name="roleName" label="Vai trò:">
                            <Select
                                placeholder="Chọn vai trò"
                                allowClear
                                showSearch
                                mode="multiple"
                                onChange={() => handleSearch()}
                            >
                                {listRole.length > 0 &&
                                    listRole.map((item) => {
                                        return (
                                            <Option key={item._id} value={item._id}>
                                                {item.roleName}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item name="createdTime" label="Thời gian tạo:">
                            <DatePicker format={"DD/MM/YYYY"} placeholder="Thời gian tạo" />
                        </Form.Item>
                    </Col>

                    <Col lg={{ span: 6 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Form.Item name="status" label="Trạng thái hoạt động:">
                            <Select
                                placeholder="Trạng thái hoạt động"
                                allowClear
                                showSearch
                                mode="multiple"
                                onChange={() => handleSearch()}
                            >
                                {userStatus.length > 0 &&
                                    userStatus.map((item) => {
                                        return (
                                            <Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col lg={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Form.Item className="form-button">
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    onClick={() => handleSearch()}
                                >
                                    Tìm kiếm
                                </Button>

                                <Button type="primary" onClick={handleNewEmployee}>
                                    Thêm mới
                                </Button>

                                <Button
                                    type="primary"
                                    htmlType="button"
                                    onClick={() => handleRefresh()}
                                >
                                    Làm mới
                                </Button>

                                <Button
                                    type="primary"
                                    htmlType="button"
                                    onClick={() => handleImportExcel()}
                                >
                                    Nhập tệp Excel
                                </Button>
                                {isLoadingExportExcel ? (
                                    <Button
                                        style={{ display: "flex" }}
                                        type="primary"
                                        htmlType="button"
                                        loading
                                    >
                                        Vui lòng đợi!
                                    </Button>
                                ) : null}
                                {!isLoadingExportExcel ? (
                                    <Button
                                        type="primary"
                                        htmlType="button"
                                        onClick={() => handleExportExcel()}
                                    >
                                        Xuất tệp Excel
                                    </Button>
                                ) : null}

                                <Button
                                    disabled={selectedRowKeys.length == 0}
                                    loading={loadingDeleteRows}
                                    type="danger"
                                    htmlType="button"
                                    onClick={() => handleDeleteSelectRows()}
                                >
                                    Xóa
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};
FormSearch.propTypes = {
    formSearch: PropTypes.any,
    handleSearch: PropTypes.func,
    handleRefresh: PropTypes.func,
    handleNewEmployee: PropTypes.func,
    listRole: PropTypes.any,
    userStatus: PropTypes.array,
    listDepartment: PropTypes.any,
    handleImportExcel: PropTypes.func,
    handleExportExcel: PropTypes.func,
    handleDeleteSelectRows: PropTypes.func,
    selectedRowKeys: PropTypes.any,
    loadingDeleteRows: PropTypes.any,
};
export default FormSearch;
