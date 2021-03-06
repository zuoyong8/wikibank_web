<template>
  <div class="qrcode">
    <div :style="{textAlign: 'right'}">
      <div class="refresh" @click="delayTime">
        <icon name="refresh" class="rotate" :style="rotate"/> {{$t('account.delay')}}
      </div>
    </div>
    <div class="countdown-text">{{$t('account.countDown')}}</div>
    <div class="count-down">{{hour}}:{{min}}:{{second}}</div>
    
    <div class="qrcode-loading">
      <span class="loading" v-if="loading"></span>
      <vue-qr :logoSrc="logo" :size="185" :text="address" :logoScale="0.2" :logoMargin="2" :margin="0" v-else></vue-qr>
    </div>
    
    <div>
      <div class="addr-code">
        {{address}}
        <img :src="copyIcon"
          class="copy copy_address"
          @click="copyAddress"
          data-clipboard-action="copy"
          :data-clipboard-text="address"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../api/request";
import VueQr from 'vue-qr';
import QRCode from "qrcode";
import '@/icons/refresh';
export default {
  name: "",
  components: { QRCode, VueQr },
  data() {
    return {
      copyIcon: require("@/assets/imgs/copy.svg"),
      rotate: {
        transitionDuration: "0",
        transform: "rotate(0)"
      },
      curEndTime: "",
      hour: "00",
      min: "00",
      second: "00",
    };
  },
  props: {
    coinName: String,
    accountType: Number,
    address: String,
    logo: String,
    loading: Boolean
  },
  
  methods: {
    // 延时
    delayTime() {
      this.getEndTime();
      this.countDowntTime();
      this.rotate = {
        transitionDuration: "0.3s",
        transform: "rotate(360deg)"
      };

      setTimeout(() => {
        this.rotate = {
          transitionDuration: "0s",
          transform: "rotate(0deg)"
        };
      }, 1000);
      this.$emit("showQrcode");
    },
    // 复制
    copyAddress() {
      let self = this;
      // 防止重复出现多次弹框
      if (clipboard) {
        clipboard.destroy();
      }
      let clipboard = new this.clipboard(".copy_address");

      clipboard.on("success", function() {
        self.$Message.success(self.$t("home.copySuccess"));
        if (clipboard) {
          clipboard.destroy();
        }
      });

      clipboard.on("error", function() {
        self.$Message.error(self.$t("home.copyFail"));
      });
    },
    getEndTime() {
      this.curEndTime = new Date();
      var ts = this.curEndTime.getTime();
      this.curEndTime.setTime(ts + 1000 * 60 * 60 * 3);
      this.countDowntTime();
    },
    // 倒计时
    countDowntTime() {
      // 获取当前时间
      let date = new Date();
      let now = date.getTime();
      // 设置截止时间
      let endDate = new Date(this.curEndTime);
      let end = endDate.getTime();
      // 时间差
      let leftTime = end - now;
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // 时
        let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        this.hour = h < 10 ? "0" + h : h;
        // 分
        let m = Math.floor((leftTime / 1000 / 60) % 60);
        this.min = m < 10 ? "0" + m : m;
        // 秒
        let s = Math.floor((leftTime / 1000) % 60);
        this.second = s < 10 ? "0" + s : s;
      } else {
        this.hour = "00";
        this.min = "00";
        this.second = "00";
      }
      if (
        Number(this.hour) === 0 &&
        Number(this.day) === 0 &&
        Number(this.min) === 0 &&
        Number(this.second) === 0
      ) {
        return;
      } else {
        setTimeout(this.countDowntTime, 1000);
      }
    }
  },
  mounted() {
    this.getEndTime();
  }
};
</script>

<style lang="scss" scoped>
.qrcode {
  width: 440px;
  background: #f5f6fa;
  border: 1px dashed #bbbbbb;
  text-align: center;
  color: #666;
  font-size: 14px;
  .refresh {
    display: inline-block;
    padding: 10px 6px;
    text-align: right;
    color: #3674d7;
    cursor: pointer;
    background: #FAFCFF;
    border-radius:0px 0px 0px 12px;
    font-size: 14px;
    .rotate {
      display: inline-block;
      width: 20px;
      height: 15px;
      vertical-align: middle;
      margin-top: -2px;
      transform: rotate(360deg);
      fill: #3674D7;
    }
  }
  .countdown-text {
    font-size: 14px;
    color: #333;
    margin-top: 7px;
  }
  .count-down {
    margin: 5px 0 24px;
    font-weight: bold;
    color: #ff733a;
    font-size: 18px;
  }
  .qrcode-loading {
    display: inline-block;
    width: 185px;
    height: 185px;
    .loading {
        display: inline-block;
        width: 35px;
        height: 35px;
        border: 2px solid #f5f6fa;
        border-top-color: #3674d7;
        border-bottom-color: #3674d7;
        border-left-color: #3674d7;
        border-radius: 50%;
        animation: move 1s linear infinite;
        vertical-align: middle;
        margin-top: 70px;
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
  .addr-code {
    display: inline-block;
    margin: 32px 0 33px;
    padding: 10px 17px;
    background: #f8faff;
    border: 1px solid #f8faff;
    border-radius: 4px;
    cursor: pointer;
    transition: all .2s ease;
    &:hover {
      border: 1px solid #98bfff;
    }
    .copy {
      display: inline-block;
      margin-top: -4px;
      width: 18px;
      height: 18px;
      margin-left: 8px;
      vertical-align: middle;
      cursor: pointer;
      opacity: 0.5;
      transition: all 0.2s ease-out;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>