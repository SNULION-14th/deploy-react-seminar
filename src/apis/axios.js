// src/apis/axios.js

import axios from "axios";
import { getCookie } from "../utils/cookie";

// baseURL, credential, 헤더 세팅
axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = getCookie("csrftoken");

// 누구나 접근 가능한 API
export const instance = axios.create();

// Token 있어야 접근 가능한 API
export const instanceWithToken = axios.create();

// instanceWithToken에는 쿠키에서 토큰을 찾아 Authorization 헤더에 넣기
instanceWithToken.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      return config;
    }

    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    console.log("Request Error!!");
    return Promise.reject(error);
  }
);

instanceWithToken.interceptors.response.use(
  (response) => {
    console.log("Interceptor Response!!");
    return response;
  },
  (error) => {
    console.log("Response Error!!");
    return Promise.reject(error);
  }
);