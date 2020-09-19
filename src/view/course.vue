<template>
  <div class="course layout">
    <Header></Header>
    <div class="banner">
      <div class="banner-content content">
        <div class="banner-info">
          <img src="../assets/imgs/course_logo.png" alt class="logo" />
          <h3 class="banner-title">{{$t('course.digitalWallet')}}</h3>
          <p class="banner-intro">{{$t('course.provideServies')}}</p>
        </div>
      </div>
      <div class="banner-code">
        <img src="../assets/imgs/course_code.png" alt class="code-bg" />
        <img src="../assets/imgs/course_person.png" alt class="person" />
        <div class="code-box">
          <canvas id="qrcode" />
          <div class="text" :class="{'en-text': langAbbr == 'en'}">{{$t('course.scanQrcode')}}</div>
        </div>
      </div>
    </div>
    <div class="plan-wrapper content">
      <section class="plan">
        <div class="title">
          <h4>{{$t('course.firstSolution')}}</h4>
          <p>{{$t('course.testFlightInstall')}}</p>
        </div>
        <div class="plan-content">
          <div class="group">
            <img :src="imgShow.plan1_img1" alt />
            <p class="step">{{ $t('course.testStep1')}}</p>
          </div>
          <div class="group">
            <img :src="imgShow.plan1_img2" alt />
            <p class="step">{{ $t('course.testStep2')}}</p>
          </div>
          <div class="group">
            <img :src="imgShow.plan1_img3" alt />
            <p class="step">{{ $t('course.testStep3')}}</p>
          </div>
        </div>
      </section>
      <section class="plan">
        <div class="title">
          <h4>{{$t('course.secondSolution')}}</h4>
          <p>{{$t('course.foreign')}}</p>
        </div>
        <div class="plan-content">
          <div class="group">
            <img :src="imgShow.plan2_img1" alt />
            <p class="step">{{ $t('course.outStep1')}}</p>
          </div>
          <div class="group">
            <img :src="imgShow.plan2_img2" alt />
            <p class="step">{{ $t('course.outStep2')}}</p>
          </div>
          <div class="group">
            <img :src="imgShow.plan2_img3" alt />
            <p class="step">{{ $t('course.outStep3')}}</p>
          </div>
          <div class="group">
            <img :src="imgShow.plan2_img4" alt />
            <p class="step">{{ $t('course.outStep4')}}</p>
          </div>
          <div class="group table">
            <div class="account-table">
              <p class="head row">
                <span class="account-id">Apple ID</span>
                <span class="pwd">{{ $t('course.Pwd')}}</span>
              </p>
              <p class="row" v-for="(item, index) in accountList" :key="index">
                <span class="account-id">{{ item.account }}</span>
                <span class="pwd">{{ item.pwd }}</span>
              </p>
            </div>
            <p class="step">{{ $t('course.outStep5')}}</p>
          </div>
        
        </div>
      </section>
    </div>
    <footers></footers>
  </div>
</template>
<script>
import QRCode from "qrcode";

import Header from "./components/Header";
import footers from "./components/footers";
import { mapGetters } from "vuex";

