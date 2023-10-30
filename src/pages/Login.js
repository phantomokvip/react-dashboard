import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    message,
    Spin
} from "antd";
import { useNavigate } from 'react-router-dom';
import loginBg from "../assets/images/login-bg.svg";
import logo from "../assets/images/logo.png";
import { login } from "../services";
import { setAuthorization } from "../services/axios-client";



const Login = () => {
    console.log(process.env.REACT_APP_API_DOMAIN)
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            navigate('/admin');
        }
        // eslint-disable-next-line
    }, [token])

    const handleSubmitForm = async (data) => {
        setLoading(true);

        try {
            let result = await login(data);
            console.log(result.user)
            if (result?.user) {
                localStorage.setItem("token", "true")
                message.success("Đăng nhập thành công!!");
                setAuthorization(true);
                navigate('/');
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('error', error)
        }
    }

    return (
        <>
            {/* <LoadingPage loading={loading} /> */}
            <div className="auth-page-content">
                <div className="" >
                    <img width={100} className="logo-image" src={logo} alt="" />
                    <Row className="" gutter={0}>
                        <Col md={17} className="auth-left-bg p-5 d-none-sm">
                            <img className="img-fluid" src={loginBg} alt="" />
                        </Col>
                        <Col md={7} className="auth-tight align-items-center d-flex">
                            <div className="mt-4">
                                <div className="p-5">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary"> Chào mừng đến với OKVIP! 👋 </h5>
                                    </div>
                                    <div className="p-2 mt-4">
                                        <Form
                                            form={form}
                                            onFinish={handleSubmitForm}
                                            autoComplete="off"
                                        >
                                            <div className="mb-3">

                                                <Form.Item
                                                    name="username"
                                                    label="Tài khoản"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Nhập Tên Đăng Nhập Đi Bạn Ơi!",
                                                            type: "string",
                                                            min: 1,
                                                        },
                                                    ]}
                                                    style={{ marginBottom: "22px" }}
                                                >
                                                    <Input
                                                        placeholder="Nhập tài khoản"
                                                        allowClear={false}
                                                    />
                                                </Form.Item>

                                            </div>

                                            <div className="mb-3">
                                                <Form.Item
                                                    name="password"
                                                    label="Mật khẩu"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Nhập mật khẩu Đi Bạn Ơi!",
                                                        },
                                                    ]}
                                                    style={{ marginBottom: "22px" }}
                                                >
                                                    <Input.Password
                                                        placeholder="Nhập mật khẩu"
                                                        allowClear={false}
                                                    />
                                                </Form.Item>

                                            </div>

                                            <div className="mt-5">
                                                <Button
                                                    disabled={loading}
                                                    color="secondary"
                                                    className="btn btn-secondary w-100"
                                                    htmlType="submit"
                                                >
                                                    Đăng Nhập
                                                </Button>
                                            </div>

                                            <div className="mt-4"></div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}


export default Login