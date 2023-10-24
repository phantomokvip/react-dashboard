import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    message,
    Input,
    Button,
    Form,
    Space,
    Select,
    Upload,
    Modal,
    Col,
    Row,
    TreeSelect,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

import {
    uploadImage,
    uploadCV,
} from "../../../../helpers/helper";
import * as url from "../../../../helpers/url_helper";
import { getNameByUrl } from "../../../../common/function";

const { Option } = Select;
const { TreeNode } = TreeSelect;

const ModalForm = ({
    treeSelectProps,
    titleModal,
    form,
    handleSubmitForm,
    listRole,
    showModal,
    handleClodeModal,
    listStatus,
    setImageDeletes,
    setCvDeletes,
    setCurrentUploadAvatar,
    setCurrentUploadCV,
}) => {
    const { treeData, treeDataDepartmentValue } = treeSelectProps;

    const [fileList, setFileList] = useState([]);
    const [statusUser, setStatusUser] = useState([]);

    const [fileListCv, setFileListCv] = useState([]);
    const [nameCv, setNameCv] = useState("");

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleChangeImage = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const validateInput = (_, value) => {
        if (!value || value.trim() === "") {
            return Promise.reject();
        }
        return Promise.resolve();
    };
    const validateUsername = (_, value) => {
        const regexPattern = /^[a-zA-Z0-9]+$/;
        if (!value || value.trim() === "") {
            return Promise.reject('Vui lòng nhập tên đăng nhập!');
        }
        if (!regexPattern.test(value)) {
            return Promise.reject('Tên đăng nhập không được chứa kí tự đặc biệt!');
        }
        return Promise.resolve();
    };
    const validateInputPassword = (_, value) => {
        if ((value && value.trim() != "") || form.getFieldsValue().id) {
            return Promise.resolve();
        }
        return Promise.reject();
    };

    useEffect(() => {
        if (showModal && form.getFieldValue().id) {
            if (form.getFieldValue().avatar) {
                setFileList([
                    {
                        url: form.getFieldValue().avatar,
                        name: getNameByUrl(form.getFieldsValue().avatar),
                    },
                ]);
            }
            if (form.getFieldValue().cv) {
                setFileListCv([
                    {
                        url: `${process.env.REACT_APP_API_URL}${url.API_CV_GET_BY_ID}/${form.getFieldValue().cv
                            }`,
                        name: `CV_${form.getFieldValue().username}`,
                    },
                ]);

                setNameCv(form.getFieldValue().cv);
            }
            if (form.getFieldValue().department) {
                const dataStatus = listStatus.filter((item) => item.value !== 1);
                setStatusUser(dataStatus);
            } else {
                const dataStatus = listStatus.filter((item) => item.value !== 2 && item.value !== 3);
                setStatusUser(dataStatus);
            }
        } else {
            setStatusUser(listStatus);
            setFileList([]);
            setFileListCv([]);
            form.resetFields();
        }



    }, [showModal]);

    const props = {
        onRemove: async (file) => {
            try {
                if (file.name) {
                    setImageDeletes(prevArray => [...prevArray, file.name]);
                    setFileList([]);
                    form.setFieldValue("avatar", "");
                }
            } catch (error) {
                message.error("Bạn không có quyền xóa hình ảnh!");
            }
        },
        beforeUpload: async (file) => {
            setCurrentUploadAvatar(file)
            file.onSuccess()
        },
        onPreview: async (file) => {
            const imageName = file.name;
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            const imageUrl = file.url || (file.preview);

            const modal = Modal.info({
                title: null,
                content: (
                    <img
                        src={imageUrl}
                        alt={imageName}
                        style={{ width: '100%', maxHeight: '80vh' }}
                        onClick={() => modal.destroy()}
                    />
                ),
                maskClosable: true,
                width: 'auto',
                centered: true,
                closable: false,
                okButtonProps: { style: { display: 'none' } },
            });
        },
        maxCount: 1,
    };

    const propsCv = {
        onRemove: async (file) => {
            try {
                if (nameCv) {
                    setFileListCv([]);
                    setCvDeletes(prevArray => [...prevArray, nameCv]);
                    form.setFieldValue("cv", "");
                }
            } catch (error) {
                message.error("Bạn không có quyền xóa tệp!");
            }
        },
        maxCount: 1,
        beforeUpload: async (file) => {
            setFileListCv([
                { ...file, name: `CV_${form.getFieldValue().username}` },
            ]);
            setCurrentUploadCV(file)
            file.onSuccess()
        }
    };

    const handleResetForm = async () => {
        form.resetFields();
        setFileList([]);
        setFileListCv([]);
    };

    const handleChangeDepartment = async () => {
        if (form.getFieldValue().department) {
            const dataStatus = listStatus.filter((item) => item.value !== 1);
            setStatusUser(dataStatus);
            if (form.getFieldValue().status == 1) {
                form.setFieldsValue({
                    status: 2
                });
            }
        } else {
            const dataStatus = listStatus.filter((item) => item.value !== 2 && item.value !== 3);
            setStatusUser(dataStatus);
            if (form.getFieldValue().status == 2 || form.getFieldValue().status == 3) {
                form.setFieldsValue({
                    status: 1
                });
            }
        }
    };

    return (
        <Modal
            forceRender={true}
            title={titleModal}
            width={750}
            open={showModal}
            toggle={handleClodeModal}
            onCancel={handleClodeModal}
            centered={true}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitForm}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col hidden={true}>
                        <Form.Item name="id" label="Id">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            rules={[
                                {
                                    required: true,
                                    validator: validateUsername,
                                    type: "string",
                                    min: 1,
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <Input placeholder="Nhập tên đăng nhập" allowClear={true} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="fullName"
                            label="Họ tên"
                            rules={[
                                {
                                    required: true,
                                    validator: validateInput,
                                    message: "Vui lòng nhập họ tên!",
                                },
                                {
                                    type: "string",
                                    min: 1,
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <Input placeholder="Nhập họ tên" allowClear={true} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                {
                                    validator: validateInputPassword,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                                {
                                    type: "string",
                                    min: 1,
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <Input placeholder="Nhập mật khẩu" allowClear={true} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="Công ty, bộ phận và tổ"
                            rules={[
                                {
                                    message: "Vui lòng chọn bộ phận hoặc tổ (nhóm)!",
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <TreeSelect
                                showSearch
                                treeNodeFilterProp="title"
                                style={{ width: "100%" }}
                                value={treeDataDepartmentValue}
                                placeholder="Chọn công ty, bộ phận và tổ"
                                allowClear
                                treeDefaultExpandAll
                                onChange={handleChangeDepartment}
                            >
                                {treeData &&
                                    treeData?.map((data) => {
                                        const disableChildren = data.children.length === 0;
                                        return (
                                            <TreeNode
                                                key={data.key}
                                                value={data.value}
                                                title={data.title}
                                                disabled={!disableChildren}
                                            >
                                                {!disableChildren
                                                    ? data.children.map((child) => {
                                                        const disableChildrenOfChild =
                                                            child.children.length === 0;
                                                        return (
                                                            <TreeNode
                                                                key={child.key}
                                                                value={child.value}
                                                                title={child.title}
                                                                disabled={!disableChildrenOfChild}
                                                            >
                                                                {!disableChildrenOfChild
                                                                    ? child.children.map((childOfChild) => {
                                                                        return (
                                                                            <TreeNode
                                                                                key={childOfChild.key}
                                                                                value={childOfChild.value}
                                                                                title={childOfChild.title}
                                                                            ></TreeNode>
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
                    <Col span={12}>
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn vai trò!",
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <Select placeholder="Chọn vai trò" allowClear showSearch>
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

                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    pattern: new RegExp(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/),
                                    type: "email",
                                    min: 1,
                                    message: "Email không hợp lệ!",
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <Input placeholder="Nhập email" allowClear={true} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Số điện thoại"
                            rules={[
                                {
                                    pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})$/g),
                                    message: "Số điện thoại không hợp lệ!",
                                    type: "string",
                                    min: 1,
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <Input placeholder="Nhập số điện thoại" allowClear={true} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Trạng thái hoạt động"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn trạng thái hoạt động!",
                                },
                            ]}
                            style={{ marginBottom: "22px" }}
                        >
                            <Select
                                placeholder="Chọn trạng thái hoạt động"
                                allowClear
                                showSearch
                            >
                                {statusUser.length > 0 &&
                                    statusUser.map((item) => {
                                        return (
                                            <Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="avatar" label="Hình ảnh đại diện" className="">
                            <Space align="start">
                                <Upload
                                    {...props}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleChangeImage}
                                    accept="image/*"
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div>Tải lên</div>
                                    </div>
                                </Upload>
                            </Space>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="cv" label="CV" className="">
                            <Space align="start">
                                <Upload
                                    {...propsCv}
                                    fileList={fileListCv}
                                    accept=".doc, .docx,.ppt, .pptx,.pdf"
                                >
                                    <Button icon={<UploadOutlined />}>
                                        <span style={{ marginTop: "0px", float: "right" }}>
                                            Tải lên
                                        </span>
                                    </Button>
                                </Upload>
                                <Input hidden={true} />
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item className="mt-2 text-center">
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>

                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => handleResetForm()}
                        >
                            Làm mới
                        </Button>

                        <Button type="danger" onClick={handleClodeModal}>
                            Đóng
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};
ModalForm.propTypes = {
    titleModal: PropTypes.string,
    handleSubmitForm: PropTypes.func,
    handleClodeModal: PropTypes.func,
    showModal: PropTypes.bool,
    listRole: PropTypes.any,
    form: PropTypes.any,
    listStatus: PropTypes.array,
    listDepartment: PropTypes.any,
    setImageDeletes: PropTypes.any,
    setCvDeletes: PropTypes.any
};
export default ModalForm;
