
<template>
  <div class="layout">
    <!-- <headers></headers> -->
    <Header></Header>
    <icon></icon>
    <div class="content-bottom">
      <!-- <div class="left"></div>
      <div class="right"></div>-->
      <div class="center">
        <div class="download">
          <h2>{{$t('login.title')}}</h2>
          <h3>{{$t('login.subTitle')}}</h3>
          <downloadVersion></downloadVersion>
        </div>
        <div class="login" v-show="!isPwdLogin">
          <div class="login-toper">
            <div class="login-topl">
              <div class="txt">
                账号密码登录
                <span class="triangle-border">
                  <span class="sequare"></span>
                </span>
              </div>
            </div>
            <div class="login-topr" @click="switchto"></div>
            <div class="l-s">{{$t('login.scanLogin')}}</div>
            <div class="l-app">
              <span class="use">请使用</span>
              <span class="wiki">WikiPay APP</span>
              <span class="l-app-l">扫码登录</span>
            </div>
            <!-- 二维码各种状态 -->
            <div class="code" v-if="qrcodeStatus==1010044">
              <div :class="['code-l', isAinmate ? 'enter':'']">
                <div class="code-le" :style="{backgroundImage:`url(${qrcodeData})`}"></div>
              </div>
              <div :class="['code-r', isAinmate ? 'leave':'']"></div>
            </div>
            <div class="qrcodeStatus1 qrcodeStatus" v-else-if="qrcodeStatus==1010046">
              <!-- <div class="icon"></div> -->
              <img :src="successIcon" alt="" class="success-icon">
              <div class="txt-f">扫描成功</div>
              <div class="txt-s">请在手机端确登录</div>
            </div>
            <div class="qrcodeStatus2 qrcodeStatus" v-else-if="qrcodeStatus==1010045">
              <div class="icon">
                <!-- <span class="icon-uniE90A"></span> -->
                <img :src="failIcon" alt="" class="fail-icon">
              </div>
              <div class="txt-f">二维码已失效</div>
              <div class="txt-s" @click="renovate">点击刷新</div>
            </div>
            <div class="intro">WikiPay APP - 扫一扫登录</div>
          </div>
          <!-- <div class="login-footer">
            <span class="lf-l">还没有手机WikiPay ?</span>
            <span class="lf-r" @click="$router.push('/download')">下载wikipay</span>
          </div>-->
        </div>
        <div class="pwd-login" v-if="isPwdLogin">
          <div class="qrcodeImg" @click="switchto"></div>
          <div class="sweep-login">
            扫一扫登录
            <span class="triangle-border" :style="{left: '91px'}">
              <span class="sequare"></span>
            </span>
          </div>
          <div class="pwd-txt">账号密码登录</div>
          <h4 class="account-txt">账号</h4>
          <div class="account-choose">
            <div class="num">
              <div class="select-dropdown">
                <!-- <div class="select-checked" @click="selectCountry">
                  <img :src="flag" alt class="flag-icon" />
                  {{flagCode}}
                  <img :src="downIcon" alt class="down-icon" />
                </div>
                <div class="dropdown-list" :class="isShow ? 'active': ''">
                  <ul>
                    <li v-for="(item, key) in flagList" :key="key" @click="changeFlagCode(key)">
                      <img :src="item.flag" alt class="flag-icon" />
                      {{item.code}}
                    </li>
                  </ul>
                </div> -->
                <Dropdown
                  :flagList="flagList"
                  :isShow="isShow"
                  :areaFlag="areaFlag"
                  :areaCode="areaCode"
                  @selectCountry="selectCountry"
                  @changeFlagCode="changeFlagCode"
                  @changeList="changeList"
              ></Dropdown>
              </div>
 
            </div>
            <!-- <md-field md-clearable class="tel">
              <md-input v-model="userName" placeholder="输入邮箱/手机号" class="email"></md-input>
            </md-field> -->
            <input type="text" v-model="userName" class="tel" v-on:keyup.enter="login" >
          </div>
          <h4 class="pwd">密码</h4>
          <md-field class="pass" :md-toggle-password="false">
            <md-input placeholder="输入登录密码" v-model="pwd" type="password" class="password" v-on:keyup.enter="login"></md-input>
          </md-field>
          <h4 class="captcha-txt" v-if="isShowCaptcha">验证码</h4>
          <div class="captcha" v-if="isShowCaptcha">
            <input type="text" class="captcha-left" placeholder="输入验证码" v-model="captcha" v-on:keyup.enter="login"/>
            <div class="captcha-right" @click="refreshQrcode" :style="`backgroundImage:url(${captchaImg})`"></div>
          </div>
          <div :class="['login-button', loading ? 'disabled':'']" @click="login">
            <span class="loading" v-if="loading"></span>登录<span v-if="loading">中...</span>
          </div>
          <div class="bottom">
            <!-- <a class="sign">免费注册</a> -->
            <router-link :to="{ path: '/sercert'}" class="forget">忘记密码？</router-link>
          </div>
        </div>
      </div>
    </div>
    <footers></footers>
  </div>
