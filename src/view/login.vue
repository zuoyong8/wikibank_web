
<template>
  <div class="layout">
    <Header></Header>
    <div class="content">
      <div class="company-info">
        <div class="download">
          <h2>{{$t('login.title')}}</h2>
          <h3>{{$t('login.desc')}}</h3>
          <DownloadVersion></DownloadVersion>
        </div>
      </div>
      <div class="login-box" :style="{height: loginHeight + 'px'}">
        <div class="login" v-show="!isPwdLogin" ref="scannLogin">
          <div class="login-toper">
            <div class="login-topl">
              {{$t('login.accountLogin')}}
              <span class="triangle-border">
                <span class="sequare"></span>
              </span>
            </div>
            <div class="login-topr" @click="switchto"></div>
            <div class="l-s">{{$t('login.scannLogin')}}</div>
            <div class="l-app">
              <!-- <span class='use'>{{$t('login.pleaseUse')}}</span> 
              <span class='wiki'>WikiPay APP</span> 
              <span class='l-app-l'>{{$t('login.scann')}}</span>-->
              <span class="use">{{$t("login.loginTips")}}</span>
            </div>

            <div class="status-box">
              <div class="loading-box">
                <span class="loading qrcode-loading" v-if="loading"></span>
                <div
                  class="scann-status"
                  v-else-if="qrcodeStatus !== 1010046 && qrcodeStatus !== 1010045"
                >
                  <div class="qrcode-img">
                    <img :src="qrcodeData" alt class="qrcode" />
                  </div>
                  <div class="scann-img">
                    <img :src="scannIcon" alt class="sweep" />
                  </div>
                </div>
                <div class="success-status" v-else-if="qrcodeStatus === 1010046">
                  <img :src="successIcon" alt class="success-icon" />
                  <div class="success-tips">{{$t('login.scannSuccess')}}</div>
                  <div class="scann-tips">{{$t('login.confirmLogin')}}</div>
                </div>
                <div class="expire-status" v-else-if="qrcodeStatus === 1010045">
                  <div class="icon">
                    <img :src="failIcon" alt class="fail-icon" />
                  </div>
                  <div class="expire-tips">{{$t('login.scannExpire')}}</div>
                  <div class="refresh" @click="renovate">{{$t('login.refreshQrcode')}}</div>
                </div>
              </div>
            </div>

            <div class="intro">{{$t('login.scannTips')}}</div>
          </div>
        </div>
        <div class="pwd-login" v-show="isPwdLogin" ref="accountLogin">
          <div class="qrcode-box">
            <div class="qrcodeImg" @click="switchto"></div>
          </div>
          <div class="sweep-login">
            {{$t('login.scannLogin')}}
            <span class="triangle-border">
              <span class="sequare"></span>
            </span>
          </div>
          <div class="pwd-txt">{{$t('login.accountLogin')}}</div>
          <h4 class="account-txt">{{$t('login.account')}}</h4>
          <div class="account-choose">
            <div class="num">
              <div class="select-dropdown">
                <Dropdown
                  :isShow="isShow"
                  :valWidth="valWidth"
                  :width="dropdownWidth"
                  @selectCountry="selectCountry"
                  @changeFlagCode="changeFlagCode"
                ></Dropdown>
              </div>
            </div>
            <input
              type="text"
              :placeholder="$t('customError.accountTips')"
              v-model="userName"
              class="tel"
              v-on:keyup.enter="login"
            />
          </div>
          <h4 class="pwd">{{$t('login.password')}}</h4>
          <div class="pass">
            <input
              type="password"
              :placeholder="$t('placehode.loginPwd')"
              v-model="pwd"
              class="password"
              v-on:keyup.enter="login"
            />
          </div>
          <h4 class="captcha-txt" v-if="isShowCaptcha">{{$t('login.vertifyCode')}}</h4>
          <div class="captcha" v-if="isShowCaptcha">
            <input
              type="text"
              class="captcha-left"
              :placeholder="$t('placehode.vertifyCode')"
              v-model="captcha"
              v-on:keyup.enter="login"
            />
            <div
              class="captcha-right"
              @click="refreshQrcode"
              :style="`backgroundImage:url(${captchaImg})`"
            ></div>
          </div>
          <div :class="['login-button', loading ? 'disabled':'']" @click="login">
            <span class="loading" v-if="loading"></span>
            <span>{{$t('login.login')}}</span>
            <span v-if="loading">...</span>
          </div>
          <div class="bottom">
            <router-link :to="{ path: '/sercert'}" class="forget">{{$t('login.forgetPassword')}}</router-link>
          </div>
        </div>
      </div>
    </div>

    <footers></footers>
  </div>
