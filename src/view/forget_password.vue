<template>
  <div class="wrap">
    <div class="header">
      <div class="content">
        <router-link :to="{path: '/'}">
          <img :src="logo" alt class="logo" />
        </router-link>
        <div class="right">
          <router-link :to="{path: '/'}" class="site-text">WikiPay 首页</router-link>
          <div class="divide">|</div>
          <div class="language-tips">
            <div class="select-widget">
              <div class="select-val">
                <img :src="flagIcon" alt class="flag-icon" />
                <span class="language">{{defaultLang}}</span>
                <!-- <img :src="downIcon" alt class="" /> -->
                <span class="down-icon"></span>
              </div>
              <div class="select-triangle"></div>
              <div class="select-list">
                <div
                  class="select-language-item"
                  v-for="item in languageList"
                  :key="item.id"
                  @click="getSelectVal(item.lang)"
                >
                  <img :src="item.flag" alt class="flag-icon" />
                  <span class="lang-text">{{item.lang}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="forget-pwd">
      <div class="title">忘记登录密码</div>
      <div class="desc"><img :src="tipsIcon" alt="" class="tips-icon"> <span class="tips-text">为了您的资产安全，找回登录密码后24小时内禁止提币、转账、支付</span> </div>
      <div class="apply-step">
        <div class="step">
          <div v-if="stepNum > 0">
            <img :src="successIcon" alt class="step-img" />
          </div>
          <div v-else>
            <span class="step-img phone-icon" :class="stepNum == 0 ? 'icon-active':''"></span>
          </div>
          <div class="step-text" :class="stepNum == 0 ? 'active':''">手机验证</div>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div v-if="stepNum > 1">
            <img :src="successIcon" alt class="step-img" />
          </div>
          <div v-else>
            <span class="step-img password-icon" :class="stepNum == 1 ? 'icon-active':''"></span>
          </div>
          <div class="step-text" :class="stepNum == 1 ? 'active':''">重设密码</div>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div v-if="stepNum > 2">
            <img :src="successIcon" alt class="step-img" />
          </div>
          <div v-else>
            <span class="step-img complete-icon" :class="stepNum == 2 ? 'icon-active':''"></span>
          </div>
          <div class="step-text" :class="stepNum == 2 ? 'active':''">完成</div>
        </div>
      </div>
      <div class="phone-vertify">
        <div v-if="stepNum === 0">
          <div class="row-box">
            <div class="label-text">手机号</div>
            <div class="input-box">
              <Dropdown
                :flagList="flagList"
                :isShow="isShow"
                :areaFlag="areaFlag"
                :areaCode="areaCode"
                @selectCountry="selectCountry"
                @changeFlagCode="changeFlagCode"
                @changeList="changeList"
              ></Dropdown>
              <input type="text" placeholder="输入手机号" class="input-style" v-model="phone" :style="{marginLeft:'6px'}"/>
            </div>
          </div>
          <div class="row-box vertify-code">
            <div class="label-text">验证码</div>
            <div class="input-box">
              <input type="text" placeholder="输入短信验证码" class="input-style" v-model="vertifyCode" />
              <a
                href="jvascript:;"
                class="send-code"
                :class="isCalc ? 'disabled':'' "
                @click="sendVertifyCode"
              >{{countText}}</a>
            </div>
          </div>
          <div class="next-box">
            <a href="javascript:;" class="next-step" @click="nextStep">下一步</a>
            <div>
              <router-link :to="{path: '/'}" class="go-login">登录</router-link>
            </div>
          </div>
        </div>

        <div v-else-if="stepNum === 1">
          <div class="row-box vertify-code">
            <div class="label-text">新密码</div>
            <div class="input-box">
              <input
                type="password"
                placeholder="输入6-16位新密码"
                class="input-style new-password"
                v-model="newPassword"
              />
            </div>
          </div>
          <div class="row-box vertify-code">
            <div class="label-text">确认新密码</div>
            <div class="input-box">
              <input
                type="password"
                placeholder="再次输入6-16位新密码"
                class="input-style new-password"
                v-model="confirmPassword"
              />
            </div>
          </div>
          <div class="next-box">
            <a href="javascript:;" class="next-step" @click="findLoginPwd">下一步</a>
            <div>
              <router-link :to="{path: '/'}" class="go-login">登录</router-link>
            </div>
          </div>
        </div>

        <div class="set-success" v-else>
          <img :src="successIcon" alt class="success-icon" />
          <div>恭喜您，成功找回密码</div>
          <router-link :to="{path:'/'}" class="again-login">重新登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "./components/Dropdown";
import { fetchCountry } from "../api/request";
import axios from "../api/request";
import { mapGetters } from "vuex";
export default {
  components: {
    Dropdown
  },
  data() {
    return {
      tipsIcon: require("../assets/login/tips_icon_20200730.png"),
      logo: require("./components/header/images/logo_icon_20200525.png"),
      phoneVertifyIcon: require("../assets/login/phone_20200622.svg"),
      setPasswordIcon: require("../assets/login/password_20200622.svg"),
      completeIcon: require("../assets/login/complete_20200622.svg"),
      successIcon: require("../assets/login/success_20200622.svg"),
      stepNum: 0,
      flagList: [], // 
      areaFlag: "https://img.wikifx.com/flag/7d8833382673bab2/CN.png_wiki-template-global", // 国家国旗
      areaCode: "0086", // 国家区号（默认）
      isShow: false, // 是否显示
      phone: "", // 手机号
      vertifyCode: "", // 手机验证码
      newPassword: "", // 新密码
      confirmPassword: "", // 确认密码
      count: 0,
      countText: "发送验证码",
      isCalc: false, // 正在倒计时
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
      ]
    };
  },
  computed: {
    ...mapGetters(["getLanguage"])
  },
  methods: {
    getSelectVal(val) {
      this.defaultLang = val;
    },
    // 下一步
    nextStep() {
      const tel = this.phone.trim();
      const code = this.vertifyCode.trim();

      if (!tel || !code) {
        return this.$Message.error("请输入手机号和验证码！");
      }
      if (!/^1[\d]{10}$/.test(this.phone)) {
        return this.$Message.error("请输入正确的手机号！");
      }
      if (!/^[\d]{4}$/.test(code)) {
        return this.$Message.error("请输入正确的验证码！");
      }
      this.stepNum++;
    },
    getFlags() {
      const res = fetchCountry();

      this.flagList = res;
    },
    selectCountry(show) {
      if (show) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    changeFlagCode(code, flag, show) {
      this.areaFlag = flag;
      this.areaCode = code;
      this.isShow = !show;
    },
    changeList(list) {
      this.flagList = list;
    },
    // 发送验证码
    async sendVertifyCode() {
      if (!this.phone.trim()) {
        return this.$Message.error("请输入手机号！");
      }
      if (!/^1[\d]{10}$/.test(this.phone.trim())) {
        return this.$Message.error("请输入正确的手机号");
      }

      if (this.isCalc) return;
      this.isCalc = true;
      this.count = 60;

      const params = {
        areaCode: this.areaCode,
        phone: this.phone,
        languageCode: this.getLanguage,
        authType: "SMS_105240036",
        smsBusinessType: 3,
        device: 1
      };
      const res = await axios.sendVerifyCode(params);

      if (res.code === 0) {
        const { success } = res.data;

        if (success) {
          this.$Message.info("发送成功！");
          let timer = setInterval(() => {
            if (this.count <= 0) {
              this.countText = "重新发送";
              this.isCalc = false;
              clearInterval(timer);
              return;
            }
            this.countText = this.count + "s";
            this.count--;
          }, 1000);
        } else {
          this.$Message.error("发送失败！");
        }
      } else {
        this.isCalc = false;
        this.$Message.error(res.msg);
      }
    },
    // 找回密码
    async findLoginPwd() {
      const newPwd = this.newPassword.trim();
      const oldPwd = this.confirmPassword.trim();
      if (!newPwd || !oldPwd) {
        return this.$Message.error("请输入密码！");
      }
      //   if (!/^[\w]{6, 16}$/.test(newPwd) || !/^[\w]{6, 16}$/.test(oldPwd)) {
      //     return this.$Message.error("请输入正确的密码！");
      //   }
      if (6 > newPwd.length || newPwd.length > 16) {
        return this.$Message.error("请输入长度为6-16的密码！");
      }

      if (newPwd !== oldPwd) {
        return this.$Message.error("两次密码不一致！");
      }

      const params = {
        areaCode: this.areaCode,
        phone: this.phone,
        password: newPwd,
        smsCode: this.vertifyCode,
        device: 1
      };
      const res = await axios.findLoginPassword(params);

      if (res.code === 0) {
        this.stepNum++;
      } else {
        this.$Message.error("找回密码失败!");
      }
    }
  },
  mounted() {
    this.getFlags();
  }
};
</script>

<style lang="scss" scoped>
@import "../style/tooltips.scss";
.wrap {
  .header {
    background: #040e2a;
    .content {
      min-width: 1200px;
      width: 1200px;
      margin: 0 auto;
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      width: 132px;
      height: 30px;
      opacity: 0.9;
      &:hover {
        opacity: 1;
      }
    }
    .site-text {
      display: inline-block;
      cursor: pointer;
      color: #fff;
      text-decoration: none;
      margin-right: 24px;
      font-size: 14px;
      opacity: 0.9;
      &:hover {
        opacity: 1;
      }
    }
    .divide {
      display: inline-block;
    }

    .language-tips {
      display: inline-block;
      .select-widget {
        width: 162px;
        @include select-widget();

        .select-val {
          padding: 0 24px;
          color: #fff;
          @include select-val();
          .flag-icon {
            width: 21px;
            height: 14px;
            vertical-align: middle;
            margin-right: 8px;
          }
          .language {
            display: inline-block;
            width: 60px;
            white-space: nowrap;
            text-overflow: ellipsis;
            opacity: 0.9;
            &:hover {
              opacity: 1;
            }
          }
          .down-icon {
            transition: all 0.2s ease;
            display: inline-block;
            vertical-align: middle;
            width: 8px;
            height: 4px;
            margin-left: 8px;
            mask-image: url("../assets/login/arrow_20200717.svg");
            background-color: #fff;
          }
        }

        .select-triangle {
          @include select-triangle();
          top: 18px;
          left: 72px;
        }

        .select-list {
          @include select-list($w: 158px);
          top: 30px;
          height: 160px;
        }
      }
      .select-language-item {
        padding: 12px 0 12px 24px;
        text-align: left;
        color: #333;
        font-size: 14px;
        transition: all 0.3s ease-out;
        line-height: 16px;
        background: #fff;

        &:hover {
          background: rgba(213, 221, 237, 1);
          color: #3674d7;
        }

        .flag-icon {
          display: inline-block;
          width: 20px;
          height: 13px;
        }

        .lang-text {
          margin-left: 10px;
        }
      }
    }
  }
  .forget-pwd {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    .title {
      margin-top: 90px;
      color: #000;
      font-size: 28px;
      font-weight: bold;
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 17px;
    }
    .desc {
      margin-top: 14px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(104, 114, 146, 1);
      .tips-icon {
        width: 18px;
        height: 19px;
        margin-right: 4px;
      }
      .tips-text {
        vertical-align: middle;
      }
    }
    .apply-step {
      display: flex;
      margin: 46px auto 102px;
      justify-content: space-between;
      width: 590px;
      .step-line {
        width: 172px;
        height: 1px;
        background: #cccccc;
        margin-top: 34px;
      }
      .step {
        text-align: center;
        .step-img {
          display: inline-block;
          width: 16px;
          height: 18px;
        }
        .phone-icon.icon-active,
        .password-icon.icon-active,
        .complete-icon.icon-active {
          background: #3674d7;
        }
        .step-text {
          margin-top: 9px;
          color: #666;
          font-size: 16px;
        }
        .active {
          color: #3674d7;
        }
        .phone-icon {
          mask-image: url("../assets/login/phone_20200622.svg");
          background-color: #666;
        }
        .password-icon {
          mask-image: url("../assets/login/password_20200622.svg");
          background-color: #666;
        }
        .complete-icon {
          mask-image: url("../assets/login/complete_20200622.svg");
          background-color: #666;
        }
      }
    }
    .phone-vertify {
      width: 500px;
      margin: 0 auto;
      .vertify-code {
        margin-top: 40px;
      }
      .row-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label-text {
          font-size: 14px;
          color: #666;
        }
        .input-box {
          color: #ccc;
          font-size: 14px;
          .input-style {
            // transition: all 0.3s ease-in;
            width: 256px;
            outline: none;
            border: 1px solid #ccc;
            border-radius: 2px;
            color: #333;
            font-size: 14px;
            padding: 9px 12px;
            &::placeholder {
              color: #ccc;
            }
            &:focus {
              border: 1px solid #3674d7;
            }
          }
          .send-code {
            display: inline-block;
            width: 91px;
            margin-left: 12px;
            border: 1px solid #3674d7;
            padding: 10px 9px;
            border-radius: 2px;
            color: #3674d7;
            text-decoration: none;
            text-align: center;
            // &:hover {
            //   color: #3674d7;
            //   border: 1px solid #3674d7;
            // }
          }
          .disabled {
            pointer-events: none;
            cursor: not-allowed;
          }
          .new-password {
            width: 360px;
          }
        }
      }
      .next-box {
        text-align: right;
        .next-step {
          display: inline-block;
          color: #fff;
          font-size: 16px;
          text-align: center;
          padding: 15px 156px;
          border-radius: 4px;
          background: #3674d7;
          margin-top: 48px;
          text-decoration: none;
          &:hover {
            opacity: 1;
          }
        }
        .go-login {
          display: inline-block;
          margin-top: 12px;
          color: #3674d7;
        }
      }
      .set-success {
        text-align: center;
        .success-icon {
          width: 52px;
          height: 52px;
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }
        .again-login {
          transition: all 0.2s ease-out;
          margin-top: 40px;
          display: inline-block;
          color: #fff;
          font-size: 16px;
          padding: 15px 45px;
          background: #3674d7;
          border-radius: 4px;
          cursor: pointer;
          opacity: 0.89;
          &:hover {
            opacity: 1;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>