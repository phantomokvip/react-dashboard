import { GET_PAGING_USERS_API_URL, INSERT_USER_API_URL, LOGIN_API_URL, UPLOAD_IMAGE, UPDATE_USER_API_URL, GET_BY_USER_CODE, DELETE_USER } from "./api_urls";
import { AxiosClient } from "./axios-client";
const axiosClient = new AxiosClient();
export function login(data) {
    return axiosClient.post(LOGIN_API_URL, data)
}

export function getPaging(data) {
    return axiosClient.get(GET_PAGING_USERS_API_URL, data)
}

export function insert(data) {
    return axiosClient.post(INSERT_USER_API_URL, data)
}

export function update(data) {
    return axiosClient.put(UPDATE_USER_API_URL, data)
}

export function uploadImage(data) {
    return axiosClient.uploadImage(UPLOAD_IMAGE, data)
}


export function getUserByUserCode(data) {
    return axiosClient.get(`${GET_BY_USER_CODE}/${data.userCode}`, data)
}
export function deleteUser(data) {
    return axiosClient.delete(`${DELETE_USER}/${data}`, data)
}