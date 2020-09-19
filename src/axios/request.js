import axios from 'axios';
import router from '@/pages/system/router';
let global = 'http://www.wikipay.net/api/v1'; //服务器
//let global = 'http://18.162.243.214:81/api/v1'; // 测试
import Vue from 'vue';
import VueMessages from 'vue-messages'
Vue.use(VueMessages, {
    content: '',
    duration: 2,
    // themes: 'blackGold', // classic or classicBold
    styles: {
        fontSize: '16px',
        top: '28px'
    }
});

let vue = new Vue();
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
    const { code, msg } = config.data;
    switch(code) {
        case 1010012: // 返回请求正确的结果 token 失效
            router.push({ path: '/' })
            return Promise.reject(msg);
        default:
            return config.data;
    }
}, error => {
    return Promise.reject(error);
})

export default request;