</template>
<script>
import Dropdown from "./components/Dropdown";
import headers from "./components/header/headers";
import Header from "./components/Header";
import icon from "./components/icon/icon";
import downloadVersion from "./components/downloadVersion";
import footers from "./components/footers";
import { fetchCountry } from "../api/request";
import axios from "../api/request";
import { mapMutations } from "vuex";

export default {
  name: "layout",
  data() {
    return {
      isAinmate: false,
      loading: false,
      failIcon: require('../assets/login/fail_icon_20200729.svg'),
      successIcon: require('../assets/login/success_icon_20200729.svg'),
      logo: require("./components/header/images/logo_icon_20200525.png"),
      downIcon: require("../assets/imgs/down_icon_20200525.png"),
      flagIcon: require("../assets/imgs/flag_icon_20200526.png"),
      defaultLang: "简体中文",
      languageList: [
        {
          id: 1,
          lang: "简体中文",
          flag: require("../assets/imgs/flag_icon_20200526.png")
        },
        {
          id: 2,
          lang: "繁体中文",
          flag: require("../assets/imgs/flag_icon_20200526.png")
        },
        {
          id: 3,
          lang: "英语",
          flag: require("../assets/imgs/flag_icon_20200526.png")
        }
      ],
      isShow: false,
      bg: "",
      isPwdLogin: false,
      isShowCaptcha: false,
      userName: "",
      pwd: "",
      flagList: [], //国旗列表
      areaFlag: "https://img.wikifx.com/flag/7d8833382673bab2/CN.png_wiki-template-global", // 国家国旗
      areaCode: "0086", // 国家区号（默认）
      isShow: false, // 是否显示
      lgToken: "",
      qrcodeData: "", //二维码图形
      captchaId: "", //验证码序列号
      captcha: "", //验证码
      captchaImg: "",
      qrcodeStatus: 0,
      timer: null
    };
  },
  components: {
    headers,
    Header,
    icon,
    footers,
    downloadVersion,
    Dropdown
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
    this.getFlags();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    getSelectVal(val) {
      this.defaultLang = val;
    },
    // 刷新验证码
    async refreshQrcode() {
      const res = await axios.getVertifyId({});
      if(res.code === 0) {
        const { captchaId } = res.data;
        this.captchaId = captchaId;
        this.captchaImg = this.$getCaptcha(captchaId);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // selectCountry() {
    //   let show = this.isShow;
    //   if (show) {
    //     this.isShow = false;
    //   } else {
    //     this.isShow = true;
    //   }
    // },
    // changeFlagCode(key) {
    //   this.flagCode = this.flagList[key].code;
    //   this.flag = this.flagList[key].flag;
    //   this.isShow = false;
    // },
    // 选择地点
    selectCountry(show) {
      if (show) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
     // 国家区号代码选择
    changeFlagCode(code, flag, show) {
      this.areaFlag = flag;
      this.areaCode = code;
      this.isShow = !show;
    },
    changeList(list) {
      this.flagList = list;
    },
    switchto() {
      if (this.isPwdLogin == true) {
        if (this.flagList.length == 0) {
          this.getFlags();
        }
      }
      return (this.isPwdLogin = !this.isPwdLogin);
    },

    // 检测二维码状态
    scanQrcode() {
      if (this.lgToken.length > 0) {
        this.$scanQrcode(this.lgToken, res => {
          if (res.code == 1010045 || res.code == 0) {
            clearInterval(this.timer);
            if (res.code == 0) {
              this.changeLogin({ Authorization: res.data.token });
              this.$router.push("/console/asset");
            }
          }
          this.qrcodeStatus = res.code;
        });
      }
    },
    // 获取二维码信息
    getQrcode() {
      this.$getQrcode("", res => {
        if (res.code == 0) {
          this.qrcodeData = res.data.data;
          this.lgToken = res.data.lgToken;
        } else {
          this.$Message.error(res.msg);
        }
      });
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
    //获取国旗
    async getFlags() {
      try {
        let flag = await fetchCountry();
        this.flagList = flag;
      } catch (error) {
        this.$Message.error(error);
      }
    },
    // 账号密码登录业务逻辑
    login() {
      let newPwd = this.pwd.trim();
      if (this.userName == "") {
        this.$Message.error("请输入用户名");
        return;
      }
      if (this.pwd == "") {
        this.$Message.error("请输入密码");
        return;
      }
      if (6 > newPwd.length || newPwd.length > 16) {
        return this.$Message.error("请输入长度为6-16的密码！");
      }
      let params = {
        areaCode: this.areaCode,
        userName: this.userName,
        pwd: this.pwd
      };
      if (this.isShowCaptcha == true && this.captcha.length > 0) {
        params.id = this.captchaId;
        params.digits = this.captcha;
      }
      this.loading = true;
      this.$phoneLogin(params, res => {
        this.loading = false;
        if (res.code == 0) {
          this.isShowCaptcha = false;
          this.changeLogin({ Authorization: res.data.token });
          this.$router.push("/console");
        } else if (res.code == 1010008 || res.code == 1010049) {
          this.$Message.error(res.msg);
          this.isShowCaptcha = true;

          this.$getCaptchaid("", res => {
            if (res.data.captchaId.length > 0) {
              let param = {
                id: res.data.captchaId
              };
              this.captchaId = res.data.captchaId;
              this.captchaImg = this.$getCaptcha(this.captchaId);
            }
          });
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
@import url("../style/comm.css");

.layout {
  width: 100%;
  height: 100%;
  background-image: url("../assets/imgs/Group3.png");
  background-size: cover;
  position: relative;
  overflow: hidden;
}
.fail-icon, .success-icon {
  display: block;
  width: 41px;
  height: 41px;
  margin: 33px auto 16px;
}
.content-bottom {
  margin: 0 auto;
  .center {
    width: 1200px;
    margin: 0 auto;

    .download {
      width: 512px;
      margin-top: 48px;
      float: left;

      h2 {
        height: 64px;
        font-size: 32px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 64px;
        // margin-top: 48px;
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

    .login {
      position: relative;
      overflow: hidden;
      float: right;
      width: 400px;
      height: 388px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      position: relative;
      margin-top: 48px;

      .login-toper {
        height: 385px;

        .login-topl {
          width: 104px;
          height: 28px;
          background: rgba(248, 251, 255, 1);
          border: 1px solid rgba(54, 116, 215, 0.3);
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: rgba(54, 116, 215, 1);
          line-height: 28px;
          text-align: center;
          margin: 12px 89px 0 207px;

          .txt {
            .triangle-border {
              display: block;
              width: 0;
              height: 0;
              left: 102px;
              top: -22px;
              position: relative;
              border-width: 7px 0 7px 7px;
              border-style: solid;
              border-color: transparent transparent transparent
                rgba(54, 116, 215, 0.3);

              .sequare {
                display: block;
                position: absolute;
                right: 2px;
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
          width: 126px;
          height: 24px;
          font-size: 21px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          line-height: 21px;
          margin: 0 0 22px 48px;
        }

        .l-app {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          height: 21px;
        }

        .use {
          margin-left: 48px;
          color: rgba(51, 51, 51, 1);
          margin-right: 3px;
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
            width: 64px;
            height: 15px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: rgba(54, 116, 215, 1);
            line-height: 14px;
            margin: 0 47px;
            text-align: center;
            cursor: pointer;
          }

          // .icon {
          //   background: rgba(255, 104, 89, 1);
          // }
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
          }
          .leave {
             animation: fadeOut 2s linear;
             animation-fill-mode: forwards;
          }
          @keyframes fadeOut {
            from{
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
          margin-top: 31px;
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
    }

    .pwd-login {
      position: relative;
      float: right;
      width: 400px;
      padding-bottom: 25px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 67px 0px rgba(0, 0, 0, 0.2);
      position: relative;
      border-radius: 8px;
      margin-top: 48px;
      overflow: hidden;
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
        width: 93px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: rgba(248, 251, 255, 1);
        border: 1px solid rgba(54, 116, 215, 0.3);
        top: 12px;
        right: 95px;
        position: absolute;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(54, 116, 215, 1);

        :after {
        }
      }

      .pwd-txt {
        width: 126px;
        height: 21px;
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 21px;
        margin: 40px 0 0 48px;
      }

      .account-txt {
        width: 105px;
        height: 17px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        line-height: 15px;
        margin: 45px 0 0 177px;
      }

      .account-choose {
        margin-left: 47px;
        position: relative;

        .num {
          display: inline-block;
          height: 16px;
          margin-top: 11px;
          margin-right: 5px;

          .select-dropdown {
            position: relative;
            
            .flag-icon {
              width: 30px;
              height: 20px;
            }

            .down-icon {
              width: 8px;
              height: 4px;
            }

            .select-checked {
              width: 120px;
              font-size: 14px;
              color: #333;
              border-radius: 4px;
              padding: 8px 0;
              cursor: pointer;
              text-align: center;
            }

            .dropdown-list {
              width: 100%;
              height: 212px;
              position: absolute;
              top: 42px;
              left: 0;
              background: #fff;
              box-shadow: 0px 5px 10px 0px rgba(162, 177, 202, 0.5);
              border: solid 1px #ebedf0;
              border-radius: 5px;
              transform-origin: center top;
              transform: translateY(0);
              transition: all 0.3s ease-out;
              visibility: hidden;
              opacity: 0;
              z-index: 1;
              overflow: auto;

              ul {
                list-style: none;

                li {
                  padding: 10px 0;
                  cursor: pointer;
                  text-align: left;
                  padding-left: 19px;
                  transition: all 0.2s ease-out;

                  &:hover {
                    background: #fafafa;
                    color: #3674d7;
                  }

                  &:first-child {
                    border-radius: 5px;
                  }

                  &:last-child {
                    border-radius: 5px;
                  }
                }

                .active {
                  background: #fafafa;
                }
              }
            }

            .active {
              visibility: visible;
              transform: translateY(10px);
              opacity: 1;
            }
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
          // position: absolute;
          // left: 118px;
          // top: -6px;
          // display: inline-block;
          // width: 205px;
          // font-size: 16px;
          // font-family: MicrosoftYaHei;
          // color: rgba(204, 204, 204, 1);
          // margin-left: 11px;

          // .email {
          //   width: 177px;
          //   padding: 17px 0;
          //   border-bottom: 1px solid rgba(204, 204, 204, 0.3);
          //   transition: all 0.2s linear;

          //   &:focus {
          //     border-bottom: 1px solid #3674d7;
          //   }
          // }
          transition: all .2s ease;
          margin-left: 12px;
          width: 190px;
          padding: 8px 10px 8px 0;
          border:none;
          border-bottom: 1px solid rgba(204, 204, 204, 0.3);
          &:focus {
            border: none;
            border-bottom: 1px solid rgba(54, 116, 215, 1);
          }
        }
      }

      .pwd {
        margin-top: 40px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        padding-left: 48px;
      }

      .pass {
        width: 304px;
        height: 28px;
        border: none;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: rgba(204, 204, 204, 1);
        line-height: 21px;
        margin-left: 48px;

        .password {
          padding: 17px 0;
          border-bottom: 1px solid rgba(204, 204, 204, 0.3);
          transition: all 0.2s linear;

          &:focus {
            border-bottom: 1px solid #3674d7;
          }
        }
      }

      .captcha-txt {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        margin-left: 48px;
        margin-top: 45px;
      }

      .captcha {
        height: 33px;
        margin-top: 16px;
        margin-left: 48px;

        .captcha-left {
          outline: none;
          margin-top: 5px;
          float: left;
          width: 203px;
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
        }

        .captcha-right {
          cursor: pointer;
          float: right;
          margin-right: 49px;
          margin-top: 5px;
          width: 83px;
          height: 33px;
          background-size: 100%;
          background-position: center;
        }
      }

      .login-button {
        width: 304px;
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
        padding: 10px 50px;
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
</style>