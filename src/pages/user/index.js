import React, { useEffect, useState } from 'react';
import { Space, Popconfirm, Form, message, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPaging, deleteUser } from '../../services'

const cancel = (e) => {
    message.error('Bạn đã hủy');
};
const Users = () => {
    const [usersData, setUsersData] = useState();
    const [form] = Form.useForm();
    const [formEdit] = Form.useForm();



    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getPagingUsers({ pageIndex: 1, pageSize: 10 });
        // eslint-disable-next-line
    }, []);

    const getPagingUsers = async (data) => {
        setLoading(true);
        setTimeout(async () => {
            const res = await getPaging(data);
            setUsersData(res.data);
            setLoading(false);
        }, 500);
    }

    const showModal = () => {

    }
    const handleDelete = async (id) => {
        try {
            const resUseres = await deleteUser(id);

            if (resUseres?.user) {
                message.success("Xóa người dùng thành công ");
                const res = await getPaging({ pageIndex: 1, pageSize: 10 });
                setUsersData(res.data);
            } else {
                message.error("Xóa người dùng thất bại")
            }
        } catch (error) {
            message.error("Xóa dùng đã tồn tại !!!")
            console.log(error)
        }
    }
    const columns = [
        {
            title: 'Tài khoản',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            render: (_, record) => (
                <Space size="middle" className='gap-2'>
                    <button onClick={() => showModal(record._id)} className='bg-[#007fff] text-[#fff] w-[30px] h-[30px] rounded-[50%]'><EditOutlined /></button>
                    <Popconfirm
                        title="Xóa nhân viên"
                        description="Bạn có thật sự muốn xóa Nhân viên này?"
                        onConfirm={() => handleDelete(record._id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        okType=''
                    >
                        <button className='bg-[#f15757] text-[#fff] w-[30px] h-[30px] rounded-[50%]'><DeleteOutlined /></button>
                    </Popconfirm>
                </Space>
            )
        },
    ];
    return (
        <Table columns={columns} dataSource={usersData} />
    )
}

export default Users