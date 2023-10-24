export const getImageNameFromURL = (url) => {
    const splitUrl = url.split("/");
    const imageName = splitUrl[splitUrl.length - 1];
    return imageName;
};

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const sessionKey = Object.freeze({
    TOKEN: "token",
    USER_ID: "userId",
});

export const getToken = () => {
    const token = sessionStorage.getItem(sessionKey.TOKEN);
    return token;
};
export const setToken = (token) => {
    sessionStorage.setItem(sessionKey.TOKEN, token);
};
export const setUserIdStorage = (id) => {
    sessionStorage.setItem(sessionKey.USER_ID, JSON.stringify(id));
};
export const getUserIdStorage = () => {
    const userId = JSON.parse(sessionStorage.getItem(sessionKey.USER_ID));
    return userId;
};


export const actionGroup = [
    { value: "user", label: "Người dùng" },
    { value: "history", label: "Lịch sử" },
    { value: "company", label: "Công ty" },
    { value: "department", label: "Bộ phận" },
    { value: "shift", label: "Ca làm việc" },
    { value: "attendance", label: "Chấm công" },
    { value: "action", label: "Hành động" },
    { value: "role", label: "Vai trò" },
    { value: "application", label: "Ứng tuyển" },
    { value: "group", label: "Bộ phận" },
    { value: "actionHistory", label: "Lịch sử hành động" },
    { value: "other", label: "Khác" }
];

export const listRouter = [
    { key: 'department', value: false, url: 'company-management' },
    { key: 'department', value: false, url: 'department-management' },
    { key: 'department', value: false, url: 'group-management' },
    { key: 'user', value: false, url: 'employee-manager' },
    { key: 'application', value: false, url: 'application-management' },
    { key: 'shift', value: false, url: 'shift' },
    { key: 'action', value: false, url: 'action' },
    { key: 'role', value: false, url: 'role' },
    { key: 'history', value: false, url: 'history' },
    { key: 'history', value: false, url: 'duplicate-ip' },
    { key: 'history', value: false, url: 'duplicate-fp' },
    { key: 'actionHistory', value: false, url: 'action-history' },
]
