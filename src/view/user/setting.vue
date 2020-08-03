<template>
  <div class="mine">
    <PersonalData></PersonalData>
    <div class="personal1">
      <div class="icon"></div>
      <div class="txt">个人设置</div>
    </div>
    <ul class="pwd">
      <li class="login-wrap">
        <div class="login">
          <div class="login-txt">登录密码</div>
          <div class="login-icon">
            <span class="icon--1-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </span>
          </div>
          <div class="path"></div>
          <div class="revise" @click="openPayModal">修改</div>
        </div>
      </li>
      <li class="pay-wrap">
        <div class="pay">
          <div class="pay-txt">支付密码</div>
          <div class="pay-icon">
            <span class="icon--copy-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </span>
          </div>
          <div class="path"></div>
          <div class="revise">
            <span style="cursor:pointer" @click="openPayModal(true)">修改</span>
            <span class="divide"></span>
            <span style="cursor:pointer" @click="findPayPassword">找回</span>
          </div>
        </div>
      </li>
    </ul>
    <!-- 修改密码弹出层 -->
     <ModalMask
      :isShowModal = "isShowPwdModal"
      :isHideMask = "isHidePwdMask"
      @closeModal = "closePwdModal"
      @openModal = "openPwdModal"
    >
      <template v-slot:body>
        <form class="pwd-mask" v-if="isPwd">
          <div class="close">
            <span class="txt">密码修改</span>
            <span class="icon--copy4" @click="closePwdModal"></span>
          </div>
          <div class="pwd-tip">
            <span class="icon--1-2" @click="isPwd=false">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </span>
            <span class="tip-txt">为了您的资产安全，修改登录密码24小时内不允许提现</span>
          </div>
          <p>原登录密码</p>
          <input type="password" placeholder="请输入原登录密码" v-model="oldPwd" />
          <p>新登录密码</p>
          <input type="password" placeholder="请输入新登录密码" v-model="newPwd" />
          <p>新登录密码</p>
          <input type="password" placeholder="请再次输入新登录密码" v-model="newPwdd" />
          <div class="confirm" @click="confirmLoginPassword">确定</div>
        </form>
      </template>
     </ModalMask>
    <!-- 支付密码弹出层 -->
    <ModalMask
      :isShowModal = "isShowPayModal"
      :isHideMask = "isHidePayMask"
      @closeModal = "closePayModal"
      @openModal = "openPayModal"
    >
      <template v-slot:body>
        <form class="pay-mask">
          <div class="close">
            <span class="txt">支付密码修改</span>
            <span class="icon--copy4" @click="closePayModal(false)"></span>
          </div>
          <div class="center" v-show="!yes">
            <div class="center-tip">
              <span class="icon--1-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </span>
              <span class="tip-txt">为了您的资产安全，修改支付密码24小时内不允许提现</span>
            </div>
            <p>原支付密码</p>
            <input type="password" placeholder="请输入原支付密码" v-model="oldPay" />
            <p>新支付密码</p>
            <input type="password" placeholder="请输入新支付密码" v-model="newPay" />
            <p>新支付密码</p>
            <input type="password" placeholder="请再次输入新支付密码" v-model="newPayy" />
            <div class="confirm" @click="confirmPay">确定</div>
          </div>
          <div class="yes" v-show="yes">
            <div class="icon">
              <img src="../../assets/imgs/yes.png" alt />
            </div>
          </div>
        </form>
      </template>
    </ModalMask>
    
    <Modal v-model="payPasswordModal" width="480" footer-hide>
      <!-- <p slot="header">
        <span class="modal-title">找回支付密码</span>
      </p> -->
      <div class="modal-centent">
        <span class="modal-title">找回支付密码</span>
        <div class="safe-tips">
            <span class="icon--1-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </span>
            <span class="safe-text">为了您的资金安全，修改支付密码24小时内不允许提现</span>
        </div>
        <div class="modal-phone">手机号</div>
        <div class="select-phone">
            <Dropdown 
            :flagList="flagList"
            :isShow="isShowCountryList"
            :areaCode="areaCode"
            @selectCountry="selectCountry" 
            @changeFlagCode="changeFlagCode">
            </Dropdown>
            <input type="text" placeholder="请输入手机号" v-model="tel" class="tel-input">
        </div>
        
        <div class="vertify-code">手机验证码</div>
        <div class="">
            <input type="text" v-model="telVertifyCode" placeholder="输入短信验证码" class="vertify-code-input">
            <a href="javascript:;" class="send-code" :class="isCalc ? 'disabled':'' " @click="sendVertifyCode">{{countText}}</a>
        </div>
         <a href="javascript:;" class="confirm-button" @click="vertifyTelCode">确定</a>
      </div>
      <!-- <div slot="footer">
        <Button type="error" size="large" long :loading="modalLoading" @click="findPayPassword">确定</Button>
        <a href="javascript:;" class="confirm-button">确定</a>
      </div> -->
    </Modal>
  </div>
