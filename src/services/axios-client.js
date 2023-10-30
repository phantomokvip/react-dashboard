import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
const BEARER = "Bearer "

const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

if (token)
  axios.defaults.headers.common["Authorization"] =
    BEARER + token.replace(/"/g, "");

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.log("Request error: " + error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    console.log("Response error: " + error);
    return Promise.reject(error);
  }
);

const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] =
    BEARER + token.replace(/"/g, "");
};

class AxiosClient {
  // get = async (url, config) => {
  //   return axios.get(url, { ...config });
  // };

  get = async (url, params) => {
    let response;

    let paramKeys = [];

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
    }
    return response;
  };

  post = (url, data, config) => {
    return axios.post(url, data, { ...config });
  };

  put = (url, data, config) => {
    return axios.put(url, data, { ...config });
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };


  uploadImage = (url, data) => {
    return axios.post(url, data, { headers: { "content-type": "application/x-www-form-urlencoded" } });
  };
}


const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  } else {
    return token;
  }
};

export { AxiosClient, setAuthorization, getToken };
