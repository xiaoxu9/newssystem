import axios from "axios";
import {store} from '../redux/store'

// 全局配置axios的请求地址和端口
axios.defaults.baseURL="http://localhost:8100"

// axios.defaults.headers

// axios.interceptors.request.use


// 配置拦截加载中
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 显示加载中
    store.dispatch({
        type: "change-loading",
        payload: true
    })
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // 隐藏加载中
    store.dispatch({
        type: "change-loading",
        payload: false
    })
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 隐藏加载中
    store.dispatch({
        type: "change-loading",
        payload: false
    })
    return Promise.reject(error);
  });

