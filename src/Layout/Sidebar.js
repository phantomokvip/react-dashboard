import React from 'react'
import {
    UserOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    Menu,
    MenuItem,
} from "react-pro-sidebar";


const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();

    const handlePage = (href) => {
        navigate(href);
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                position: "fixed",
                left: 0,
                height: "100vh"
            }}
        >
            <div className="demo-logo-vertical" />

            {/* <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    {

                        key: '1',
                        icon: <UserOutlined />,
                        label: <span onClick={console.log("test")} >Home</span >,
                    },
                    {
                        key: '2',
                        icon: <VideoCameraOutlined />,
                        label: 'nav 2',
                    },
                ]}
            /> */}
            <Menu>
                <MenuItem className="custom-menu font-medium text-[15px]"
                    active={window.location.pathname === "/"}
                    icon={<HomeOutlined />}
                    onClick={() => handlePage("/")}
                >
                    Trang chủ
                </MenuItem>
                <MenuItem className="custom-menu font-medium text-[15px]"
                    active={window.location.pathname === "/about"}
                    icon={<UserOutlined />}
                    onClick={() => handlePage("/about")}
                >
                    Quản Lý User
                </MenuItem>
            </Menu>
        </Sider>
    )
}

export default Sidebar