import request from "@/axios/request";
import flagJson from "@/db/AreaCodeCN.json";
let global = 'http://www.wikipay.net/api/v1';
//let global = 'http://18.162.243.214:81/api/v1'; // 测试
export default {
    // 验证提现地址是否正确
    vertifyAddress: params => request({
        method: "GET", url: "/account/address/validate", params
    }),
    // 登录 
    login: params => request({
        method: "POST", url: "/web/pc/login", data: params
    }),
    // 获取二维码
    getQrcode: params => request({
        method: "GET", url: "/web/pc/qrcode", params
    }),
    // 二维码检测
    checkQrcode: params => request({
        method: "GET", url: `/web/pc/qrcode/${params}`
    }),
    // 提现、转账风控
    limitPayCheck: params => request({
        method: "GET", url: "/account/pay/check", params
    }),
    // 校验联系人账户是否存在
    vertifyIncomeName: params => request({
        method: "GET", url: "/im/contact/find", params
    }),
    // 监测转账状态
    checkTransferStatus: params => request({
        method: "POST", url: "/web/pc/transfer/status", data: params
    }),
    // 创建转账订单
    createTransferOrder: params => request({
        method: "POST", url: "/web/pc/transfer/create", data: params
    }),
    // 数字货币列表
    coinList: params => request({
        method: "GET", url: "/account/coin/list", params
    }),
    // 取数字货币当前的美元价格
    convertPrice: params => request({
        method: "GET", url: "/account/usd", params
    }),
    // 兑换
    exchange: params => request({
        method: "POST", url:"/account/bidask/transfer", data: params
    }),
    // 交易记录
    fetchTradeRecord: params => request({
        method: "GET", url: "/account/transaction/list", params
    }),
    // AB 卡充值
    abDeposit: params => request({
        method: "POST", url: "/card/topup/deposit", data: params
    }),
    // 获取数字货币地址
    coinAddress: params => request({
        method: "GET", url: "/account/address", params
    }),

    // 添加钱包地址
    addWalletAddr: params => request({
        method: "POST", url: "/account/address/add", data: params
    }),

    // 获取个人信息
    fetchPersonInfo: params => request({
        method: "GET", url: "/user/info", params
    }),
    // 认证邮箱
    checkEmail: params => request({
        method: "GET", url: "/user/email/check", params
    }),
    // 验证邮箱是否存在
    isExistEmail: params => request({
        method: "GET", url: "/user/email/validate", params
    }),
    // 发送邮箱验证码
    sendEmailCode: params => request({
        method: "POST", url: "/user/email/send", data: params
    }),
    // 修改邮箱
    updateEmail: params => request({
        method: "POST", url: "/user/email/modify", data: params
    }),
    // 验证邮箱
    vertifyEmail: params => request({ 
        method: "POST", url: "/user/email/verify", data: params 
    }), 

    // 发送手机验证码 
    sendVerifyCode: params => request({ 
        method: "POST", url: "/user/sms/send", data: params 
    }), 
    // 验证手机验证码
    vertifyTelCode: params => request({ 
        method: "POST", url: "/user/sms/verify", data: params 
    }), 
    
    // 找回登录密码
    findLoginPassword: params => request({
        method: "POST", url: "/user/pwd/forget", data: params
    }),

    // 修改登录密码
    updateLoginPassword: params => request({ 
        method: "POST", url: "/user/pwd/change", data: params 
    }), 
    // 修改支付密码
    updatePayPassword: params => request({ 
        method: "POST", url: "/user/paypwd/change", data: params 
    }), 

    // 找回支付密码流程( 验证手机号 => 验证邮箱 => 确认找回支付密码 )
    vertifyPayTel: params => request({
        method: "POST", url: "/user/paypwd/retrieve/phone", data: params
    }),
    vertifyPayEmail: params => request({
        method: "POST", url: "/user/paypwd/retrieve/email", data: params
    }),
    resetPayPassword: params => request({
        method: "POST", url: "/user/paypwd/retrieve/confirm", data: params
    }),
    // 获取图形验证码序列号
    getVertifyId: params => request({
        method: "GET", url: "/web/pc/login/captchaid", params
    }),
    // 获取图形验证码
    getVertifyImg: params => {
        return global + "/web/pc/login/captcha?id=" + params
    },

    // 获取配置信息
    getConfigInfo: params => request({
        method: "GET", url: "user/config", params
    })
}

// 获取法定货币汇率
export function fetchRate(params) {
    return request({
        method: "get",
        url: "/account/currency",
        params
    })
}

// 收益
export function fetchProfit(params) {
    return request({
        method: "get",
        url: "/account/profit",
        params
    })
}

// 个人账单
export function fetchBill(params) {
    return request({
        method: "get",
        url: "/account/bill/list",
        params
    })
}

// 获取充值、提现记录
export function fetchWithdrawDeposit(params) {
    return request({
        method: "get",
        url: "/account/withdraw-deposit/list",
        params
    })
}

// 充值、提现详情
export function fetchWithdrawDepositDetail(params) {
    return request({
        method: "GET",
        url: "/account/withdraw-deposit/detail",
        params
    })
}

// 转账详情
export function fetchTransferDetail(params) {
    return request({
        method: "GET",
        url: "/account/transfer/detail",
        params
    })
}

// 兑换详情
export function fetchExchangeDetail(params) {
    return request({
        method: "GET",
        url: "/account/bidask/transfer/detail",
        params
    })
}

// 转账记录
export function fetchTransfer(params) {
    return request({
        method: "get",
        url: "/account/transfer/list",
        params
    })
}

// 提现地址簿列表
export function fetchAddressList(params) {
    return request({
        method: "GET",
        url: "/account/address/list",
        params
    })
}

// 删除地址簿
export function deleteAddress(params) {
    return request({
        method: "POST",
        url: "/account/address/delete",
        data: params
    })
}

// 转账联系人列表
export function fetchContactList(params) {
    return request({
        method: "GET",
        url: "/im/contact/list",
        params
    })
}

// 删除联系人
export function deleteContact(params) {
    return request({
        method: "POST",
        url: "/im/contact/delete",
        data: params
    })
}

// 账户余额查询
export function fetchAccountInfo(params) {
    return request({
        method: "GET",
        url: "/account/info",
        params
    })
}

// 提交提现订单
export function handleWithdraw(params) {
    return request({
        method: "POST",
        url: "/web/pc/withdraw/create",
        data: params
    })
}

// 提交转账订单
export function handleTransfer(params) {
    return request({
        method: "POST",
        url: "/account/transfer",
        data: params
    })
}

// 获取国旗
export function fetchCountry() {
    return flagJson;
}

// get
export function getExample(params) {
    return request({
        method: "get",
        url: "/account/currency",
        params: params
    })
}
// post
export function postExample(params) {
    return request({
        method: "post",
        url: "/account/currency",
        data: params
    })
}

