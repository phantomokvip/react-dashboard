import React, { useState } from "react";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from "reactstrap";
import {
    Image
} from "antd";
import {
    LogoutOutlined,
    UserOutlined
} from "@ant-design/icons";

import { useProfile } from "../../Components/Hooks/UserHooks";
//import images
import avatar from "../../assets/images/avartar.png";

const ProfileDropdown = () => {
    // const dispatch = useDispatch();
    const { userProfile } = useProfile();

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    const clearCache = () => {
        sessionStorage.removeItem("pathRoleUser");
    }
    return (
        <>
            <Dropdown
                isOpen={isProfileDropdown}
                toggle={toggleProfileDropdown}
                className="ms-sm-3 header-item topbar-user"
            >
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <Image
                            className="rounded-circle header-profile-user"
                            height={40}
                            width={40}
                            preview={false}
                            src={
                                userProfile?.avatar
                                    ? `${process.env.REACT_APP_API_URL}/uploads/images/${userProfile?.avatar}`
                                    : avatar
                            }
                            fallback={avatar}
                        />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                                {userProfile?.username}
                            </span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                                {userProfile?.roleName}
                            </span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Chào mừng {userProfile?.fullName ? userProfile?.fullName : userProfile?.username}!</h6>
                    <DropdownItem href="/profile">
                        <UserOutlined className="text-muted fs-16 align-middle me-1" />
                        <span className="align-middle">Tài khoản</span>
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem href="/logout" onClick={clearCache}>
                        <LogoutOutlined className="text-muted fs-16 align-middle me-1" />{" "}
                        <span className="align-middle" data-key="t-logout">
                            Đăng xuất
                        </span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export default ProfileDropdown;