</template>
<script>
import Dropdown from "./components/Dropdown";
import Header from "./components/Header";
import DownloadVersion from "./components/DownloadVersion";
import footers from "./components/footers";
import { fetchCountry } from "../api/request";
import axios from "../api/request";
import { mapMutations, mapState } from "vuex";
export default {
  name: "layout",
  data() {
    return {
      loginHeight: 388,
      scannIcon: require("../assets/imgs/sweep.png"),
      isAinmate: false,
      loading: true,
      failIcon: require("../assets/login/fail_icon_20200729.svg"),
      successIcon: require("../assets/login/success_icon_20200729.svg"),
      logo: require("./components/header/images/logo_icon_20200525.png"),
      bg: "",
      isPwdLogin: false,
      isShowCaptcha: false,
      userName: "",
      pwd: "",
      //areaCode: "0086", // 国家区号（默认）
      isShow: false, // 是否显示
      lgToken: "",
      qrcodeData: "", // 二维码图形
      captchaId: "", // 验证码序列号
      captcha: "", // 验证码
      captchaImg: "",
      qrcodeStatus: 0,
      timer: null,
      valWidth:88,
      dropdownWidth: 316
    };
  },
  components: {
    Header,
    footers,
    DownloadVersion,
    Dropdown,
  },
  mounted() {
    this.getQrcode();
    // 监测二维码
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.scanQrcode();
      }, 2000);
    }
  },
  computed: {
    ...mapState(["areaCode", "flagList"])
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapMutations(["changeLogin", "getFlags", "changeAreaName", "changeNav"]),

    // 刷新验证码
    async refreshQrcode() {
      this.qrcodeStatus = 0;
      const res = await axios.getVertifyId({});
      if (res.code === 0) {
        const { captchaId } = res.data;
        this.captchaId = captchaId;
        this.captchaImg = axios.getVertifyImg(captchaId);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 选择地点
    selectCountry(show) {
      if (show) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    // 国家区号代码选择
    changeFlagCode(show) {
      this.isShow = !show;
    },
    switchto() {
      this.loading = false;
      this.isPwdLogin = !this.isPwdLogin;
      if (this.isPwdLogin == true) {
        this.loginHeight = 427;
        this.isShowCaptcha = false;
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (this.flagList.length == 0) {
          this.getFlags();
        }
      } else {
        this.loginHeight = 388;
        this.renovate();
      }
    },

    // 检测二维码状态
    async scanQrcode() {
      if (this.lgToken.length > 0) {
        const params = this.lgToken;
        const res = await axios.checkQrcode(params);
        if (res.code == 0) {
          clearInterval(this.timer);
          this.changeLogin({ Authorization: res.data.token });
          this.$router.push("/console/asset");
        } else if(res.code === 1010045) { // 过期
          clearInterval(this.timer);
          this.qrcodeStatus = res.code;
        } else if(res.code === 1010046) { // 扫描成功
          this.qrcodeStatus = res.code;
        } 
        else if (res.code === 1010083) {
          clearInterval(this.timer);
          this.$Message.error(res.msg);
          this.qrcodeStatus = res.code;
        } else {
          this.qrcodeStatus = res.code;
        }
        
      }
    },
    // 获取二维码信息
    async getQrcode() {
      this.loading = true;
      const res = await axios.getQrcode({});
      this.loading = false;
      if (res.code == 0) {
        let { data, lgToken } = res.data;
        this.qrcodeData = data;
        this.lgToken = lgToken;
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 点击刷新二维码
    renovate() {
      this.qrcodeStatus = "1010044";
      this.getQrcode();
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(this.scanQrcode, 2000);
    },
    // 账号密码登录业务逻辑
    async login() {
      let newPwd = this.pwd.trim();
      if (this.userName == "") {
        this.$Message.error(this.$t("customError.accountTips"));
        return;
      }
      if (this.pwd == "") {
        this.$Message.error(this.$t("customError.pwdTips"));
        return;
      }
      if (6 > newPwd.length || newPwd.length > 16) {
        return this.$Message.error(this.$t("customError.pwdLength"));
      }
      let params = {
        areaCode: this.areaCode,
        userName: this.userName,
        pwd: this.pwd,
      };
      if (this.isShowCaptcha == true && this.captcha.length > 0) {
        params.id = this.captchaId;
        params.digits = this.captcha;
      }
      this.loading = true;
      const res = await axios.login(params);
      this.loading = false;
      if (res.code == 0) {
        this.changeLogin({ Authorization: res.data.token });
        this.$router.push("/console/asset");
      } else if (res.code == 1010008 || res.code == 1010049) {
        this.$Message.error(res.msg);
        this.isShowCaptcha = true;
        this.loginHeight = 541;
        const result = await axios.getVertifyId();
        if (result.data.captchaId.length > 0) {
          this.captchaId = result.data.captchaId;
          this.captchaImg = axios.getVertifyImg(this.captchaId);
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
  },
};
</script>
<style scoped lang='scss'>
@import url("../style/comm.css");

.layout {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/imgs/Group3.png");
  background-size: cover;
  position: relative;
  overflow: hidden;
}
.fail-icon,
.success-icon {
  display: block;
  width: 41px;
  height: 41px;
  margin: 33px auto 16px;
}
.content {
  width: 1200px;
  height: calc(100vh - 100px);
  min-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .company-info {
    .download {
      h2 {
        font-size: 32px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
      }
      h3 {
        height: 92px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        line-height: 33px;
        margin-top: 32px;
      }
    }
  }
  .login-box {
    position: relative;
    transition: all 0.2s linear;
    background: #fff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    // overflow: hidden;
    .login {
      position: relative;
      width: 400px;
      height: 388px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      overflow: hidden;
      .login-toper {
        .login-topl {
          position: absolute;
          padding: 3px 16px;
          display: inline-block;
          right: 100px;
          top: 0;
          width: auto;
          background: rgba(248, 251, 255, 1);
          border: 1px solid rgba(54, 116, 215, 0.3);
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: rgba(54, 116, 215, 1);
          text-align: center;
          margin: 10px 0 0 0;

          .txt {
            .triangle-border {
              display: block;
              width: 0;
              height: 0;
              right: -11px;
              top: -22px;
              position: absolute;
              border-width: 7px 0 7px 7px;
              border-style: solid;
              border-color: transparent transparent transparent
                rgba(54, 116, 215, 0.3);

              .sequare {
                display: block;
                position: absolute;
                right: -11px;
                top: -5px;
                width: 0;
                height: 0;
                border-width: 5px 0 5px 5px;
                border-style: solid;
                border-color: transparent transparent transparent #f8fbff;
              }
            }
          }
        }

        .login-topr {
          width: 103px;
          height: 111px;
          position: absolute;
          background-image: url("../assets/imgs/pc-1.png");
          top: 0;
          right: 0;
          transition: all 0.2s ease;
          transform: scale(1);
          cursor: pointer;
          &:hover {
            transform: scale(1.08);
          }
        }

        .l-s {
          height: 24px;
          font-size: 21px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          line-height: 21px;
          margin: 40px 0 22px 42px;
        }

        .l-app {
          margin: 0 42px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          line-height: 20px;
          // height: 21px;
        }

        .use {
          // margin-left: 48px;
          color: rgba(51, 51, 51, 1);
        }

        .wiki {
          color: rgba(43, 178, 255, 1);
          margin-right: 6px;
        }

        .l-app-l {
          color: rgba(51, 51, 51, 1);
        }

        .qrcodeStatus {
          width: 157px;
          height: 157px;
          border: 1px solid rgba(238, 238, 238, 1);
          margin: 40px 121px 23px 121px;

          .icon {
            width: 41px;
            height: 41px;
            border-radius: 50%;
            margin: 33px 58px 16px 58px;
            text-align: center;
            line-height: 41px;
          }
        }

        .qrcodeStatus1 {
          .txt-f {
            width: 64px;
            height: 15px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: rgba(34, 34, 34, 1);
            line-height: 14px;
            margin: 0 46px;
          }

          .txt-s {
            width: 113px;
            height: 16px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: rgba(68, 68, 68, 1);
            line-height: 12px;
            margin: 0 22px;
            text-align: center;
            cursor: pointer;
          }

          .icon {
            background: rgba(54, 116, 215, 1);
          }
        }

        .qrcodeStatus2 {
          .txt-f {
            width: 113px;
            height: 15px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: rgba(68, 68, 68, 1);
            line-height: 12px;
            margin: 17px 22px 5px 22px;
            text-align: center;
          }

          .txt-s {
            padding: 0 16px;
            // width: 64px;
            height: 15px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: rgba(54, 116, 215, 1);
            line-height: 14px;
            // margin: 0 47px;
            text-align: center;
            cursor: pointer;
          }
        }

        .code {
          height: 157px;
          margin: 40px 48px 0;
          display: flex;
          justify-content: center;
          .code-l {
            width: 157px;
            height: 157px;
            border: 1px solid rgba(238, 238, 238, 1);
            margin-right: 10px;

            .code-le {
              width: 141px;
              height: 141px;
              margin: 8px;
              background-position: center;
              background-size: 120%;
            }
          }
          .enter {
            animation: moveRight 2s ease 2s;
            animation-fill-mode: forwards;
          }
          @keyframes moveRight {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 1;
              transform: translateX(50%);
              display: none;
            }
          }
          .code-r {
            width: 142px;
            height: 154px;
            background-image: url("../assets/imgs/sweep.png");
            background-size: cover;
          }
          .leave {
            animation: fadeOut 2s linear;
            animation-fill-mode: forwards;
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
              display: none;
            }
          }
        }

        .intro {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(153, 153, 153, 1);
          height: 16px;
          margin-top: 23px;
          text-align: center;
        }
      }

      .login-footer {
        height: 64px;
        width: 400px;
        background: rgba(243, 248, 255, 1);
        line-height: 64px;
        font-size: 15px;
        font-family: MicrosoftYaHei;
        text-align: center;
        border-left: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;

        .lf-l {
          color: rgba(102, 102, 102, 1);
        }

        .lf-r {
          color: rgba(54, 116, 215, 1);
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
      .status-box {
        text-align: center;
        margin: 40px 0 24px;
        .qrcode-img {
          display: inline-block;
          width: 157px;
          height: 157px;
          border: 1px solid #eee;
          margin-right: 10px;
          background: rgba(0, 0, 0, 0.3);
          .qrcode {
            width: 100%;
            height: 100%;
          }
        }

        .scann-img {
          display: inline-block;
          border-bottom-left-radius: 11px;
          border-bottom-right-radius: 11px;
          border: 3px solid rgba(54, 116, 215, 0.14);
          border-top: none;
          .sweep {
            width: 142px;
            height: 154px;
          }
        }
        .loading-box {
          display: inline-block;
          width: 315px;
          height: 157px;
          .qrcode-loading {
            width: 35px;
            height: 35px;
            margin-right: 0;
            margin-top: 58px;
            border-width: 2px;
            border-left-color: #3674d7;
          }
        }
        .scann-status {
          display: inline-flex;
          text-align: center;
        }
        .success-status,
        .expire-status {
          display: inline-block;
          border: 1px solid #eee;
          padding: 0 40px;
          letter-spacing: 0;
          animation: moveRight 0.5s ease-out;
          .success-tips {
            font-size: 14px;
            color: #222;
            margin-bottom: 8px;
            font-family: Helvetica;
          }
          .scann-tips {
            font-size: 12px;
            color: #555;
            margin-bottom: 28px;
            font-family: Helvetica;
          }
          .expire-tips {
            font-size: 12px;
            font-family: Helvetica;
            color: rgba(68, 68, 68, 1);
            margin-bottom: 4px;
          }
          .refresh {
            color: #3674d7;
            font-size: 14px;
            font-family: Helvetica;
            cursor: pointer;
            margin: 0 14px 30px;
          }
        }
      }
    }

    .pwd-login {
      width: 400px;
      padding-bottom: 25px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      .qrcode-box {
        position: relative;
        height: 111px;
        right: 0;
        overflow: hidden;
        border-radius: 8px;
      }
      .qrcodeImg {
        width: 103px;
        height: 111px;
        background-image: url("../assets/imgs/qrcodeImg.png");
        position: absolute;
        top: 0;
        right: 0;
        transition: all 0.2s ease;
        transform: scale(1);
        cursor: pointer;
        &:hover {
          transform: scale(1.08);
        }
      }

      .sweep-login {
        display: inline-block;
        padding: 2px 16px;
        width: auto;
        background: rgba(248, 251, 255, 1);
        border: 1px solid rgba(54, 116, 215, 0.3);
        top: 12px;
        right: 95px;
        position: absolute;
        font-size: 12px;
        color: rgba(54, 116, 215, 1);
      }

      .pwd-txt {
        height: 21px;
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 21px;
        margin: -71px 85px 0 42px;
      }

      .account-txt {
        width: 105px;
        height: 17px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        line-height: 15px;
        margin: 45px 0 0 147px;
      }

      .account-choose {
        margin-left: 42px;
        position: relative;

        .num {
          display: inline-block;
          height: 16px;
          margin-top: 11px;

          .select-dropdown {
            position: relative;
          }

          .num-left {
            a {
              display: block;

              .country {
                background-size: 100%;
                width: 20px;
                height: 13px;
                float: left;
                margin-top: 1px;
                margin-bottom: 2px;
              }

              .number {
                font-size: 16px;
                font-family: RobotoCondensed-Regular, RobotoCondensed;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                float: left;
                margin: 0px 8px 0 3px;
              }

              .icon {
                width: 8px;
                height: 4px;
                float: left;
                background-image: url("../assets/imgs/route2.png");
                background-size: 100%;
                margin: 6px 0;
              }
            }

            .list {
              height: 16px;

              .country {
                width: 20px;
                height: 13px;
                float: left;
              }

              .txt {
                width: 32px;
                height: 16px;
                float: left;
                font-size: 16px;
                font-family: RobotoCondensed-Regular, RobotoCondensed;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 16px;
                position: static;
              }
            }
          }
        }

        .tel {
          transition: all 0.2s ease;
          margin-left: 16px;
          width: 211px;
          padding: 8px 10px 8px 0;
          font-size: 16px;
          border: none;
          border-bottom: 1px solid rgba(204, 204, 204, 0.3);
          &:focus {
            border: none;
            border-bottom: 1px solid rgba(54, 116, 215, 1);
          }
          &::placeholder {
            color: #ccc;
          }
        }
      }

      .pwd {
        margin-top: 40px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        padding-left: 42px;
      }

      .pass {
        width: 316px;
        height: 28px;
        border: none;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: rgba(204, 204, 204, 1);
        line-height: 21px;
        margin-left: 42px;
        margin-top: 11px;
        .password {
          width: 100%;
          padding: 8px 10px 8px 0;
          font-size: 16px;
          border: none;
          border-bottom: 1px solid rgba(204, 204, 204, 0.3);
          transition: all 0.2s linear;
          &:focus {
            border-bottom: 1px solid #3674d7;
          }
          &::placeholder {
            color: #ccc;
          }
        }
      }

      .captcha-txt {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        margin-left: 42px;
        margin-top: 45px;
      }

      .captcha {
        height: 33px;
        margin-top: 16px;
        margin-left: 42px;

        .captcha-left {
          outline: none;
          margin-top: 5px;
          float: left;
          width: 216px;
          height: 28px;
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: rgba(204, 204, 204, 1);
          line-height: 21px;
          padding: 17px 0;
          color: #333;
          border: none;
          border-bottom: 1px solid rgba(204, 204, 204, 0.3);
          transition: all 0.2s linear;

          &:focus {
            border: none;
            border-bottom: 1px solid #3674d7;
          }
          &::placeholder {
            color: #ccc;
          }
        }

        .captcha-right {
          cursor: pointer;
          float: right;
          margin-right: 45px;
          margin-top: 5px;
          width: 83px;
          height: 33px;
          background-size: 100%;
          background-position: center;
        }
      }

      .login-button {
        width: 316px;
        color: #fff;
        font-size: 16px;
        padding: 14px 0;
        background: rgba(54, 116, 215, 1);
        border-radius: 4px;
        opacity: 1;
        margin: 45px auto 0;
        cursor: pointer;
        text-align: center;
        .loading {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid #fff;
          border-left-color: transparent;
          border-bottom-color: transparent;
          border-radius: 50%;
          animation: move 1s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes move {
          form {
            transform: rotate(0);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }

      .bottom {
        width: 100%;
        padding: 10px 36px;
        text-align: right;

        .sign,
        .forget {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(54, 116, 215, 1);
          cursor: pointer;
        }
      }
    }
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes moveRight {
  from {
    transform: translateX(-50px);
  }
  to {
    transform: translateX(0px);
  }
}
</style>