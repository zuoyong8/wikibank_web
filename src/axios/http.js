import axios from 'axios';
import qs from 'qs';
import router from '../router';
import _this from '../main'

let CancelToken = axios.CancelToken;
let global = 'http://www.wikipay.net/api/v1'; //服务器
// let global = 'http://192.168.1.69:2233/api/v1'; // 测试
//设置默认请求头
axios.defaults.headers = {
    'Content-Type': 'application/json',
    'x-client': "web"  //内页访问添加此字段
}
// 请求超时的时间限制
axios.defaults.timeout = 6000
axios.defaults.baseURL = '/api/';
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;



// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体

axios.interceptors.request.use(config => {
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个不同的时间戳
    let cancel;
    if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization');
    }

    if (_this.$store.state.language) {
        config.headers.Language = _this.$store.state.language;
    }
    return config
}, error => {
    return Promise.reject(error);
})


// 请求到结果的拦截处理
axios.interceptors.response.use(config => {
    // 返回请求正确的结果
    if (config.data.code === 1010012) {
        // localStorage.removeItem('userInfo');
        _this.$setItem('userInfo', null);
        localStorage.removeItem('token');
        _this.$store.commit('changeStatus', false);
        router.push({ path: `/user/${'login'}` });
    }
    return config;
}, error => {
    //  // 请求超时处理
    let config = error.config;
    // 如果config不存在或未设置重试选项，请拒绝
    if (!config || !config.retry) return Promise.reject(error);
    // 设置变量跟踪重试次数
    config.__retryCount = config.__retryCount || 0;
    // 检查是否已经达到最大重试总次数
    if (config.__retryCount >= config.retry) {
        // 抛出错误信息
        return Promise.reject(error);
    }
    // 增加请求重试次数
    config.__retryCount += 1;
    // 创建新的异步请求
    let backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });
    // 返回axios信息，重新请求
    return backoff.then(function () {
        return axios(config);
    });
})


// post 请求
const post = (url, params, success) => {
    axios.post(global + "/" + url, params).then(res => {
        success(res.data);
    }).catch(err => {
        console.log(err);
    })
}
//
const getCaptchaUrl = (id) => {
    return global + "/web/pc/login/captcha?id=" + id
}

// get请求
const get = (url, params, success) => {
    for (const key in params) {
        if (params[key] == '') {
            delete params[key]
        }
    }
    let data = {
        params: params,
    }
    axios.get(global + url, data).then(res => {
        success(res.data);
    }).catch(err => {
        console.log(err);
    })
}

//restful api接口获取
const restGet = (url, param, success) => {
    axios.get(global + url + param).then(res => {
        success(res.data);
    }).catch(err => {
        console.log(err);
    })
}

// 上传图片
const upImg = (url, data, handle) => {
    let instance = axios.create({
        baseURL: global,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem('token')
        }
    });
    instance.post(url, data).then(res => {
        handle(res.data);
    }).catch(error => {
        console.log(error);
    })
}

//
const install = (Vue) => {
    /*
    外页模块
    */

    //获取验证码序列号
    Vue.prototype.$getCaptchaid = (params, success) => get('/web/pc/login/captchaid', params, success);

    Vue.prototype.$getCaptcha = (id) => getCaptchaUrl(id);

    //二维码状态检测
    Vue.prototype.$getQrcode = (params, success) => get('/web/pc/qrcode', params, success);

    Vue.prototype.$scanQrcode = (param, success) => restGet("/web/pc/qrcode/", param, success)

    //获取国旗
    Vue.prototype.$getFlags = (params, success) => get("/web/pc/flags", params, success);

    /*
    内页模块
    */

    //个人信息
    Vue.prototype.$getInformation = (params, success) => get("/user/info", params, success);

    //账户余额信息
    Vue.prototype.$getAccount = (params, success) => get("/account/info", params, success);

    //所有账单
    Vue.prototype.$getBill = (params, success) => get("/account/bill/list", params, success);

    //收益
    Vue.prototype.$getProfit = (params, success) => get("/account/profit", params, success);

    //获取虚拟货币币种
    Vue.prototype.$getCoin = (params, success) => get("/account/coin/list", params, success);

    //获取地址
    Vue.prototype.$getAddress = (params, success) => get("/account/address", params, success);

    //充值、提现记录列表
    Vue.prototype.$getWithdrawDepositList = (params, success) => get("/account/withdraw-deposit/list", params, success);

    //转账列表
    Vue.prototype.$getTransferList = (params, success) => get("/account/transfer/list", params, success);

    //获取币美元价格
    Vue.prototype.$getUsd = (params, success) => get("/account/usd", params, success);

    //获取账单列表
    // Vue.prototype.$getTransferList = (params,success) => get("/account/transfer/list", params, success);

    //获取个人联系列表
    Vue.prototype.$getContactList = (params, success) => get("/im/contact/list", params, success);

    //显示个人所有地址信息 
    Vue.prototype.$getAddressList = (params, success) => get("/account/address/list", params, success);

    // 查找联系人信息
    Vue.prototype.$getContactInfo = (params, success) => get("/im/contact/find", params, success);

    //删除联系人
    Vue.prototype.$deleteContact = (params, success) => post("im/contact/delete", params, success);

    // 转账
    Vue.prototype.$transfer = (params, success) => post("web/pc/transfer/create", params, success);

    //提现
    Vue.prototype.$withdraw = (params, success) => post("web/pc/withdraw/create", params, success);

    // 用户手机登录
    Vue.prototype.$phoneLogin = (params, success) => post('web/pc/login', params, success);

    //修改登录密码
    Vue.prototype.$loginPwd = (params, success) => post('user/pwd/change', params, success);

    //修改支付密码
    Vue.prototype.$payPwd = (params, success) => post('user/paypwd/change', params, success);

    //发送邮箱验证码
    Vue.prototype.$sendEmailCode = (params, success) => post('user/email/send', params, success);

    //验证邮箱地址
    // Vue.prototype.$verifyEmailCode = (params, success) => post('user/email/verify', params, success);

    // 获取法定货币汇率
    Vue.prototype.$getCoinRate = (params, success) => get("/account/currency", params, success);
}
export default install;

