import axios from "axios";
import { makeRandomCode, makeTimestamp } from "../utils/index";
import { getRefreshToken } from "./authApi";
import { message } from "antd";

let loginUrl = "";

const request = axios.create({
  baseURL: "",
  timeout: 300000,
});

// 根据域名拼接出baseUrl
let apiport = window.location.port;
let PLATFORMNAME = "/" + window.location.pathname.split("/")[1];
let APPNAME = PLATFORMNAME + "/" + window.location.pathname.split("/")[2];
let SUBAPPNAME = "/" + window.location.pathname.split("/")[3];
let APINAME = APPNAME + SUBAPPNAME + "api";
let BASEURL =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  apiport +
  APINAME;

loginUrl =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  apiport +
  PLATFORMNAME +
  "/core/customerLogin";
request.defaults.baseURL = BASEURL;
//axios 拦截器
request.interceptors.request.use(
  (config) => {
    let token = window.sessionStorage.getItem("access-token");
    let csrfToken = window.sessionStorage.getItem("csrfToken");
    if (token && csrfToken) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.CSRFToken = `${csrfToken}`;
      config.headers.Timestamp = `${makeTimestamp()}`;
      config.headers.RanCode = `${makeRandomCode()}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// isRefreshing是否正在调用refresh-token这个接口。
// requestQueue所有触发了refresh-token的队列。
// 比如说用户存在手抖，一下子点了4次，然而此时token早已经过期。这就回导致用户调用4次 /refresh-token ，这是没有必要的。需要用这俩实现类似于‘防抖’的效果

type QueueItem = {
  callback: (token: string) => any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let requestQueue: QueueItem[] = [];

function queueRequest(callback: any) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ callback, resolve, reject });
  });
}

function resolveQueue(newToken: any) {
  requestQueue.forEach(({ callback, resolve }) => {
    resolve(callback(newToken));
  });
  requestQueue = [];
}

function rejectQueue(error: any) {
  requestQueue.forEach(({ reject }) => reject(error));
  requestQueue = [];
}

// http response 拦截器
request.interceptors.response.use(
  (response) => {
    if (response.data?.resCode === "00000") {
      return response.data.result;
    } else {
      message.warning(response?.data?.resMsg || "Unexpected Error");
      return Promise.reject(response?.data);
    }
  },
  async (error) => {
    // 获取本次请求的config
    const originalRequestConfig = error.config;
    // 是否为 /refresh-token 挂了
    const isRefreshRequest =
      originalRequestConfig.url.includes("/refresh-token");

    // 401 == accessToken过期
    if (error.response?.status === 401 && !isRefreshRequest) {
      if (isRefreshing) {
        // 若正在刷新，挂起这个请求，等待刷新结果
        return queueRequest((newToken: string) => {
          // 构造新的请求配置
          originalRequestConfig.headers.Authorization = `Bearer ${newToken}`;
          return request(originalRequestConfig);
        });
      }

      isRefreshing = true;
      try {
        const res = await getRefreshToken();
        const { accessToken, csrfToken: newCsrfToken } = res?.data;

        sessionStorage.setItem("access-token", accessToken);
        sessionStorage.setItem("csrfToken", newCsrfToken);

        isRefreshing = false;
        resolveQueue(accessToken);

        // 重新请求当前原始请求
        originalRequestConfig.headers.Authorization = `Bearer ${accessToken}`;
        return request(originalRequestConfig);
      } catch (err) {
        // 如果refresh-token报错
        isRefreshing = false;
        rejectQueue(err);
        sessionStorage.clear();
        // 跳转登录页并提示
        message.warning("会话已过期，请重新登录" || "Unexpected Error");
        window.localStorage.removeItem("isLogin");
        window.location.replace(loginUrl);
        return Promise.reject(error?.response?.data); // 返回接口返回的错误信息
      }
    } else {
      //其他错误
      message.warning(
        error?.response?.data?.resMsg ||
          error?.response?.data?.message ||
          "Unexpected Error"
      );

      return Promise.reject(error?.response?.data); // 返回接口返回的错误信息
    }
  }
);

export default request;
