import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();


//login
export const postLogin = (data) => api.create(url.API_USER_LOGIN, data);
export const getIpFp = (data, config) => api.get(url.API_GET_IP_USER, data, config);


//Image
export const uploadImage = (data) => api.create(url.API_IMAGE_INSERT, data);
export const deleteImage = (id, data) =>
    api.delete(`${url.API_IMAGE_DELETE}/${id}`, data);

//CV
export const uploadCV = (data) => api.create(url.API_CV_INSERT, data);
export const deleteCV = (id, data) =>
    api.delete(`${url.API_CV_DELETE}/${id}`, data);

//uploadFile
export const uploadFile = (data) => api.create(url.API_FILE_INSERT, data);

//User
export const insertUser = (data) => api.create(url.API_USER_INSERT, data);
export const updateUser = (id, data) =>
    api.update(`${url.API_USER_UPDATE}/${id}`, data);
export const deleteUser = (id, data) =>
    api.delete(`${url.API_USER_DELETE}/${id}`, data);
export const getPagingUser = (data) => api.get(url.API_USER_GET_PAGING, data);
export const getAllUser = (data) => api.get(url.API_USER_GET_ALL, data);
export const getUserInfoById = (id, data) =>
    api.get(`${url.API_USER_GET_INFO_BY_ID}/${id}`, data);
export const getUserId = (id, data) =>
    api.get(`${url.API_USER_GET_BY_ID}/${id}`, data);
export const deleteManyUser = (data) =>
    api.delete(`${url.API_USER_DELETE_MANY}`, data);
export const getUserManagementPage = (data) => api.get(url.API_USER_GET_MANAGEMENT, data);
export const updateDepartmentUser = (id, data) =>
    api.update(`${url.API_USER_UPDATE_DEPARTMENT}/${id}`, data);
//Role

export const insertRole = (data) => api.create(url.API_ROLE_INSERT, data);
export const updateRole = (id, data) =>
    api.update(`${url.API_ROLE_UPDATE}/${id}`, data);
export const deleteRole = (id, data) =>
    api.delete(`${url.API_ROLE_DELETE}/${id}`, data);
export const getAllRole = (data) => api.get(url.API_ROLE_GETALL, data);
export const getPagingRole = (data) => api.get(url.API_ROLE_GET_PAGING, data);
export const getRoleById = (id, data) =>
    api.get(`${url.API_ROLE_GET_PAGING_BY_ID}/${id}`, data);
export const getMenuById = (id, data) =>
    api.get(`${url.API_ROLE_GET_MENU_BY_ID}/${id}`, data);
export const deleteManyRole = (data) =>
    api.delete(`${url.API_ROLE_DELETE_MANY}`, data);
export const GetRoleManagementPage = (data) => api.get(url.API_ROLE_GET_MANAGEMENT, data);

//Action
export const insertAction = (data) => api.create(url.API_ACTION_INSERT, data);
export const updateAction = (id, data) =>
    api.update(`${url.API_ACTION_UPDATE}/${id}`, data);
export const deleteAction = (id, data) =>
    api.delete(`${url.API_ACTION_DELETE}/${id}`, data);
export const getAllAction = (data) => api.get(url.API_ACTION_GETALL, data);
export const getPagingAction = (data) =>
    api.get(url.API_ACTION_GET_PAGING, data);
export const getActionById = (id, data) =>
    api.get(`${url.API_ACTION_GET_PAGING_BY_ID}/${id}`, data);

//Department
export const createDepartment = (data) => api.create(url.API_DEPARTMENT_INSERT, data);
export const updateDepartment = (id, data) =>
    api.update(`${url.API_DEPARTMENT_UPDATE}/${id}`, data);
export const deleteDepartment = (id, data) =>
    api.delete(`${url.API_DEPARTMENT_DELETE}/${id}`, data);
export const getPagingDepartments = (data) => api.get(url.API_DEPARTMENT_GET_PAGING, data);
export const getAllDepartments = (data) => api.get(url.API_DEPARTMENT_GET_ALL, data);
export const getDepartmentById = (id, data) =>
    api.get(`${url.API_DEPARTMENT_GET_PAGING_BY_ID}/${id}`, data);
export const deleteManyDepartment = (data) =>
    api.delete(`${url.API_DEPARTMENT_DELETE_MANY}`, data);
export const getDepartmentManagementPage = (data) => api.get(url.API_DEPARTMENT_GET_MANAGEMENT, data);


//Shift
export const insertShift = (data) => api.create(url.API_SHIFT_INSERT, data);
export const updateShift = (id, data) =>
    api.update(`${url.API_SHIFT_UPDATE}/${id}`, data);
export const deleteShift = (data) =>
    api.delete(`${url.API_SHIFT_DELETE}?gte=${data.gte}&lte=${data.lte}`, data);
export const deleteShiftPeriod = (data) =>
    api.delete(`${url.API_SHIFT_DELETE_PERIOD}?gte=${data.gte}&lte=${data.lte}`, data);
export const getPagingShift = (data) => api.get(url.API_SHIFT_GET_PAGING, data);
export const getUserByShift = (id, data) =>
    api.get(`${url.API_SHIFT_GET_PAGING_BY_ID}/${id}`, data);
export const deleteShiftById = (id, data) =>
    api.delete(`${url.API_SHIFT_DELETE}/${id}`, data);
