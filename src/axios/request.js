import axios from 'axios';
import router from '../router';
import { Message } from 'view-design';
let global = 'http://www.wikipay.net/api/v1'; //服务器
// let global = 'http://192.168.1.69:2233/api/v1'; // 测试

const request = axios.create({
    baseURL: global,
    timeout: 6000,
});

request.defaults.headers = {
    'Content-Type': 'application/json',
    'x-client':"web"  //内页访问添加此字段
}

request.interceptors.request.use(config => {
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个不同的时间戳
    let cancel;
    if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization'); 
    }

    return config;
}, error => {
    return Promise.reject(error);
})

request.interceptors.response.use(config => {
    
    // 返回请求正确的结果 token 失效
    if (config.data.code === 1010012) {
       Message.error('您已在其它地方登录！')
       return router.push({ path: '/' });
    }
    return config.data;
}, error => {
    return Promise.reject(error);
})

export default request;