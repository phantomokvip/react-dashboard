import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  AuditOutlined,
  UserOutlined,
  SoundOutlined,
  ScheduleOutlined,
  SafetyCertificateOutlined,
  FileSearchOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import { getMenuById, getAllAction } from "../helpers/helper";
import { useProfile } from "../Components/Hooks/UserHooks";

const Navdata = () => {
  const history = useHistory();

  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isDepartment, setIsDepartment] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isSingleApply, setIsSingleApply] = useState(false);
  const [isShift, setIsShift] = useState(false);
  const [isDecentralization, setIsDecentralization] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const [isActionHistory, setIsActionHistory] = useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  const [listActionGroup, setListActionGroup] = useState([]);
  const [roleUser, setRoleUser] = useState('');
  const [listAllAction, setListAllAction] = useState([]);

  const { userProfile } = useProfile();

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems?.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getRoleFromSessionStorage = () => {
    if (userProfile && userProfile.role) {
      return userProfile.role;
    } else {
      return null;
    }
  };

  const checkVisibleMenu = (param) => {
    if (roleUser?.roleName === 'SuperAdmin') {
      return true
    }
    let roleUserAction = true
    let checkVisible = false
    let strPaging = ''
    switch (param) {
      case 'history':
        strPaging = `getPagingHistories`
        checkVisible = listActionGroup.some((str) => str === 'history');
        break;
      case 'duplicate-ip':
        strPaging = `getSameIp`
        checkVisible = listActionGroup.some((str) => str === 'history');
        break;
      case 'duplicate-fp':
        strPaging = `getSameFp`
        checkVisible = listActionGroup.some((str) => str === 'history');
        break;
      case 'group-management':
        strPaging = `getGroupManagementPage`
        checkVisible = listActionGroup.some((str) => str === 'department');
        break;
      case 'company-management':
        strPaging = `getCompanyManagementPage`
        checkVisible = listActionGroup.some((str) => str === 'company');
        break;
      case 'action-history':
        strPaging = `getActionHistoryManagementPage`
        checkVisible = listActionGroup.some((str) => str === 'actionHistory');
        break;
      default:
        strPaging = `get${capitalizeFirstLetter(param)}ManagementPage`
        checkVisible = listActionGroup.some((str) => str === param);
    }
    roleUserAction = listAllAction.some((item) => item.actionName === strPaging)
    return checkVisible && roleUserAction;
  };

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Department") {
      setIsDepartment(false);
    }
    if (iscurrentState !== "Employee") {
      setIsEmployee(false);
    }
    if (iscurrentState !== "SingleApply") {
      setIsSingleApply(false);
    }
    if (iscurrentState !== "Shift") {
      setIsShift(false);
    }
    if (iscurrentState !== "Decentralization") {
      setIsDecentralization(false);
    }
    if (iscurrentState !== "History") {
      setIsHistory(false);
    }
    if (iscurrentState !== "ActionHistory") {
      setIsActionHistory(false);
    }
  }, [history, iscurrentState, isDashboard]);

  useEffect(() => {
    const getMenuByRoleId = async () => {
      try {
        const role = getRoleFromSessionStorage();

        if (role) {
          const { _id, actions } = role;
          setRoleUser(role)
          let profileUser = userProfile
          if (!userProfile) {
            profileUser = await getMenuById(_id);
          }
          if (profileUser.actionGroups) {
            setListActionGroup(profileUser.actionGroups);
          }

          let listAllAction = profileUser?.allActions
          if (!userProfile) {
            listAllAction = await getAllAction();
          }
          const listAllActionByRole = []
          listAllAction?.forEach((item) => {
            const checkAction = actions?.includes(item._id)
            if (checkAction) {
              listAllActionByRole.push({
                _id: item._id,
                actionName: item.actionName,
              })
            }
          });
          setListAllAction(listAllActionByRole)
        }
      } catch (error) {
        console.log(error, 'error');
      }
    };
    getMenuByRoleId();
  }, [userProfile]);

  const menuItems = [
    {
      label: "Quản lý",
      isHeader: true,
    },
    {
      id: "department",
      label: "Quản lý cấp bậc công ty",
      icon: <AuditOutlined />,
      link: "/department",
      stateVariables: isDepartment,
      visible: checkVisibleMenu("department") || checkVisibleMenu("group-management") || checkVisibleMenu("company-management"),
      click: function (e) {
        e.preventDefault();
        setIsDepartment(!isDepartment);
        setIscurrentState("Department");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "companyManagement",
          label: "Quản lý công ty",
          link: "/company-management",
          parentId: "department",
          actionGroup: "department",
          visible: checkVisibleMenu("company-management"),
        },
        {
          id: "departmentManagement",
          label: "Quản lý bộ phận",
          link: "/department-management",
          parentId: "department",
          actionGroup: "department",
          visible: checkVisibleMenu("department"),
        },
        {
          id: "groupManagement",
          label: "Quản lý tổ (nhóm)",
          link: "/group-management",
          parentId: "department",
          actionGroup: "department",
          visible: checkVisibleMenu("group-management"),
        },
      ],
    },
    {
      id: "employee",
      label: "Quản lý nhân viên",
      icon: <UserOutlined />,
      link: "/employee",
      stateVariables: isEmployee,
      visible: checkVisibleMenu("user"),
      click: function (e) {
        e.preventDefault();
        setIsEmployee(!isEmployee);
        setIscurrentState("Employee");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "employeeManager",
          label: "Quản lý nhân viên",
          link: "/employee-manager",
          parentId: "employee",
          actionGroup: "user",
          visible: true,
        },
      ],
    },
    {
      id: "singleApply",
      label: "Quản lý đơn ứng tuyển",
      icon: <ScheduleOutlined />,
      link: "/application",
      stateVariables: isSingleApply,
      visible: checkVisibleMenu("application"),
      click: function (e) {
        e.preventDefault();
        setIsSingleApply(!isSingleApply);
        setIscurrentState("SingleApply");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "application",
          label: "Quản lý đơn ứng tuyển",
          link: "/application-management",
          parentId: "singleApply",
          actionGroup: "application",
          visible: true,
        },
      ],
    },
    {
      id: "attendanceShift",
      label: "Ca điểm danh",
      icon: <SoundOutlined />,
      link: "/attendance-shift",
      stateVariables: isShift,
      visible: checkVisibleMenu("shift"),
      click: function (e) {
        e.preventDefault();
        setIsShift(!isShift);
        setIscurrentState("Shift");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "shift",
          label: "Ca điểm danh",
          link: "/shift",
          parentId: "attendanceShift",
          actionGroup: "shift",
          visible: true,
        },
      ],
    },
    {
      id: "decentralization",
      label: "Phân quyền",
      icon: <SafetyCertificateOutlined />,
      link: "/decentralization",
      stateVariables: isDecentralization,
      visible: checkVisibleMenu("role"),
      click: function (e) {
        e.preventDefault();
        setIsDecentralization(!isDecentralization);
        setIscurrentState("Decentralization");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "action",
          label: "Hành động",
          link: "/action",
          parentId: "action",
          actionGroup: "action",
          visible: false,
        },
        {
          id: "role",
          label: "Vai trò",
          link: "/role",
          parentId: "role",
          actionGroup: "role",
          visible: checkVisibleMenu("role"),
        },
      ],
    },
    {
      id: "loginHistory",
      label: "Quản lý đăng nhập",
      icon: <FileSearchOutlined />,
      link: "/login-history",
      stateVariables: isHistory,
      visible: checkVisibleMenu("history") || checkVisibleMenu("duplicate-ip") || checkVisibleMenu("duplicate-fp"),
      click: function (e) {
        e.preventDefault();
        setIsHistory(!isHistory);
        setIscurrentState("History");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "history",
          label: "Lịch sử đăng nhập",
          link: "/history",
          parentId: "loginHistory",
          actionGroup: "history",
          visible: checkVisibleMenu("history"),
        },
        {
          id: "duplicate-ip",
          label: "Danh sách trùng IP",
          link: "/duplicate-ip",
          parentId: "loginHistory",
          actionGroup: "history",
          visible: checkVisibleMenu("duplicate-ip"),
        },
        {
          id: "duplicate-fp",
          label: "Danh sách trùng FP",
          link: "/duplicate-fp",
          parentId: "loginHistory",
          actionGroup: "history",
          visible: checkVisibleMenu("duplicate-fp"),
        }
      ],
    },
    {
      id: "actionHistory",
      label: "Quản lý hành động",
      icon: <HistoryOutlined />,
      link: "/action-history",
      stateVariables: isActionHistory,
      visible: checkVisibleMenu("action-history"),
      click: function (e) {
        e.preventDefault();
        setIsActionHistory(!isActionHistory);
        setIscurrentState("ActionHistory");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "actionHistory-childrent",
          label: "Lịch sử hành động",
          link: "/action-history",
          parentId: "actionHistory",
          actionGroup: "action-history",
          visible: checkVisibleMenu("action-history"),
        },
      ],
    },
  ];
  return <>{menuItems}</>;
};
export default Navdata;