</template>

<script>
import PersonalData from "../components/PersonalData";
import axios from "../../api/request";
import { fetchCountry } from "../../api/request";
import Dropdown from "../components/Dropdown";
import ModalMask from "../components/ModalMask";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isShowPwdModal: false,
      isHidePwdMask: true,
      isShowPayModal: false,
      isHidePayMask: true,
      isPwd: false, //修改密码弹出层
      isPay: false, //支付密码弹出层
      oldPwd: "",
      newPwd: "",
      newPwdd: "",
      oldPay: "",
      newPay: "",
      newPayy: "",
      yes: false,
      tel: "",
      count: 0,
      countText: "发送验证码",
      isCalc: false, // 正在倒计时
      flagList: [], // 国家国旗
      areaCode: "0086", //国家区号
      telVertifyCode: "", // 验证码
      isShowCountryList: false,
      payPasswordModal: false,
      modalLoading: false
    };
  },
  components: {
    PersonalData,
    Dropdown,
    ModalMask
  },
  computed: {
      ...mapGetters(["getLanguage"])
  },
  methods: {
    closePwdModal(isShow) {
      this.isShowPwdModal = isShow;
      this.isHidePwdMask = true;
    },
    openPwdModal(isShow) {
      this.isShowPwdModal = isShow;
      this.isHidePwdMask = false;
    },
    closePayModal(isShow) {
      this.isShowPayModal = isShow;
      this.isHidePayMask = true;
    },
    openPayModal(isShow) {
      this.isShowPayModal = isShow;
      this.isHidePayMask = false;
    },
    async confirmLoginPassword() {
      if (!this.oldPwd) {
        this.$Message.error("请输入原登录密码");
        return;
      }
      if (!this.newPwd) {
        this.$Message.error("请输入新登录密码");
        return;
      }
      if (!this.newPwdd) {
        this.$Message.error("请输入确认登录密码");
        return;
      }
      if (this.newPwd !== this.newPwdd) {
        this.$Message.error("输入的两次密码不一致");
        return;
      }
      const params = {
        oldPwd: this.oldPwd,
        newPwd: this.newPwdd
      };

      const res = await axios.updateLoginPassword(params);

      if (res.code === 0) {
        this.$Message.info("修改成功！");
        this.isPwd = false;
      } else {
        this.$Message.error("网络出错，请稍后再试！");
      }
    },
    showPwd() {
      this.isPwd = true;
    },
    closePwd() {
      this.isPwd = false;
    },
    isShowPay() {
      this.isPay = true;
    },
    close() {
      this.isPay = false;
    },
    // 找回支付密码
    findPayPassword() {
      this.payPasswordModal = true;
    },
    async confirmPay() {
      if (this.oldPay == "") {
        this.$Message.error("请输入原支付密码");
        return;
      }
      if (this.newPay == "") {
        this.$Message.error("请输入新支付密码");
        return;
      }
      if (this.newPayy == "") {
        this.$Message.error("请输入确认支付密码");
        return;
      }
      if (this.newPay !== this.newPayy) {
        this.$Message.error("输入支付密码不一致！");
        return;
      }
      const params = {
        oldPwd: this.oldPay,
        newPwd: this.newPayy
      };
      const res = await axios.updatePayPassword(params);
      if (res.code === 0) {
        this.$Message.info("修改成功！");
        this.yes = true;
      } else {
        this.$Message.error("网络出错，请稍后再试！");
      }
    },
    getFlags() {
        const res = fetchCountry();

        this.flagList = res;
    },
    selectCountry(show) {
      if(show) {
        this.isShowCountryList = false;
      } else {
        this.isShowCountryList = true;
      }
    },
    changeFlagCode(code, show) {
        this.areaCode = code;
        this.isShowCountryList = show;
    },
    // 发送验证码
    async sendVertifyCode() {
        if(!this.tel) {
            return this.$Message.error("请输入手机号！");
        }
        if(!/^1[\d]{10}$/.test(this.tel)) {
            return this.$Message.error("请输入正确的手机号");
        }

        if(this.isCalc) return
        this.isCalc = true;
        this.count = 60;

        const params = {
            areaCode: this.areaCode,
            phone: this.tel,
            languageCode: this.getLanguage,
            authType:"SMS_105240036",
            smsBusinessType: 3,
            device: 1
        }
        const res = await axios.sendVerifyCode(params);
        
        if( res.code === 0 ) {
            const success = res.data;
            if(success) {
                this.$Message.info('发送成功！');
                let timer = setInterval( () =>　{
                    if(this.count <= 0) {
                        this.countText = "重新发送";
                        this.isCalc = false;
                        clearInterval(timer);
                        return;
                    }
                    this.countText = this.count + "s";
                    this.count--;
                }, 1000)
            } else {
                this.$Message.error("发送失败！");
            }
        
        } else {
            this.$Message.error("网络繁忙，请稍候在试！");
        }
    },
    // 验证手机验证码
    async vertifyTelCode() {
        const params = {
            areaCode: this.areaCode,
            phoneNumber: this.tel,
            smscode: this.telVertifyCode,
            device:　1
        }
        const res = await axios.vertifyTelCode(params);

        if(res.code === 0) {
            const success = res.data;
            if(success) {
                this.$Message.info("验证成功");
            } else {
                this.$Message.error("验证失败！");
            }
            this.payPasswordModal = false;
        } else {
            this.$Message.error("网络繁忙，请稍候再试！");
        }
    }
  },
  mounted() {
    this.getFlags();
  }
};
</script>
<style style lang='scss'>
.modal-centent {
    padding: 8px 10px 16px 10px;
}
.modal-title {
    color: #333;
    font-size: 20px;
}
.safe-tips {
    margin-top: 26px;
    padding: 12px 18px;
    background: #FEFCEB;
    border:1px solid #F5DBB3;
    color: #687292;
    font-size: 12px;
    text-align: left;
    .safe-text {
        margin-left: 13px;
    }
}
.modal-phone {
    color: #666;
    font-size: 12px;
    margin-left: 104px;
    margin-top: 25px;
    margin-bottom: 7px;
}
.select-phone {
    margin-left: -10px;
}
.vertify-code {
    margin-top: 25px;
    margin-bottom: 7px;
    font-size: 12px;
    color: #666;
}
.vertify-code-input, .tel-input {
    outline: none;
    width: 306px;
    border: 1px solid #DFE2E7;
    border-radius: 2px;
    font-size: 14px;
    color: #333;
    padding: 7px 10px;
}
.tel-input {
    width: 324px;
}
.send-code {
    width: 100px;
    display: inline-block;
    padding: 7px 10px;
    text-align: center;
    color: #999;
    font-size: 14px;
    border: 1px solid #999;
    border-radius: 2px; 
    margin-left: 22px;
    &:hover {
        text-decoration: none !important;
        color: #3674D7;
        border: 1px solid #3674D7;
    }
}
.disabled {
    pointer-events: none;
    cursor: not-allowed;
}
.confirm-button {
    display: block;
    margin-top: 40px;
    padding: 11px 0;
    text-align: center;
    color: #fff;
    font-size: 17px;
    background: #3674D7;
    border-radius: 4px;
    opacity: 0.49;
    transition: all .2s ease-in;
    &:hover {
        opacity: 1;
        color: #fff;
        text-decoration: none !important;
    }
}
.mine {

  .pay-mask {
    width: 480px;
    height: 488px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
    border-radius: 4px;
    filter: blur(0px);
    padding: 24px 26px 32px 24px;

    .confirm {
      width: 428px;
      height: 48px;
      background: rgba(54, 116, 215, 1);
      border-radius: 4px;
      opacity: 0.49;
      font-size: 17px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 48px;
      text-align: center;
      margin-top: 40px;
      cursor: pointer;
    }

    p {
      height: 16px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 16px;
      margin-top: 25px;
      margin-bottom: 7px;
    }

    input {
      width: 428px;
      height: 36px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      line-height: 36px;
      padding-left: 11px;
    }

    input::input-placeholder {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(204, 204, 204, 1);
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);

      .txt {
        margin-right: 287px;
      }

      .icon--copy4 {
        cursor: pointer;
      }
    }

    .center-tip {
      line-height: 40px;
      margin-top: 15px;
      width: 428px;
      height: 40px;
      background: rgba(254, 252, 235, 1);
      border: 1px solid rgba(245, 219, 179, 1);

      .icon--1-2 {
        margin-left: 18px;
        margin-right: 13px;
      }

      .tip-txt {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(104, 114, 146, 1);
      }
    }
  }

  .pwd-mask {
    width: 480px;
    height: 488px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
    border-radius: 4px;
    filter: blur(0px);
    position: absolute;
    top: 30%;
    left: 50%;
    z-index: 5;
    padding: 24px 26px 32px 24px;

    .yes {
      .icon {
        width: 52px;
        height: 52px;
        background: rgba(61, 189, 125, 1);
        border-radius: 50%;
      }
    }

    .confirm {
      width: 428px;
      height: 48px;
      background: rgba(54, 116, 215, 1);
      border-radius: 4px;
      opacity: 0.49;
      font-size: 17px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 48px;
      text-align: center;
      margin-top: 40px;
      cursor: pointer;
    }

    p {
      height: 16px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 16px;
      margin-top: 25px;
      margin-bottom: 7px;
    }

    input {
      width: 428px;
      height: 36px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      line-height: 36px;
      padding-left: 11px;
    }

    input::input-placeholder {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(204, 204, 204, 1);
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);

      .txt {
        margin-right: 329px;
      }

      .icon--copy4 {
        cursor: pointer;
      }
    }

    .pwd-tip {
      line-height: 40px;
      margin-top: 15px;
      width: 428px;
      height: 40px;
      background: rgba(254, 252, 235, 1);
      border: 1px solid rgba(245, 219, 179, 1);

      .icon--1-2 {
        margin-left: 18px;
        margin-right: 13px;
      }

      .tip-txt {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(104, 114, 146, 1);
      }
    }
  }

  .personal1 {
    height: 64px;
    margin-left: 40px;
    background: rgba(245, 246, 250, 1);

    .icon {
      width: 20px;
      height: 15px;
      mask: url("../../assets/imgs/mine7.svg");
      background: #62697f;
      margin: 25px 8px 23px 16px;
      float: left;
      -webkit-mask-position: 100%;
      -webkit-mask-repeat: no-repeat;
    }

    .txt {
      margin: 17px 0;
      float: left;
      height: 30px;
      font-size: 18px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(98, 105, 127, 1);
      line-height: 30px;
    }
  }

 
}
</style>