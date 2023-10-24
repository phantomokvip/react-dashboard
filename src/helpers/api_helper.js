/* eslint-disable no-debugger */
import axios from "axios";
import { message } from "antd";
import { getToken } from "./common";
const urlRefreshToken = "/api/users/refresh-token";
const token = getToken() || null;

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common['Access-Control-Max-Age'] = '86400';

if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    if (error.response.data === "Forbidden") {
      console.warn(`Bạn không có quyền truy cập!`);
    } else if (error.response.data.data.name === "TokenExpiredError") {
      message.error(`Vui lòng đăng nhập để tiếp tục!`);
      setTimeout(() => {
        window.location.replace("/logout");
      }, 3000);
    }

    return Promise.reject(error);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {

  get = async (url, params, isApiKey = false) => {
    let response;

    let paramKeys = [];
    if (isApiKey) {
      axios.defaults.headers.common["X-API-Key"] = "okvip@@123321123!!!";
    }
    const token = getToken() || null;

    if (token)
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });
      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      await axios
        .get(`${url}?${queryString}`, params)
        .then(function (res) {
          response = res;
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      await axios
        .get(`${url}`, params)
        .then(function (res) {
          response = res;
        })
        .catch(function (error) {
          if (error === "Request failed with status code 401") {
            axios
              .post(`${urlRefreshToken}`, null)
              .then((res) => {
                var abc = true;
              })
              .catch((err) => {
                var cb = true;
              });
          }
        });
    }
    return response;
  };

  create = (url, data) => {
    return axios.post(url, data);
  };

  update = (url, data) => {
    return axios.put(url, data);
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };

  createWithFormData = (url, data) => {
    let formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return axios.post(url, formData, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  };

  updateWithFormData = (url, data) => {
    let formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return axios.put(url, formData, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
