<template>
  <div class=''>
    <input type="text" v-model="vertifyCode" :placeholder="vertifyText" class="vertify-code-input" @change="changeQrcode" />
    <a 
      href="javascript:;"
      class="send-code"
      :class="isCalc ? 'disabled':'' "
      @click="sendVertifyCode"
    >{{countText}}</a>
  </div>
</template>

<script>
import axios from "../../api/request";
import { mapGetters } from "vuex";
export default {
  name: "vertifycode",
  components: {},
  data() {
    return {
      isCalc: false,
      countText: "发送验证码",
      count: 0,
      vertifyCode: this.value,
    };
  },
  watch: {
    vertifyCode(val) {
      this.$emit("input", val);
    },
    isClear() {
      this.vertifyCode = "";
    }
  },
  props: {
    value: String, // 验证码
    type: String, // 1 手机 2 邮箱
    vertifyText: String, // 提示
    vertifyContent: String, // 手机号
    areaCode: String, // 区号
    isVertifyExsit: Boolean,
    isClear: false,
  },
  computed: {
    ...mapGetters(["getLanguage"])
  },
  methods: {
    clearQrcode() {
      this.vertifyCode = "";
    },
    // 修改二维码
    changeQrcode() {
      this.vertifyCode = this.vertifyCode;
    },
    // 发送验证码
    async sendVertifyCode() {
      let vert = this.vertifyContent.trim();

      if (this.type === "1") {
        if (!vert) {
          return this.$Message.error("请输入手机号！");
        }
        if (!/^1[\d]{10}$/.test(vert)) {
          return this.$Message.error("请输入正确的手机号");
        }
      } else if (this.type === "2") {
        if (!vert) return this.$Message.error("请输入邮箱！");
        if(this.isVertifyExsit) {
          const params = {
            email: vert
          }
          const res = await axios.isExistEmail(params);
          if(res.code === 0) {
            const { success }  = res.data;
            if(success) {
              this.$Message.success("邮箱校验成功！");
            } else {
              return this.$Message.error('校验邮箱失败！');
            }
          } else {
            return this.$Message.error(res.msg);
          }
        }
      } else {
        this.$Message.error("验证类型有误！");
      }

      if (this.isCalc) return;
      this.isCalc = true;
      this.count = 60;

      const telParams = {
        areaCode: this.areaCode,
        phone: vert,
        languageCode: this.getLanguage,
        authType: "SMS_105240036",
        smsBusinessType: 3,
        device: 1
      };

      const emailParams = {
        email: vert,
        type: 2
      };

      const params = this.type === "1" ? telParams : emailParams;

      const res =
        this.type === "1"
          ? await axios.sendVerifyCode(params)
          : await axios.sendEmailCode(params);
          
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
.vertify-code-input,
.tel-input {
  outline: none;
  width: 306px;
  border: 1px solid #dfe2e7;
  border-radius: 2px;
  font-size: 14px;
  color: #333;
  padding: 7px 10px;
  &:focus {
    border: 1px solid #3674d7;
  }
}
.tel-input {
  width: 324px;
}
.send-code {
  width: 100px;
  display: inline-block;
  padding: 7px 10px;
  text-align: center;
  color: #3674d7;
  font-size: 14px;
  border: 1px solid #3674d7;
  border-radius: 2px;
  margin-left: 22px;
  &:hover {
    text-decoration: none !important;
    color: #3674d7;
    border: 1px solid #3674d7;
  }
}
.disabled {
  pointer-events: none;
  cursor: not-allowed;
}
</style>