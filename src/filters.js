export const formatDate = (date, fmt) => {
    if (!date) {
        return
    }
    let getDate = new Date(date);
    let o = {
        'M+': getDate.getMonth() + 1,
        'd+': getDate.getDate(),
        'h+': getDate.getHours(),
        'm+': getDate.getMinutes(),
        's+': getDate.getSeconds(),
        'q+': Math.floor((getDate.getMonth() + 3) / 3),
        'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt;
};
// 数字精度截取处理
export const formatNumberFloor = (number, accuracy) => {
    accuracy = Number(accuracy);
    number = Number(number);
    if (!accuracy) return Math.floor(number * 100000000) / 100000000;
    if (accuracy === 0) return Math.floor(number);
    if (!number || number === 0) {
        return 0;
    } else if (number > 0) {
        let m = Math.pow(10, accuracy)
        return Math.floor(number * m) / m
    } else {
        number = Math.abs(number)
        if (number < 0.0000000001) return 0;
        let m = Math.pow(10, accuracy)
        return '-' + Math.floor(number * m) / m
    }
};

// 获取状态
export const getStatus = (type ,status) => {
    let ss = ["未审核","审核中","中","成功","失败"];
    if (status >=3 && status <= 5){
        let name = (type ==1 ? "充值":"提现");
        return name + ss[status-1]
    }
    return ss[status-1];
};

// 时间格式化
export const getDate = date => {
    let datetime = new Date(date);

    const [year, month, day] = [datetime.getFullYear(),  format(datetime.getMonth() + 1 ), format(datetime.getDate())];

    return `${year}-${month}-${day}`;
}
export const getTime = date => {
    let datetime = new Date(date);

    const [hour, minute] = [format(datetime.getHours()), format(datetime.getMinutes())];

    return `${hour}:${minute}`;
}

export const format = d=> {
    if(d < 10 ) return "0" + d;

    return d;
}
export function getCoinDigit(type) {
    if(type === 'USD') {
        return 2;
    } else if(type === "USDT") {
        return 4;
    } else if(type === 'ETH') {
        return 5;
    } else if(type === "BTC"){
        return 8;
    }
}
// num 保留的数字 digit 保留的小数位数
export function saveDecimal(num, digit) {
    let floatNum = parseFloat(num);
    if(isNaN(floatNum)) return false;

    floatNum = Math.floor(num * 10 ** digit) / 10 ** digit;

    let str = floatNum.toString();
    let decimalPos = str.indexOf('.');

    if(decimalPos < 0) {
        decimalPos = str.length;
        str += ".";
    }

    while(str.length <= decimalPos + digit) {
        str += "0";
    }
    return str;
}

export function sum(a, b, digit) {
    return (a * (10 ** digit) + b * (10 ** digit)) / (10 ** digit);
}
// 金额格式化
export function toThousandFilter(num) {
    return (num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

// 手机号脱敏（规则：前三后四）
export function formatTel(tel) {
    if(!tel) return;
    return tel.substring(0, 3) + "***" + tel.substring(tel.length - 2);
}
export function formatEmail(eml) {
    if(!eml) return;
    let i = eml.lastIndexOf('@');
    let j = eml.indexOf('@');
    if(j < 3) return eml.substring(0, j) + "***" + eml.substring(i);
    return eml.substring(0, 3) + "***" + eml.substring(i);
}
// 小数位数
export function isNumber(num) {
    const reg = /^([0]\.\d+|[1-9]\d*(\.?\d+)?)$/;
    const n = Number(num);
    if(n > 2 ** 53) return 2 ** 53;
    return reg.test(num);
}