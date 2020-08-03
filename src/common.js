import Vue from 'vue'

//倒计时时间处理
export const filterTime = (leftTime) => {
    let timeDiff = leftTime // 倒计时时间
    let getM = parseInt(timeDiff / 1000) // 将毫秒转换成秒
    let getD = parseInt(getM / 86400) // 将秒转换成天
    getD = getD < 10 ? '0' + getD : getD
    getM %= 86400 // 获取到不到一天的秒数
    let getH = parseInt(getM / 3600) // 获取到剩余的小时数
    getM %= 3600 // 获取到不到一小时的分钟数
    let getMin = parseInt(getM / 60) // 获取到剩余分钟数
    getM %= 60 // 获取到不到一分钟的秒数
    let H = getH < 10 ? '0' + getH : getH // 小于10添加个0
    let M = getMin < 10 ? '0' + getMin : getMin // 小于10添加个0
    let S = getM < 10 ? '0' + getM : getM // 小于10添加个0
    let data = {
        dayOne: timeDiff > 0 ? getD.toString().substring(0, 1) : 0,
        dayTwo: timeDiff > 0 ? getD.toString().substring(1, 2) : 0,
        hourOne: timeDiff > 0 ? H.toString().substring(0, 1) : 0,
        hourTwo: timeDiff > 0 ? H.toString().substring(1, 2) : 0,
        minOne: timeDiff > 0 ? M.toString().substring(0, 1) : 0,
        minTwo: timeDiff > 0 ? M.toString().substring(1, 2) : 0,
        SOne: timeDiff > 0 ? S.toString().substring(0, 1) : 0,
        STwo: timeDiff > 0 ? S.toString().substring(1, 2) : 0,
        timeDiff: timeDiff,
    };
    return data
};

// 检查邮箱格式是否正确
export const check_email = (str) => {
    let reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    return reg.test(str);
};

// 检查手机号码格式是否正确
export const check_phone = (str) => {
    let reg = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
    return reg.test(str);
};
// 密码6-25位字符，必须包含大小写字母和数字
export const check_password = (str) => {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,25}$/;
    return reg.test(str);
};
// 资金密码 6位数字
export const check_fundPwd = (str) => {
    let reg = /^\d{6}$/;
    return reg.test(str);
};


export default {
    install(Vue) {　　
        Vue.prototype.getNowFormatDate = function() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
        Vue.prototype.getNewData = function(dateTemp, days) {
            dateTemp = dateTemp.split("-");
            let nDate = new Date(dateTemp[1] + '/' + dateTemp[2] + '/' + dateTemp[0]); //转换为MM-DD-YYYY格式
            let millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
            let rDate = new Date(millSeconds);
            let year = rDate.getFullYear();
            let month = rDate.getMonth() + 1;
            if (month < 10) month = "0" + month;
            let date = rDate.getDate();
            if (date < 10) date = "0" + date;
            return (year + "/" + month + "/" + date);
        };
        //伪装一下表单提交在新窗口
        Vue.prototype.$newWinUrl = function(url) {
            let f = document.createElement("form");
            if (url.indexOf('https://www.elechash.com') == -1) {
                f.setAttribute("target", '_black');
            }
            f.setAttribute("action", url);
            f.setAttribute("method", 'get');
            document.body.appendChild(f)
            f.submit();
        };
        // 数字精度截取处理 小数位后直接舍去
        Vue.prototype.formatNumberFloor = function(number, accuracy) {
            accuracy = Number(accuracy);
            number = Number(number);
            if (!accuracy) return Math.floor(number * 100000000) / 100000000;
            if (accuracy === 0) return Math.floor(number);
            if (!number || number === 0) {
                return 0;
            } else if (number > 0) {
                let m = Math.pow(10, accuracy)
                return (Math.floor(number * m) / m).toFixed(accuracy)
            } else {
                number = Math.abs(number)
                if (number < 0.0000000001) return 0;
                let m = Math.pow(10, accuracy)
                return '-' + Math.floor(number * m) / m
            }
        };

        // 数字精度截取处理 小数位后直接进位
        Vue.prototype.formatNumberCeil = (number, accuracy) => {
            accuracy = Number(accuracy);
            number = Number(number);
            if (!accuracy) return Math.ceil(number * 100000000) / 100000000;
            if (accuracy === 0) return Math.ceil(number);
            if (!number || number === 0) {
                return 0;
            } else {
                number = Math.abs(number)
                if (number < 0.0000000001) return 0;
                let m = Math.pow(10, accuracy)
                return Math.ceil(number * m) / m
            }
        };

        // 数字精度四舍五入处理
        Vue.prototype.formatNumberFixed = function(number, accuracy) {
            number = Number(number);
            if (accuracy !== null) {
                accuracy = parseInt(accuracy);
                return number.toFixed(accuracy);
            } else {
                return number.toFixed(8);
            }
        };
        //输入框输入指定小数位
        Vue.prototype.formatPrecision = function(number, accuracy) {
            let length = 0
            if (Number(accuracy) == 0) {
                length = number.toString().split('.')[0].length + Number(accuracy)
            } else {
                length = number.toString().split('.')[0].length + Number(accuracy) + 1
            }
            let num = number.toString().replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            num = num.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            num = num.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            num = num.toString().substring(0, length) //限制小数位
            return num
        };
      
        //数字不够用零补全
        Vue.prototype.PrefixInteger = function(num, Precision) {
            let precision = Number(Precision)
            if (num.toString().indexOf('.') > 0) { //如果数字含有小数点
                let integer = num.toString().split('.')[0].length
                if (precision == 0) { //如果精度为0，则整数补两个零
                    return (num.toString().split('.')[0] + '.' + Array(3).join('0'))
                } else {
                    return (num + Array(precision).join('0')).slice(0, integer + 1 + precision);
                }
            } else if (num !== '') { //如果数字直接为整数
                let integer = num.toString().length
                if (precision == 0) {
                    return (num + '.' + Array(3).join('0'))
                } else { //如果精度为0，则整数补两个零
                    return (num + '.' + Array(precision + 1).join('0')).slice(0, integer + 1 + precision);
                }
            }
        };

    }
}