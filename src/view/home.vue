<template>
  <div class="home">
    <Header></Header>
    <div class="home-bg">
      <div class="banner">
        <div class="info">
          <div class="title">{{$t('homePage.MultipleScenesPayment')}}</div>
          <div class="summary">{{$t('homePage.MakeGlobalPaymentsEasier')}}</div>
          <div>
            <DownloadVersion />
          </div>
        </div>
        <div class="img">
          <img :src="appPageIcon" alt class="app-page" />
          <a href="/login" class="login">
            {{$t("login.login")}}
          </a>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="section">
        <div class="summary">
          <div class="title">{{$t('homePage.DigitalWallet')}}</div>
          <div class="split-line"></div>
          <div class="desc animate-fade">{{$t('homePage.SupportmainstreamDigitalAssets')}}</div>
        </div>
        <div class="picture animate-fade">
          <img src="@/assets/imgs/home_wallet.png" alt class="wallet-pic" />
        </div>
      </div>
      <div class="section-wrap">
        <div class="section">
          <div class="picture" ref="section2-pic">
            <img src="@/assets/imgs/home_account.png" alt class="wallet-pic" />
          </div>
          <div class="summary">
            <div class="title" ref="section2-title">{{$t('homePage.USDAccount')}}</div>
            <div class="split-line"></div>
            <div class="desc" ref="section1-desc">{{$t('homePage.WorldsFirstWallet')}}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="summary">
          <div class="title" ref="section3-title">{{$t('homePage.InstantMessaging')}}</div>
          <div class="split-line"></div>
          <div class="desc" ref="section3-title">{{$t('homePage.InterFriendsTransfers')}}</div>
        </div>
        <div class="picture" ref="section3-pic">
          <img src="@/assets/imgs/home_im.png" alt class="wallet-pic" />
        </div>
      </div>
      <div class="section-wrap">
        <div class="section">
          <div class="picture" ref="section4-pic">
            <img src="@/assets/imgs/home_visa.png" alt class="wallet-pic" />
          </div>
          <div class="summary">
            <div class="title" ref="section4-title">{{$t('homePage.VISAPayment')}}</div>
            <div class="split-line"></div>
            <div class="desc" ref="section4-desc">{{$t('homePage.CrossBorderPayment')}}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="summary">
          <div class="title" ref="section5-title">{{$t('homePage.DigitalAssetPaymentService')}}</div>
          <div class="split-line"></div>
          <div class="desc" ref="section5-desc">
            {{$t('homePage.MultiplePartners')}}
            {{$t('homePage.CreateScenarios')}}
          </div>
        </div>
        <div class="picture" ref="section5-pic">
          <img src="@/assets/imgs/home_digital.png" alt class="wallet-pic" />
        </div>
      </div>
      <div class="section-wrap">
        <div class="section">
          <div class="picture" ref="section6-pic">
            <img src="@/assets/imgs/home_safety.png" alt class="wallet-pic" />
          </div>
          <div class="summary">
            <div class="title" ref="section6-title">{{$t('homePage.MultipleAssetGuarantees')}}</div>
            <div class="split-line"></div>
            <div class="desc" ref="section6-desc">
              {{$t('homePage.CloudKeyManagementSupports')}}
              {{$t('homePage.MultipleEncryption')}}
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="summary">
          <div class="title" ref="section7-title">{{$t('homePage.DailyIncome')}}</div>
          <div class="split-line"></div>
          <div
            class="desc"
            ref="section7-desc"
          >{{$t('homePage.DailyIncomeInUSDAccount')}}{{$t('homePage.FlexibleWithdrawal')}}</div>
        </div>
        <div class="picture" ref="section7-pic">
          <img src="@/assets/imgs/home_benefit.png" alt class="wallet-pic" />
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="section">
        <div class="info-list">
          <div class="info-item">
            <img :src="logo" alt class="logo" />
            <!--全球化数字支付方式-->
          </div>
          <div class="info-item">
            <div class="title">{{$t('homePage.Company')}}</div>
            <div class="menu"></div>
            <div class="menu" @click="goService">{{$t('homePage.ServiceAgreement')}}</div>
            <div class="menu" @click="goPrivacy">{{$t('homePage.PrivacyAgreement')}}</div>
          </div>

          <div class="info-item">
            <div class="title">{{$t('homePage.Business')}}</div>
            <div class="menu"></div>
            <div class="menu">{{$t('homePage.AccessAPI')}}</div>
            <div class="menu">{{$t('homePage.ServiceFee')}}</div>
          </div>

          <div class="info-item">
            <div class="title">{{$t('homePage.Contact')}}</div>
            <div class="menu">service@WikiPay.com</div>
            <div class="title"></div>
            <div class="menu">business@WikiPay.com</div>
          </div>
          <!-- <div class="info-item"></div> -->
        </div>
      </div>
      <div class="copyright">{{$t('homePage.Copyright')}}</div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import DownloadVersion from "./components/DownloadVersion";
