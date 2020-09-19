<template>
  <div class="wrap">
    <Header>
      <template>
        <a href='/' class="site-text">WikiPay {{$t('forgetPassword.home')}}</a>
      </template>
    </Header>
    <div class="forget-pwd">
      <div class="title">{{$t('forgetPassword.forgetPwd')}}</div>
      <div class="desc"><img :src="tipsIcon" alt="" class="tips-icon"> <span class="tips-text">{{$t('forgetPassword.forgetTips')}}</span> </div>
      <div class="apply-step">
        <div class="step">
          <div v-if="stepNum > 0">
            <img :src="successIcon" alt class="step-img" />
          </div>
          <div v-else>
            <span class="step-img phone-icon" :class="stepNum == 0 ? 'icon-active':''"></span>
          </div>
          <div class="step-text" :class="stepNum == 0 ? 'active':''">{{$t("forgetPassword.phoneVertify")}}</div>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div v-if="stepNum > 1">
            <img :src="successIcon" alt class="step-img" />
          </div>
          <div v-else>
            <span class="step-img password-icon" :class="stepNum == 1 ? 'icon-active':''"></span>
          </div>
          <div class="step-text" :class="stepNum == 1 ? 'active':''">{{$t("forgetPassword.resetPassword")}}</div>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div v-if="stepNum > 2">
            <img :src="successIcon" alt class="step-img" />
          </div>
          <div v-else>
            <span class="step-img complete-icon" :class="stepNum == 2 ? 'icon-active':''"></span>
          </div>
          <div class="step-text" :class="stepNum == 2 ? 'active':''">{{$t("forgetPassword.complete")}}</div>
        </div>
      </div>
      <div class="phone-vertify">
        <div v-if="stepNum === 0" :style="{display:'inline-block'}">
          <div class="row-box">
            <div class="label-text">{{$t("forgetPassword.phone")}}</div>
            <div class="input-box">
              <Dropdown
                :isShow="isShow"
                :width="dropdownWidth"
                :valWidth="88"
                @selectCountry="selectCountry"
                @changeFlagCode="changeFlagCode"
              ></Dropdown>
              <input type="text" :placeholder="$t('placehode.tel')" class="input-style" v-model="phone" :style="{marginLeft:'16px'}"/>
            </div>
          </div>
          <div class="row-box vertify-code">
            <div class="label-text">{{$t("forgetPassword.vertifyCode")}}</div>
            <div class="input-box">
              <input :style="{width: '230px', marginRight: '12px'}" type="text" :placeholder="$t('placehode.telVertifyCode')" class="input-style" v-model="vertifyCode" />
              <a
                href="javascript:;"
                class="send-code"
                :class="isCalc ? 'disabled':'' "
                @click="sendVertifyCode"
              >
                <span v-if="status === 1">{{$t('customError.sendVertifyCode')}}</span>
                <span v-else-if="status === 2">{{countText}}</span>
                <span v-else-if="status === 3">{{$t('customError.againSend')}}</span>
              </a>
            </div>
          </div>
          <div class="next-box">
            <a href="javascript:;" class="next-step" @click="nextStep">{{$t("forgetPassword.nextStep")}}</a>
            <div>
              <a href='/login' class="go-login">{{$t("forgetPassword.login")}}</a>
            </div>
          </div>
        </div>

        <div v-else-if="stepNum === 1" :style="{display:'inline-block'}">
          <div class="row-box vertify-code" :style="{marginTop: 0}">
            <div class="label-text">{{$t("forgetPassword.newPassword")}}</div>
            <div class="input-box">
              <input
                type="password"
                :placeholder="$t('placehode.newPwd')" 
                class="input-style new-password"
                v-model="newPassword"
              />
            </div>
          </div>
          <div class="row-box vertify-code">
            <div class="label-text">{{$t("forgetPassword.confirmPassword")}}</div>
            <div class="input-box">
              <input
                type="password"
                :placeholder="$t('placehode.againNewPwd')" 
                class="input-style new-password"
                v-model="confirmPassword"
              />
            </div>
          </div>
          <div class="next-box">
            <a href="javascript:;" class="next-step" @click="findLoginPwd">{{$t("forgetPassword.nextStep")}}</a>
            <div>
              <a href='/login' class="go-login">{{$t("forgetPassword.login")}}</a>
            </div>
          </div>
        </div>

        <div class="set-success" v-else>
          <img :src="successIcon" alt class="success-icon" />
          <div>{{$t("forgetPassword.successFind")}}</div>
          <a href='/login' class="again-login">{{$t("forgetPassword.againLogin")}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "./components/Dropdown";
import Header from "./components/Header";
import axios from "../api/request";
import { mapState ,mapGetters, mapMutations } from "vuex";
export default {
  components: {
    Dropdown,
    Header
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
      isShow: false, // 是否显示
      phone: "", // 手机号
      vertifyCode: "", // 手机验证码
      newPassword: "", // 新密码
      confirmPassword: "", // 确认密码
      count: 0,
      countText: "",
      isCalc: false, // 正在倒计时
      status: 1,
      dropdownWidth: 360
    };
  },
  computed: {
    ...mapState(['langAbbr','language', 'langFlag', 'languageList', 'flagList', 'areaFlag', 'areaName', 'areaCode']),
    ...mapGetters(["getLanguage"])
  },
  methods: {
    ...mapMutations(["getFlags", "changeAreaName"]),
    // 下一步
    nextStep() {
      const tel = this.phone.trim();
      const code = this.vertifyCode.trim();

      if (!tel || !code) {
        return this.$Message.error(this.$t('customError.telAndVertifyTips'));
      }
      // if (!/^1[\d]{10}$/.test(this.phone)) {
      //   return this.$Message.error(this.$t('customError.telRuleTips'));
      // }
      // if (!/^[\d]{4}$/.test(code)) {
      //   return this.$Message.error(this.$t('customError.vertifyCodeRuleTips'));
      // }
      this.stepNum++;
    },
    selectCountry(show) {
      if (show) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    changeFlagCode(show) {
      this.isShow = !show;
    },
    // 发送验证码
    async sendVertifyCode() {
      if (!this.phone.trim()) {
        return this.$Message.error(this.$t('customError.telTips'));
      }
      // if (!/^1[\d]{10}$/.test(this.phone.trim())) {
      //   return this.$Message.error(this.$t('customError.telRuleTips'));
      // }

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
          this.$Message.info(this.$t('customError.sendSuccess'));
          let timer = setInterval(() => {
            this.status = 2;
            if (this.count <= 0) {
              this.status = 3;
              this.isCalc = false;
              clearInterval(timer);
              return;
            }
            this.countText = this.count + "s";
            this.count--;
          }, 1000);
        } else {
          this.$Message.error(this.$t('customError.sendFail'));
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
        return this.$Message.error(this.$t('customError.pwdTips'));
      }
      if (6 > newPwd.length || newPwd.length > 16) {
        return this.$Message.error(this.$t('customError.pwdLength'));
      }
      if (newPwd !== oldPwd) {
        return this.$Message.error(this.$t('customError.pwdDiff'));
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
        this.$Message.error(res.msg);
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
      padding: 12px 18px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(104, 114, 146, 1);
      background: #FEFCEB;
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
          -webkit-mask-image: url("../assets/login/phone_20200622.svg");
          mask-image: url("../assets/login/phone_20200622.svg");
          background-color: #666;
        }
        .password-icon {
          -webkit-mask-image: url("../assets/login/password_20200622.svg");
          mask-image: url("../assets/login/password_20200622.svg");
          background-color: #666;
        }
        .complete-icon {
          -webkit-mask-image: url("../assets/login/password_20200622.svg");
          mask-image: url("../assets/login/complete_20200622.svg");
          background-color: #666;
        }
      }
    }
    .phone-vertify {
      text-align: center;
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
          margin-right: 48px;
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
            width: 118px;
            border: 1px solid #3674d7;
            padding: 9px 2px;
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
          .select-dropdown .dropdown-list {
            width: 316px;
          }
        }
      }
      .next-box {
        text-align: right;
        .next-step {
          width: 360px;
          display: inline-block;
          color: #fff;
          font-size: 16px;
          text-align: center;
          padding: 15px 0;
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