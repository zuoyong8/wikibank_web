<template>
  <div v-if="isExcess">
    <div class="row" :style="{marginTop: '40px'}">
      <div class="key">{{$t('personCenter.telVertifyCode')}}</div>
      <div class="val">
        <div>
          <input
            type="text"
            class="enter-input"
            v-model="phoneVertifyCode"
            :phone="phone"
            :placeholder="$t('customError.telVertifyCodeTips')"
            @change="enterCode"
            :style="{width: '290px', marginRight:'40px'}"
          />
          <span class="get-code" @click="sendVertifyCode">
            <span v-if="status === 1">{{$t('customError.sendVertifyCode')}}</span>
            <span v-else-if="status === 2">{{countText}}</span>
            <span v-else-if="status === 3">{{$t('customError.againSend')}}</span>  
          </span>
        </div>
      </div>
    </div>
    <div class="row" :style="{marginTop: '0'}">
      <div class="key"></div>
      <div class="val">
        <div class="tips">
          <img :src="tipsIcon" alt="" class="tips-icon"> 
          <span class="tips-text">{{tips}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../api/request";
import { mapState } from "vuex";
export default {
  name: "ExcessVertify",
  components: {},
  data() {
    return {
      status: 1,
      isCalc: false,
      countText: "",
      count: 0,
      phoneVertifyCode: this.value,
      tipsIcon: require("../../assets/login/tips_icon_20200730.png")
    };
  },
  watch: {
    phoneVertifyCode(val) {
      this.$emit("input", val);
    }
  },
  props: {
    isExcess: Boolean,
    phone: String,
    value: String,
    tips: String
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    enterCode() {
      this.phoneVertifyCode = this.phoneVertifyCode;
    },
    // 发送验证码
    async sendVertifyCode() {
      let vert = this.phone.trim();

      if (!vert) {
        return this.$Message.error(this.$t('customError.telTips'));
      }
      if (!/^1[\d]{10}$/.test(vert)) {
        return this.$Message.error(this.$t('customError.telRuleTips'));
      }

      if (this.isCalc) return;
      this.isCalc = true;
      this.count = 60;

      const telParams = {
        areaCode: this.userInfo.areaCode,
        phone: vert,
        languageCode: this.userInfo.languageCode,
        authType: "SMS_105240036",
        smsBusinessType: 3,
        device: 1
      };

      const res = await axios.sendVerifyCode(telParams);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.success(this.$t('customError.sendSuccess'));
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
          this.isCalc = false;
          this.$Message.error(this.$t('customError.sendFail'));
        }
      } else {
        this.isCalc = false;
        this.$Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  margin-top: 40px;
  &:first-child {
    margin-top: 0;
  }
  .key {
    color: #666;
    font-size: 14px;
    width: 130px;
  }
  .val {
    .tips {
      display: inline-block;
      padding: 8px 16px;
      border: 1px solid #e7c560;
      background: #ffffb8;
      margin-top: 8px;
      position: relative;
      .tips-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
      .tips-text {
        vertical-align: middle;
      }
      &::before {
        position: absolute;
        content: "";
        z-index: 1;
        top: -12px;
        left: 100px;
        border: 6px solid #ffffb8;
        border-color: transparent;
        border-bottom-color: #ffffb8;
      }
      &::after {
        position: absolute;
        content: "";
        top: -13px;
        left: 100px;
        border: 6px solid #e7c560;
        border-color: transparent;
        border-bottom-color: #e7c560;
      }
    }
    .get-code {
      cursor: pointer;
      color: #3674d7;
    }
    .enter-input {
      border: 1px solid #ccc;
      padding: 10px 12px;
      width: 360px;
      border-radius: 2px;
      outline: none;
      &::placeholder {
        color: #ccc;
      }
    }
  }
}
</style>