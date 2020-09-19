import Vue from 'vue'
import Vuex from 'vuex'
import { fetchRate, fetchAccountInfo, fetchProfit } from '@/api/request'
import axios from "@/api/request"
import { formatTel, saveDecimal, toThousandFilter } from "@/filters";
import request from "@/axios/request";
Vue.use(Vuex)
const state = {
    //token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    // 内页个人信息
    userInfo: {},
    language: localStorage.getItem("language") ? localStorage.getItem("language"):'简体中文', // 语言
    langAbbr: localStorage.getItem("langAbbr") ? localStorage.getItem("langAbbr"):"zh-CN", // 语言简写
    langFlag: localStorage.getItem("langFlag") ? localStorage.getItem("langFlag"):require("@/assets/imgs/flag_icon_20200526.png"), // 语言国旗
    languageList: [
        {
            id: 1,
            lang: "简体中文",
            flag: require("@/assets/imgs/flag_icon_20200526.png"),
            value: "zh-CN"
        },
        {
            id: 2,
            lang: "繁體（香港）",
            flag: require("@/assets/login/flag_honkon.png"),
            value: "zh-HK"
        },
        {
            id: 3,
            lang: "繁體（台灣）",
            flag: require("@/assets/login/flag_tw.png"),
            value: "zh-TW"
        },
        {
            id: 4,
            lang: "English",
            flag: require("@/assets/login/flag_en.png"),
            value: "en"
        },
        {
            id: 5,
            lang: "Tiếng việt", // 越南语
            flag: require("@/assets/login/flag_vi.png"),
            value: "vi"
        },
        {
            id: 6,
            lang: "ไทย", // 泰语
            flag: require("@/assets/login/flag_th.png"),
            value: "th"
        }
    ], // 语言列表
    rate: localStorage.getItem("coinRate") ? localStorage.getItem("coinRate"):1, // 货币转换汇率
    coinFlag: localStorage.getItem("coinFlag") ? localStorage.getItem("coinFlag") : "https://img.wikifx.com/flag/adaa5e0b8a65a672/US.png_wiki-template-global", // 货币国旗
    coinName: localStorage.getItem("coinName") ? localStorage.getItem("coinName") : "pub_currency_usd", // 货币名称
    coinSymbol: localStorage.getItem("coinSymbol") ? localStorage.getItem("coinSymbol") : "$", // 货币符号
    coinAbbre: localStorage.getItem("coinAbbre") ? localStorage.getItem("coinAbbre") : "USD", // 货币简称
    evaluateProfit: 0, // 预估收益
    annualProfit: 0, // 年化收益 
    accountInfo: {}, // 账户信息
    walletList: [], // 钱包列表
    payWay: [], // 支付方式
    isShowAsset: !localStorage.getItem("isShowAsset") ? "show" : localStorage.getItem("isShowAsset"), // 是否显示资产
};
const mutations = {
    // 更改显示资产状态
    changeAssetStatus(state, status) {
        state.isShowAsset = status;
        localStorage.setItem("isShowAsset", status);
    },
    // 登录
    changeLogin(state, user) {
        state.Authorization = user.Authorization
        localStorage.setItem('Authorization', user.Authorization)
    },
    // 获取个人信息
    getUserInfo(state, info) {
        state.userInfo = info;
    },
    // 设置语言
    changeLanguage(state, { flag, lang, value }) {
        localStorage.setItem("language", lang);
        localStorage.setItem("langFlag", flag);
        localStorage.setItem("langAbbr", value);
        state.language = lang;
        state.langFlag = flag;
        state.langAbbr = value;
        request.defaults.headers["Language"] = value;
    },
    // 根据货币类型获取对应的货币信息
    changeCoin(state, { price, coinName, coinSymbol, coinAbbre, coinFlag }) {
        localStorage.setItem("coinAbbre", coinAbbre);
        localStorage.setItem("coinName", coinName);
        localStorage.setItem("coinSymbol", coinSymbol);
        localStorage.setItem("coinFlag", coinFlag);
        localStorage.setItem("coinRate", price);
        state.rate = price;
        state.coinName = coinName;
        state.coinSymbol = coinSymbol;
        state.coinAbbre = coinAbbre;
        state.coinFlag = coinFlag;
    },
    // 余额
    wallet(state, list) {
        state.walletList = list;
    },
    // 收益
    profit(state, { profit, interest }) {
        state.evaluateProfit = profit;
        state.annualProfit = interest;
    }
};
const actions = {
    // 获取账户余额
    async fetchWallet({ commit }) {
        try {
            const res = await fetchAccountInfo();
            if (res.code === 0) {
                const { cloudWallet, usdWallet } = res.data.accounts;
                const list = [...cloudWallet, ...[usdWallet]];
                commit("wallet", list);
            } else {
             
            }

        } catch (error) {
           
        }

    },
    // 获取用户基本信息
    async getUserInfo({ commit }) {
        const params = {}

        const res = await axios.fetchPersonInfo(params);

        if (res.code === 0) {
            const data = res.data;
            commit("getUserInfo", data)
        } else {
          
            
        }
    },

    // 更改货币汇率
    async changeCoin({ commit }, coin) {
        const params = {
            countryCode: "156",
            original: "USD",
            dest: coin.abbre
        }

        if (coin.abbre === "USD") {
            commit('changeCoin', { price: 1, coinName: coin.name, coinSymbol: coin.symbol, coinAbbre: coin.abbre, coinFlag: coin.flag })
        } else {
            const res = await fetchRate(params);

            if (res.code === 0) {
                const { price } = res.data;
                commit("changeCoin", { price, coinName: coin.name, coinSymbol: coin.symbol, coinAbbre: coin.abbre, coinFlag: coin.flag });
            } else {
               
                
            }
        }
    },

    // 账户收益
    async fetchProfit({ commit }) {
        const params = {};
        const res = await fetchProfit(params);

        if (res.code === 0) {
            let { profit, interest } = res.data;
            if (!profit) profit = 0;
            commit("profit", { profit, interest })
        } else {
           
            
        }
    }
};
const getters = {
    // 个人手机号
    getTel: state => {
        return formatTel(state.userInfo.phone);
    },
    // 头像
    getAvatar: state => {
        if (!state.userInfo.avatar) {
            if (state.userInfo.sex === 1) {
                return require("@/assets/account/man_avatar_20200710.png");
            } else {
                return require("@/assets/account/woman_avatar_20200710.png");
            }
        }

        return state.userInfo.avatar;
    },
    // 账户余额
    getWallet: state => {
        if (state.walletList.length > 0) {
            let usd = state.walletList.find(item => item.coin === "USD");
            let usdt = state.walletList.find(item => item.coin === "USDT");
            let eth = state.walletList.find(item => item.coin === "ETH");
            let btc = state.walletList.find(item => item.coin === "BTC");

            return {
                total: toThousandFilter(saveDecimal(state.walletList.map(item => item.total).reduce((accu, current) => accu + current) * +state.rate, 2)),
                allTotal: saveDecimal(state.walletList.map(item => item.total).reduce((accu, current) => accu + current) * +state.rate, 2),
                available: saveDecimal(state.walletList.map(item => item.available * item.usd).reduce((accu, current) => accu + current) * +state.rate, 2),
                withdraw: saveDecimal(state.walletList.map(item => item.frozen * item.usd).reduce((accu, current) => accu + current) * +state.rate, 2),
                usdTotal: saveDecimal(usd.total, 2),
                usdThousandTotal: toThousandFilter(saveDecimal(usd.total, 2)),
                usdAvail: saveDecimal(usd.available, 2),
                usdFrozen: saveDecimal(usd.frozen, 2),
                usdtTotal: saveDecimal(usdt.available + usdt.frozen, 4),
                usdtThousandTotal: toThousandFilter(saveDecimal(usdt.available + usdt.frozen, 4)),
                usdtAvail: saveDecimal(usdt.available, 4),
                usdtFrozen: saveDecimal(usdt.frozen, 4),
                ethTotal: saveDecimal(eth.available + eth.frozen, 5),
                ethThousandTotal: toThousandFilter(saveDecimal(eth.available + eth.frozen, 5)),
                ethAvail: saveDecimal(eth.available, 5),
                ethtFrozen: saveDecimal(eth.frozen, 5),
                btcTotal: saveDecimal(btc.available + btc.frozen, 8),
                btcThousandTotal: toThousandFilter(saveDecimal(btc.available + btc.frozen, 8)),
                btcAvail: saveDecimal(btc.available, 8),
                btcFrozen: saveDecimal(btc.frozen, 8),
            }
        } else {
            return {
                total: 0,
                available: 0,
                withdraw: 0,
                usdTotal: 0,
                usdAvail: 0,
                usdFrozen: 0,
                usdtTotal: 0,
                usdtAvail: 0,
                ethTotal: 0,
                ethAvail: 0,
                btcTotal: 0,
                btcAvail: 0
            }
        }

    },
    // 账户列表
    getAccountList: state => {
        return state.walletList.map(item => {
            return {
                coinAvatar: item.icon,
                coinName: item.coin,
                available: saveDecimal(item.available, item.showPrecision) + " " + item.coin,
                withdraw: saveDecimal(item.frozen, item.showPrecision) + " " + item.coin,
                evaluate: saveDecimal(item.total * +state.rate, 2),
                coinType: state.coinAbbre,
                total: saveDecimal(item.available + item.frozen, item.showPrecision)
            }
        }).sort((a, b) => {
            return +(b.evaluate) - +(a.evaluate);
        })
    },
    // 账户收益
    getProfit: state => {
        return {
            evaluate: saveDecimal(state.evaluateProfit * +state.rate, 2),
            usdeEvaluate: saveDecimal(state.evaluateProfit, 2),
            annual: saveDecimal(state.annualProfit, 2)
        };
    },

    // 计算货币价格
    getRate(state) {
        return state.rate;
    },
    getLanguage(state) {
        return state.language
    },
    getStatue() {
        state.status = localStorage.getItem('userInfo') ? true : false;
        return state.status
    },
    getGoogle(state) {
        return state.bindGoogle
    },
    getFundPwd(state) {
        return state.bindFundPwd
    }
};
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});