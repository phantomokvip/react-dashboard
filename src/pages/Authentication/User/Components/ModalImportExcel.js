
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Button,
    Col,
    Row,
    Modal,
    Tooltip,
    message
} from "antd";
import { read, utils, writeFile } from 'xlsx';
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import {
    insertUser
} from "../../../../helpers/helper";
import { extractManyId } from "../../../../common/function";

const ModalImportExcel = ({ showModalImport, handleClodeModalImport, listRole, handleRefresh, listDepartment }) => {
    const [uploading, setUploading] = useState(false);
    const [dataImport, setDataImport] = useState([]);
    const [dataImportFinish, setDataImportFinish] = useState([]);
    const inputRef = useRef(null);
    
    useEffect(() => {
        setDataImport([]);
        setDataImportFinish([]);
        inputRef.current.value = null;
        
    }, [showModalImport]);

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], { defval: "" });
                    var JsonToArray = rows.map(item => {
                        return Object.values(item);
                    })
                    //check data
                    var data_result = [];
                    for (var i = 0; i < JsonToArray.length; i++) {

                        if (JsonToArray[i][2] && JsonToArray[i][3] && JsonToArray[i][2].toString().trim() && JsonToArray[i][3].toString().trim()) {
                            data_result.push(JsonToArray[i]);
                        }
                    }
                    setDataImport(data_result)
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleStartImport = async () => {
        setUploading(true);
        var data_message = [];
        for (var i = 0; i < dataImport.length; i++) {
            var dataRole, data_item = {}, dataCompany = [], dataDepartment = [],dataGroup = [];
            try {
                if (listRole) {
                    dataRole = listRole.filter(
                        (item) => item.roleName.toLowerCase() === 'user'
                    );
                }
                if (listDepartment) {
                    dataCompany = listDepartment.filter(
                        (item) => item.title === (dataImport[i][4])
                    );
                    if (dataCompany.length){
                        dataDepartment = dataCompany[0].children.filter(
                            (item) => item.title === (dataImport[i][5])
                        );
                    }
                    
                    if (dataDepartment.length){
                        dataGroup= dataDepartment[0].children.filter(
                            (item) => item.title === (dataImport[i][6])
                        );
                    }
                }
                    
                data_item = {
                    'fullName': dataImport[i][1],
                    'username': dataImport[i][2],
                    'password': dataImport[i][3],
                    'company': dataCompany.length ? extractManyId(dataCompany[0].value).company : null,
                    'department': dataDepartment.length ? extractManyId(dataDepartment[0].value).department : null,
                    'group': dataGroup.length ? extractManyId(dataGroup[0].value).group : null,
                    'email': dataImport[i][7],
                    'role': dataRole.length ? dataRole[0]._id : null,
                    'phoneNumber': dataImport[i][8]
                }
               
                const dataRes = await insertUser(data_item);
                if (dataRes.status === 1) {
                    data_item.status = 'success';
                } else {
                    data_item.status = 'error';
                    data_item.message = dataRes.message;
                }
            } catch (error) {
                data_item.status = 'error';
                data_item.message = error.toString();
                console.log(error)
            }
            data_message.push(data_item);
            setDataImportFinish(dataImportFinish.concat(data_message));
        }
        setDataImport([]);
        setUploading(false);
        handleRefresh();
        message.success(`Đã nhập xong dữ liệu`);
    }

    const ExportFileDefault = () => {
        const fileExtension = ".xlsx";
        const fileName = 'file-mau';
        const headings = [[
            'STT',
            'Họ tên',
            'Tên đăng nhập',
            'Mật khẩu',
            'Công ty',
            'Bộ phận',
            'Tổ',
            'Email',
            'Số điện thoại'
        ]];

        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, [], { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, fileName + fileExtension);
    }
    return (
        <>
            <Modal
                forceRender={true}
                title={'Nhập dữ liệu bằng Excel'}
                open={showModalImport}
                toggle={handleClodeModalImport}
                centered={false}
                onCancel={handleClodeModalImport}
                footer={[
                    <Button key="export" style={{ float: 'left' }} className="pull-left" type="primary" onClick={ExportFileDefault}>Tải file Excel mẫu</Button>,
                    <Button key="submit" style={{ float: 'right' }} type="danger" onClick={handleClodeModalImport}>Đóng</Button>,
                    <Button key="back" type="primary" disabled={dataImport.length === 0 || uploading} loading={uploading} onClick={handleStartImport}> {uploading ? 'Đang nhập dữ liệu' : 'Bắt đầu nhập'}</Button>
                ]}
            >
                <div className="custom-file">

                    <input onChange={handleImport} ref={inputRef} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="form-control" type="file" id="formFile" />
                </div>
                {(dataImport.length > 0 || dataImportFinish.length > 0) &&
                    <Row gutter={16} className="show_data_import mt-3">
                        <Col span={12} className="left_item">
                            <h3 className="text-center">Danh sách <b>{dataImport.length}</b> nhân viên nhập</h3>
                            <ul>
                                {dataImport.map((item, index) => {
                                    return (<li className="text-right" key={index}>{item[2]}</li>)
                                })}
                            </ul>
                        </Col>
                        <Col span={12} className="right_item">
                            <h3 className="text-center">Đã nhập <b>{dataImportFinish.length}</b> nhân viên</h3>
                            <ul>
                                {dataImportFinish.map((item, index) => {
                                    return (<li className="text-left" key={index}>
                                        {index + 1}. {item.username}
                                        <span className="pull-right">
                                            {item.status === 'success' && <CheckOutlined className="success" />}
                                            {item.status === 'error' && <Tooltip title={item.message}><CloseOutlined className="error" /></Tooltip>}
                                        </span>
                                    </li>)
                                })}
                            </ul>
                        </Col>
                    </Row>
                }

            </Modal>
        </>
    );
};
ModalImportExcel.propTypes = {
    showModalImport: PropTypes.any,
    handleClodeModalImport: PropTypes.func,
    listRole: PropTypes.any,
    handleRefresh: PropTypes.func,
    listDepartment: PropTypes.any
};
export default ModalImportExcel;