export const deleteManyShift = (data) =>
    api.delete(`${url.API_SHIFT_DELETE_MANY}`, data);
    export const getShiftManagementPage = (data) => api.get(url.API_SHIFT_GET_MANAGEMENT, data);
//Attendance
export const insertAttendance = (data) => api.create(url.API_ATTENDANCES_INSERT, data);
export const updateAttendance = (id, data) =>
    api.update(`${url.API_ATTENDANCES_UPDATE}/${id}`, data);
export const deleteAttendance = (id, data) =>
    api.delete(`${url.API_ATTENDANCES_DELETE}/${id}`, data);
export const getPagingAttendance = (data) => api.get(url.API_ATTENDANCES_GET_PAGING, data);
export const getUserByAttendance = (id, data) =>
    api.get(`${url.API_ATTENDANCES_GET_PAGING_BY_ID}/${id}`, data);

//Application
export const insertApplication = (data) =>
    api.create(url.API_APPLICATION_INSERT, data);
export const updateApplication = (id, data) =>
    api.update(`${url.API_APPLICATION_UPDATE}/${id}`, data);
  
export const deleteApplication = (id, data) =>
    api.delete(`${url.API_APPLICATION_DELETE}/${id}`, data);
export const getPagingApplication = (data) =>
    api.get(url.API_APPLICATION_GET_PAGING, data);
export const getApplicationById = (id, data) =>
    api.get(`${url.API_APPLICATION_GET_PAGING_BY_ID}/${id}`, data);
export const deleteManyApplication = (data) =>
    api.delete(`${url.API_APPLICATION_DELETE_MANY}`, data);
export const getManagementApplication = (data) =>
    api.get(url.API_APPLICATION_GET_MANAGEMENT, data);
    
//Logs
export const updateHistory = (id, data) =>
    api.update(`${url.API_HISTORY_UPDATE}/${id}`, data);
export const deleteHistory = (data) =>
    api.delete(`${url.API_HISTORY_DELETE}?gte=${data.gte}&lte=${data.lte}`, data);
export const getAllHistory = (data) => api.get(url.API_HISTORY_GETALL, data);
export const getPagingHistory = (data) => api.get(url.API_HISTORY_GET_PAGING, data);
export const getHistoryById = (id, data) =>
    api.get(`${url.API_HISTORY_GET_PAGING_BY_ID}/${id}`, data);
export const getAllIPDuplicate = (data) => api.get(url.API_GET_SAME_IP, data)
export const getAllFPDuplicate = (data) => api.get(url.API_GET_SAME_FP, data)
export const deleteHistoryById = (id, data) =>
    api.delete(`${url.API_HISTORY_DELETE}/${id}`, data);
export const deleteManyHistory = (data) =>
    api.delete(`${url.API_HISTORY_DELETE_MANY}`, data);
//Group
export const insertGroup = (data) => api.create(url.API_GROUP_INSERT, data);
export const getAllGroups = (data) => api.get(url.API_GROUP_GET_ALL, data);
export const updateGroup = (id, data) =>
    api.update(`${url.API_GROUP_UPDATE}/${id}`, data);
export const deleteGroup = (id, data) =>
    api.delete(`${url.API_GROUP_DELETE}/${id}`, data);
export const getPagingGroups = (data) =>
    api.get(url.API_GROUP_GET_PAGING, data);
export const deleteManyGroup = (data) =>
    api.delete(`${url.API_GROUP_DELETE_MANY}`, data);
export const getManagementGroupPage = (data) =>
    api.get(url.API_GROUP_GET_MANAGEMENT, data);

//Company
export const insertCompany = (data) => api.create(url.API_COMPANY_INSERT, data);
export const getAllCompanys = (data) => api.get(url.API_COMPANY_GET_ALL, data);
export const updateCompany = (id, data) =>
    api.update(`${url.API_COMPANY_UPDATE}/${id}`, data);
export const deleteCompany = (id, data) =>
    api.delete(`${url.API_COMPANY_DELETE}/${id}`, data);
export const getPagingCompanys = (data) =>
    api.get(url.API_COMPANY_GET_PAGING, data);
export const deleteManyCompany = (data) =>
    api.delete(`${url.API_COMPANY_DELETE_MANY}`, data);
export const getManagementCompanyPage = (data) =>
api.get(url.API_COMPANY_GET_MANAGEMENT, data);

//Action
export const deleteActionHistory = (id, data) =>
    api.delete(`${url.API_ACTION_HISTORY_DELETE}/${id}`, data);
export const deleteIntervalActionHistory = (data) =>
    api.delete(`${url.API_ACTION_HISTORY_DELETE_INTERVAL}?gte=${data.gte}&lte=${data.lte}`, data);
export const deleteManyActionHistory = (data) =>
    api.delete(`${url.API_ACTION_HISTORY_DELETE_MANY}`, data);
export const getPagingActionHistory = (data) =>
    api.get(url.API_ACTION_HISTORY_GET_PAGING, data);
export const getActionByIdHistory = (id, data) =>
    api.get(`${url.API_ACTION_HISTORY_GET_PAGING_BY_ID}/${id}`, data);
export const getManagementActionHistoryPage = (data) =>
    api.get(url.API_ACTION_HISTORY_GET_MANAGEMENT, data);