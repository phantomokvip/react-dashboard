import React, { useEffect, useState } from "react";
import LoadingPage from "../../Components/Common/LoadingPage";
import { Button, Form, Row, Col, Input, message } from "antd";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import loginBg from "../../assets/images/login-bg.svg";
import logo from "../../assets/images/logo.png";
import { getIpFp, postLogin, getUserInfoById } from "../../helpers/helper";
import { useHistory } from "react-router-dom";
import {
    listRouter,
    capitalizeFirstLetter,
    setToken,
    setUserIdStorage,
} from "../../helpers/common";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { useUserDetails } from "../../context/UserDetailContext";
const Login = (props) => {

    document.title = "Okvip HRM";
    const [form] = Form.useForm();
    const [fpHash, setFpHash] = useState("");
    const [ip, setIp] = useState();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { token } = useProfile();
    const { dispatch } = useUserDetails();

    useEffect(() => {
        if (token) {
            history.push("/");
        }

        const fetchData = async () => {
            const data = await getIpFp({}, true);
            if (data && data.data && data.data.ip) {
                setIp(data.data.ip);
            } else {
                fetch("https://api.ipify.org?format=json")
                    .then((response) => response.json())
                    .then((data) => setIp(data.ip));
            }
        };

        const setFp = async () => {
            const fp = await FingerprintJS.load();
            const { visitorId } = await fp.get();
            setFpHash(visitorId);
        };

        setFp();
        fetchData();
    }, []);

    const checkRoleUser = async (user) => {
        try {
            const role = user?.role;
            const { actions, roleName } = role;
            const dataResultParam = [];
            if (roleName === "SuperAdmin") {
                listRouter.forEach((param) => {
                    dataResultParam.push({
                        key: param.key,
                        value: true,
                        url: param.url,
                    });
                });
            } else {
                let listAllAction = user?.allActions;
                const listAllActionByRole = [];
                listAllAction?.forEach((item) => {
                    const checkAction = actions?.includes(item._id);
                    if (checkAction) {
                        listAllActionByRole.push({
                            _id: item._id,
                            actionName: item.actionName,
                        });
                    }
                });

                listRouter.forEach((param) => {
                    let checkVisible = false;
                    let strPaging = "";
                    switch (param.url) {
                        case "company-management":
                            strPaging = `getPagingCompanies`;
                            break;
                        case "group-management":
                            strPaging = `getPagingGroups`;
                            break;
                        case "history":
                            strPaging = `getPagingHistories`;
                            break;
                        case "duplicate-ip":
                            strPaging = `getSameIp`;
                            break;
                        case "duplicate-fp":
                            strPaging = `getSameFp`;
                            break;
                        default:
                            strPaging = `get${capitalizeFirstLetter(
                                param.key
                            )}ManagementPage`;
                    }
                    checkVisible = user?.actionGroups?.some((str) => str === param.key);
                    const roleUserAction = listAllActionByRole?.some(
                        (item) => item.actionName === strPaging
                    );
                    dataResultParam.push({
                        key: param.key,
                        value: checkVisible && roleUserAction,
                        url: param.url,
                    });
                });
            }
            return dataResultParam;
        } catch (error) {
            console.log(error);
        }
    };



    const handleSubmitForm = async (values) => {
        try {
            setLoading(true);
            const response = await postLogin({
                ...values,
                ip: ip,
                fp: fpHash,
            });

            console.log(response.status)
            if (response.status === 1) {
                setLoading(false);

                if (
                    response.data.user.role == null ||
                    response.data.user.role.roleName === "user"
                ) {
                    history.push("/no-access-permission");
                } else if (response.data.user) {
                    setToken(response?.data?.token);
                    setUserIdStorage(response?.data?.user?._id);
                    const profileInfo = await getUserInfoById(response.data.user._id);
                    dispatch({ type: "LOGIN_USER_INFO", payload: profileInfo });
                    const roleUser = await checkRoleUser(profileInfo);
                    if (roleUser && roleUser.length > 0) {
                        const path = roleUser.find((item) => item.value === true);
                        sessionStorage.setItem("pathRoleUser", JSON.stringify(path));
                        history.push(`/${path ? path.url : ""}`);
                    } else {
                        history.push("/");
                    }
                }
            } else {
                setLoading(false);
                if (response.status === 2) {
                    message.error("Sai mật khẩu!");
                } else if (response.status === 3) {
                    message.error("Tài khoản đã bị khóa!");
                } else if (response.status === 4) {
                    message.error("Không tìm thấy tài khoản!");
                } else if (response.status === 400) {
                    message.error("IP và FP là bắt buộc!");
                } else {
                    message.error("Đăng nhập thất bại!");
                }
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
            setLoading(false);
        }
    };

    return (
        <>
            <LoadingPage loading={loading} />
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
};

export default Login;