export default {
  components: { QRCode, Header, footers },
  data() {
    return {
      imgShow: {},
      imgList: {
        "zh-CN": {
          plan1_img1: require("../assets/imgs/plan1_img1_cn.png"),
          plan1_img2: require("../assets/imgs/plan1_img2_cn.png"),
          plan1_img3: require("../assets/imgs/plan1_img3_cn.png"),
          plan2_img1: require("../assets/imgs/plan2_img1_cn.png"),
          plan2_img2: require("../assets/imgs/plan2_img2_cn.png"),
          plan2_img3: require("../assets/imgs/plan2_img3_cn.png"),
          plan2_img4: require("../assets/imgs/plan2_img4_cn.png"),
        },
        "zh-HK": {
          plan1_img1: require("../assets/imgs/plan1_img1_hk.png"),
          plan1_img2: require("../assets/imgs/plan1_img2_hk.png"),
          plan1_img3: require("../assets/imgs/plan1_img3_hk.png"),
          plan2_img1: require("../assets/imgs/plan2_img1_hk.png"),
          plan2_img2: require("../assets/imgs/plan2_img2_hk.png"),
          plan2_img3: require("../assets/imgs/plan2_img3_hk.png"),
          plan2_img4: require("../assets/imgs/plan2_img4_hk.png"),
        },
        "zh-TW": {
          plan1_img1: require("../assets/imgs/plan1_img1_hk.png"),
          plan1_img2: require("../assets/imgs/plan1_img2_tw.png"),
          plan1_img3: require("../assets/imgs/plan1_img3_hk.png"),
          plan2_img1: require("../assets/imgs/plan2_img1_hk.png"),
          plan2_img2: require("../assets/imgs/plan2_img2_hk.png"),
          plan2_img3: require("../assets/imgs/plan2_img3_hk.png"),
          plan2_img4: require("../assets/imgs/plan2_img4_hk.png"),
        },
        en: {
          plan1_img1: require("../assets/imgs/plan1_img1_en.png"),
          plan1_img2: require("../assets/imgs/plan1_img2_en.png"),
          plan1_img3: require("../assets/imgs/plan1_img3_en.png"),
          plan2_img1: require("../assets/imgs/plan2_img1_en.png"),
          plan2_img2: require("../assets/imgs/plan2_img2_en.png"),
          plan2_img3: require("../assets/imgs/plan2_img3_en.png"),
          plan2_img4: require("../assets/imgs/plan2_img4_en.png"),
        },
        th: {
          plan1_img1: require("../assets/imgs/plan1_img1_th.png"),
          plan1_img2: require("../assets/imgs/plan1_img2_th.png"),
          plan1_img3: require("../assets/imgs/plan1_img3_th.png"),
          plan2_img1: require("../assets/imgs/plan2_img1_th.png"),
          plan2_img2: require("../assets/imgs/plan2_img2_th.png"),
          plan2_img3: require("../assets/imgs/plan2_img3_th.png"),
          plan2_img4: require("../assets/imgs/plan2_img4_th.png"),
        },
        vi: {
          plan1_img1: require("../assets/imgs/plan1_img1_vi.png"),
          plan1_img2: require("../assets/imgs/plan1_img2_vi.png"),
          plan1_img3: require("../assets/imgs/plan1_img3_vi.png"),
          plan2_img1: require("../assets/imgs/plan2_img1_vi.png"),
          plan2_img2: require("../assets/imgs/plan2_img2_vi.png"),
          plan2_img3: require("../assets/imgs/plan2_img3_vi.png"),
          plan2_img4: require("../assets/imgs/plan2_img4_vi.png"),
        },
      },
      accountList: [
        {
          account: "qymjds@163.com",
          pwd: "Aw112211",
        },
        {
          account: "hlvecv@163.com",
          pwd: "Aw112211",
        },
        {
          account: "lhpebv@163.com",
          pwd: "Aw112211",
        },
        {
          account: "lashxy@163.com",
          pwd: "Aw112211",
        },
        {
          account: "znpcrl@163.com",
          pwd: "Aw112211",
        },
        {
          account: "xuiiyt@163.com",
          pwd: "Aw112211",
        },
        {
          account: "ugizfs@163.com",
          pwd: "Aw112211",
        },
        {
          account: "mccihl@163.com",
          pwd: "Aw112211",
        },
        {
          account: "rbyonr@163.com",
          pwd: "Aw112211",
        },
        {
          account: "zedkga@163.com",
          pwd: "Aw112211",
        },
      ],
    };
  },
  mounted() {
    this.createQrocde();
    this.imgShow = this.imgList[this.langAbbr];
  },
  computed: {
    ...mapGetters(["langAbbr"]),
  },
  watch: {
    langAbbr(val) {
      this.imgShow = this.imgList[val];
    },
  },
  methods: {
    createQrocde() {
      let qrcode = document.querySelector("#qrcode");
      QRCode.toCanvas(qrcode, "http://m.wikipay.net/download", {
        width: 162,
        height: 162,
      });
    },
  },
};
</script>
<style lang="scss">
.course {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
  }
   .login-btn{
    display: inline-block!important;
  }
  .footer {
    position: relative !important;
    box-shadow: none !important;
  }
  .content {
    margin: 0 auto;
    width: 1200px;
  }

  .banner {
    position: relative;
    height: 500px;
    background-image: linear-gradient(to right, #0b142f, #234b9e);
    background-size: 100% 100%;
  }

  .banner-content {
    position: relative;
    display: flex;
    height: 100%;
    align-items: center;
  }

  .banner-info {
    width: 500px;
    color: #fff;

    .logo {
      height: 55px;
    }
    .banner-title {
      margin: 50px 0 0 0;
      font-size: 30px;
      font-weight: normal;
    }
    .banner-intro {
      margin: 35px 0 0;
      font-size: 18px;
      line-height: 35px;
      color: rgba(255, 255, 255, 0.92);
    }
  }

  .banner-code {
    position: absolute;
    bottom: -1px;
    right: -1px;
    height: calc(100% - 50px);

    .code-bg {
      display: block;
      height: 100%;
    }

    .person {
      position: absolute;
      bottom: -39px;
      left: 49px;
      width: 200px;
    }

    .code-box {
      position: absolute;
      top: 230px;
      left: 265px;

      #qrcode {
        display: block;
        width: 100%;
      }

      .text {
        position: relative;
        margin-top: -10px;
        width: 162px;
        font-size: 14px;
        text-align: center;
        z-index: 99;
        &.en-text{
          font-size: 12px;
          line-height: 12px;
        }
      }
    }
  }

  .plan {
    padding: 80px 0 80px;
    background: #fff;

    &:last-child {
      background: #f9fafb;
    }

    .title {
      text-align: center;

      h4 {
        display: inline-block;
        position: relative;
        margin: 0;
        padding: 20px;
        font-size: 30px;
        color: #202028;
        &::before {
          position: absolute;
          left: calc(50% - 30px);
          bottom: 0;
          width: 60px;
          content: "";
          border-radius: 2px;
          border-bottom: 4px solid #3674d7;
        }
      }

      p {
        margin: 20px 0;
        font-size: 16px;
        color: #71797e;
      }
    }

    .plan-content {
      margin-top: 74px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .group {
        margin: 0 40px 40px;
        width: 240px;
        font-size: 14px;
        color: #999999;
        &.table {
          width: 680px;
        }

        img {
          margin: 0 auto;
          width: 220px;
        }

        .step {
          margin: 30px 0 10px;
          line-height: 25px;
        }

        .step-intro {
          line-height: 25px;
        }
      }
    }
  }
  .account-table {
    margin: 0 auto 30px;
    width: 100%;
    border: 1px solid #3674d7;
    border-radius: 4px;
    overflow: hidden;

    .head {
      margin: 0;
      color: #fff !important;
      background: #3674d7;

      .account-id {
        border-right: 1px solid rgba(255, 255, 255, 0.5) !important;
      }
    }

    .row {
      display: flex;
      margin: 0;
      flex-wrap: nowrap;
      color: #333;
      text-align: center;
      border-bottom: 1px solid rgba(54, 116, 215, 0.5);
      &:last-child {
        border: none;
      }
      span {
        display: block;
        padding: 12px;
        font-size: 14px;
        box-sizing: border-box;
      }
      .account-id {
        width: 50%;
        word-break: break-all;
        border-right: 1px solid rgba(54, 116, 215, 0.5);
      }
      .pwd {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>