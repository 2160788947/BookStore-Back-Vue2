import axios from 'axios'
import router from '@/router'

axios.defaults.timeout = 5000;


// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });

axios.interceptors.response.use(
    config => {
        if (localStorage.getItem('token') && config.data.statusCode == 600) {
            localStorage.removeItem('token')
            router.replace({
                path: '/login',
            })
            return config;
        }
        if (config.data.statusCode != 200)
            return Promise.reject(config.data);
        return config;
    },
    error => {
        return Promise.reject(error);
    });

export function getRequest(url, params) {
    let token = localStorage.getItem('token')
    return axios({
        method: "get",
        url: "http://localhost:8090/bookstore" + url,
        params: params,
    })
}
export function postRequest(url, params) {
    let token = localStorage.getItem('token')
    return axios({
        method: "post",
        url: "http://localhost:8090/bookstore" + url,
        params: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
}
export function postJsonRequest(url, params) {
    let token = localStorage.getItem('token')
    return axios({
        method: "post",
        url: "http://localhost:8090/bookstore" + url,
        data: params,
        headers: {
            "Content-Type": "application/json",
        }
    })
}