<template>
  <div v-if="isExcess">
    <div class="row" :style="{marginTop: '40px'}">
      <div class="key">手机验证码</div>
      <div class="val">
        <div>
          <input
            type="text"
            class="enter-input"
            v-model="phoneVertifyCode"
            :phone="phone"
            placeholder="请输入手机验证码"
            @change="enterCode"
            :style="{width: '290px', marginRight:'40px'}"
          />
          <span class="get-code" @click="sendVertifyCode">{{countText}}</span>
        </div>
      </div>
    </div>
    <div class="row" :style="{marginTop: '0'}">
      <div class="key"></div>
      <div class="val">
        <div class="tips">{{tips}}</div>
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
      isCalc: false,
      countText: "获取",
      count: 0,
      phoneVertifyCode: this.value
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
        return this.$Message.error("请输入手机号！");
      }
      if (!/^1[\d]{10}$/.test(vert)) {
        return this.$Message.error("请输入正确的手机号");
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

      this.$Spin.show();
      const res = await axios.sendVerifyCode(telParams);
      this.$Spin.hide();

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.info("发送成功！");
          let timer = setInterval(() => {
            if (this.count <= 0) {
              this.countText = "获取";
              this.isCalc = false;
              clearInterval(timer);
              return;
            }
            this.countText = this.count + "s";
            this.count--;
          }, 1000);
        } else {
          this.isCalc = false;
          this.$Message.error("发送失败！");
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