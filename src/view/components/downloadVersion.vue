<template>
  <div class="download-box">
    <a href="https://apps.apple.com/us/app/id1516993350">
      <div class="app-store btn-box">
        <icon class="app-icon" name="apple" />
        <div class="text-box">
          <span class="download-text">{{langAbbr=='zh-CN'?'海外版':'Download on the'}}</span>
          <span class="icon-text">App Store</span>
        </div>
      </div>
    </a>
    <router-link to="/course">
      <div class="app-store btn-box">
        <icon class="app-icon" name="apple" />
        <div class="text-box">
          <span class="download-text">{{langAbbr=='zh-CN'?'公测版':'Download on the'}}</span>
          <span class="icon-text">TestFlight</span>
        </div>
      </div>
    </router-link>

    <a href="https://play.google.com/store/apps/details?id=wikifx.wikibank">
      <div class="google btn-box" :style="{marginBottom: '0'}">
        <icon name="group" class="google-icon" />
        <div class="text-box">
          <span class="download-text">GET IT ON</span>
          <span class="icon-text">Google Play</span>
        </div>
      </div>
    </a>
    <a href="http://www.wikipay.net/download/WikiPayV1.0.3.apk">
      <div class="android btn-box">
        <icon class="and-icon" name="robot" />
        <div class="text-box">
          <span class="download-text">Download for</span>
          <span class="icon-text">Android APK</span>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import QRCode from "qrcode";
import "@/icons/group";
import "@/icons/apple";
import "@/icons/robot";
import "@/icons/qrcode";
import { mapGetters } from "vuex";
export default {
  name: "DownloadVersion",
  components: {
    QRCode,
  },
  data() {
    return {
      isActive: false,
      active: true,
      isShow: false,
    };
  },
  computed: {
    ...mapGetters(["langAbbr"]),
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.download-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 400px;

  a {
    text-decoration: none;
    &:nth-last-child(2) {
      .btn-box {
        margin-bottom: 0;
      }
    }
    &:last-child {
      .btn-box {
        margin-bottom: 0;
      }
    }
    .btn-box {
      display: flex;
      width: 160px;
      margin: 0 30px 30px 0;
      padding: 6px 0;
      justify-content: center;
      border-radius: 27px;
      border: 1px solid rgba(255, 255, 255, 1);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        background-color: white;
        .text-box,
        .app-icon,
        .google-icon,
        .and-icon {
          color: #333;
          fill: #333;
        }
      }
    }
  }
  .app-icon {
    display: inline-block;
    margin-top: 5px;
    width: 20px;
    height: 24px;
    fill: #fff;
    vertical-align: middle;
  }

  .and-icon {
    margin-top: 6px;
    width: 20px;
    height: 23px;
    fill: #fff;
    vertical-align: middle;
  }

  .google-icon {
    margin-top: 10px;
    width: 17px;
    height: 18px;
    fill: #fff;
    vertical-align: middle;
  }

  .text-box {
    margin-left: 10px;
    text-align: left;
    color: #fff;
  }

  .download-text {
    display: block;
    margin-top: -3px;
    font-size: 12px;
    transform: scale(0.8);
    transform-origin: 0 100%;
    line-height: 16px;
  }

  .icon-text {
    display: block;
    margin-top: 2px;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    vertical-align: middle;
  }
}
</style>
