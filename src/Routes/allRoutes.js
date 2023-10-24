import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import NoAccessPermission from "../pages/Authentication/NoAccessPermission";
import Dashboard from "../pages/Dashboard"


// const pathRoleUser = sessionStorage.getItem("pathRoleUser") !== 'undefined' ? JSON.parse(sessionStorage.getItem("pathRoleUser")) : '';

const authProtectedRoutes = [
    // { path: "/profile", component: Profile },
    { path: "*", exact: true, component: Dashboard },
    // {
    //     path: "*",
    //     exact: true,
    //     component: () => <Redirect to={`/${pathRoleUser ? pathRoleUser.url : ''}`} />,
    // }
];

const publicRoutes = [
    // Authentication Page
    { path: "/login", component: Login },
    { path: "/logout", component: Logout },
    { path: "/no-access-permission", component: NoAccessPermission },
];

export { authProtectedRoutes, publicRoutes };
