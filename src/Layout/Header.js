import React from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LoginOutlined,
    RollbackOutlined,
} from '@ant-design/icons';
import { Layout, Button, theme, Avatar, Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header } = Layout;

const HeaderMain = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login");
    };
    const items = [
        {
            label: <button onClick={handleLogout} > Quay Lại</button >,
            key: '3',
            icon: <RollbackOutlined />,
        },
    ];

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        >
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                </div>
                <div className='flex justify-end mr-10'>
                    <Dropdown
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                    >
                        <a href='/#' onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar size="large" icon={<UserOutlined />} />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
        </Header>
    )
}


export default HeaderMain