import { addClass } from "@/utils/index.js";
import axios from "@/api/request";
import { mapState } from "vuex";
export default {
  name: "",
  components: {
    Header,
    DownloadVersion,
  },
  data() {
    return {
      logo: require("./components/header/images/logo_icon_20200525.png"),
      appIcon: require("../assets/login/20200810.png"),
      testFlightIcon: require("../assets/login/20200811.png"),
      googleIcon: require("../assets/login/20200812.png"),
      androidIcon: require("../assets/login/20200813.png"),
      appPageIcon: require("../assets/login/home_mobile_20200817.png"),
      walletIcon: require("../assets/imgs/home_wallet.png"),
      service: "",
      secret: "",
    };
  },
  computed: {
    ...mapState(["langAbbr"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    for (let k in this.$refs) {
      let dom = this.$refs[k];
      dom.style.opacity = 0;
    }
    this.getConfigInfo();
  },
  methods: {
    handleScroll() {
      let scroll = document.body.clientHeight;
      for (let k in this.$refs) {
        let dom = this.$refs[k];
        if (!dom) continue;
        let domTop = dom.getBoundingClientRect().top;
        if (scroll - domTop > 100) {
          addClass(dom, "animate-fade");
        }
      }
    },

    async getConfigInfo() {
      let { langAbbr } = this;
      const ser = {
        key: `service_${langAbbr}`,
      };
      const sec = {
        key: `secret_${langAbbr}`,
      };
      let res = await axios.getConfigInfo(ser);
      this.service = res.data[0].value;
      let result = await axios.getConfigInfo(sec);
      this.secret = result.data[0].value;
    },

    goService() {
      location.href = this.service;
    },
    goPrivacy() {
      location.href = this.secret;
    },
  },
};
</script>

<style lang="scss" scoped>
$common-width: 1200px;

.home {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
  }

  .home-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      to left,
      rgba(30, 48, 102, 1),
      rgba(11, 20, 47, 1)
    );
    margin-top: 49px;
    .banner {
      margin-top: 56px;
      margin: 0 auto;
      width: $common-width;
      // min-width: $common-width;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      .info {
        width: 548px;

        .title {
          font-size: 36px;
          line-height: 40px;
          color: #fff;
          font-weight: bold;
          margin-bottom: 25px;
          opacity: 0;
          animation: fadeInUp 1.5s ease forwards;
        }

        .summary {
          font-size: 21px;
          color: #fff;
          margin-bottom: 73px;
          opacity: 0;
          animation: fadeInUp 1.5s 0.3s ease forwards;
        }

        .download-btn {
          width: 160px;
          text-align: center;
          display: inline-block;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 1);
          margin-right: 30px;
          padding: 8px 0;
          cursor: pointer;
          opacity: 0.9;

          &:hover {
            opacity: 1;
          }

          .icon {
            width: 18px;
            margin-right: 5px;
          }

          .download-text {
            display: inline-block;
            vertical-align: middle;
            text-align: left;
            line-height: 16px;

            .download-tips {
              font-size: 10px;
              color: #fff;
            }

            .download-addr {
              font-size: 16px;
              color: #fff;
            }
          }
        }
      }

      .img {
        text-align: right;
        .app-page {
          display: block;
          margin-bottom: 27px;
          margin-right: -95px;
          width: 494px;
          height: 453px;
          opacity: 0;
          animation: fadeInLeft 1.5s ease forwards;
        }
        .login {
          position: relative;
          margin-right: 6px;
          margin-bottom: 75px;
          display: inline-block;
          transition: all .2s linear;
          padding: 18px 0;
          background: url('../assets/login/login_bg_20200907.png')no-repeat;
          background-size: cover;
          // background: radial-gradient(circle, rgba(255, 233, 18, 1), rgba(255, 235, 139, 1));
          border-radius: 4px;
          color: #222;
          font-size: 18px;
          cursor: pointer;
          font-weight: 500;
          font-family: PingFangSC-Medium, PingFang SC;
          text-decoration: none;
          width: 244px;
          text-align: center;
          overflow: hidden;
          // animation: dark 2s ease-out infinite;
          &:hover {
            // opacity: 1;
            box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.2);
          }
          &::before {
            position: absolute;
            content: "";
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border: 3px solid #fff;
            animation: light 1.5s linear infinite;
          }
        }
        @keyframes dark {
          0%{
            background: rgba(255, 233, 18, 1);
          }
          50% {
            background: rgba(255, 235, 139, 1);
          }
          100%{
            background: rgba(255, 233, 18, 1);
          }
        }
        @keyframes light {
          0%, 100%{
            clip: rect(0, 244px, 2px, 0);
          }
          25% {
            clip: rect(0, 244px, 60px, 242px);
          }
          50% {
            
            clip: rect(58px, 242px, 242px, 0);
          }
          75% {
            clip: rect(0, 2px, 60px, 0);
          }
        }

      }
    }
  }

  .main {
    .section-wrap {
      background: #f9fafb;

      .picture {
        text-align: left !important;
      }
    }

    .section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 100px 0;
      width: $common-width;
      // min-width: $common-width;
      margin: 0 auto;

      .begin-animate {
        animation: fadeInUp 1.5s ease forwards;
      }

      .summary {
        flex: 1;

        .title {
          font-size: 32px;
          color: #202028;
          font-weight: 600;
          line-height: 60px;
        }

        .split-line {
          width: 59px;
          height: 4px;
          background: rgba(54, 116, 215, 1);
          border-radius: 1px;
          margin-top: 40px;
        }

        .desc {
          font-size: 18px;
          color: #71797e;
          margin-top: 26px;
          line-height: 33px;
        }
      }

      .picture {
        flex: 1;
        text-align: center;

        .wallet-pic {
          max-width: 400px;
        }
      }
    }
  }

  .footer {
    background: #1c2f62;

    .section {
      width: 1200px;
      // min-width: $common-width;
      margin: 0 auto;

      .info-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 0;

        .info-item {
          text-align: left;
          font-size: 14px;
          color: #fff;

          .logo {
            display: block;
            width: 132px;
            height: 32px;
            margin-bottom: 8px;
          }

          .title {
            font-size: 12px;
            font-weight: 400;
            opacity: 0.89;
            margin-bottom: 16px;
          }

          .menu {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 16px;
            cursor: pointer;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .copyright {
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      text-align: center;
      opacity: 0.5;
      font-size: 12px;
      font-weight: 400;
      font-weight: 400;
      opacity: 0.5;
      padding: 10px 0;
    }
  }
}

@media screen and (max-width: 1200px) {
  .home .home-bg .banner .info .title {
    font-size: 32px;
  }

  .home .home-bg .banner .info .summary {
    font-size: 18px;
  }
  .home .home-bg .banner {
    width: 992px;
  }
  .home .main .section {
    width: 992px;  
  }
  .home .footer .section {
    width: 992px;
  }
}

.animate-fade {
  animation: fadeInUp 1.5s forwards;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -60px, 0);
    transform: translate3d(0, -60px, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 60px, 0);
    transform: translate3d(0, 60px, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes scaleInSmall {
  0% {
    opacity: 0.8;
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;

    transform: translate3d(20%, 0, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
