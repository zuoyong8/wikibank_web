<template>
  <header class="header">
    <div class="header-left">
      <span class="website">
        <icon name="logo" class="logo-icon" />
        WikiPay {{$t('home.official')}}
      </span>
    </div>
    <div class="right">
      <!-- <div class="msg-tips">
          <div class="select-widget">
            <div class="select-val">
              <div class="message">
                <span class="msg-icon"></span>
                消息
              </div>
            </div>
            <div class="select-triangle"></div>
            <div class="select-list">
              <div class="msg-title">最近消息</div>
              <div class="msg-list">
                <div class="msg-item" v-for="item in messageList" :key="item.id">
                  <div class="msg-content">{{item.message}}</div>
                  <div class="msg-time">{{item.time}}</div>
                </div>
              </div>
              <div class="more">查看更多</div>
            </div>
          </div>
      </div>-->
      <!-- <div class="divide">|</div> -->
      <div class="user-tips">
        <div class="select-widget">
          <div class="select-val">
            <div class="username">
              <img :src="getAvatar" alt class="avatar-icon" />
              <span class="usertext">{{userInfo.lastName}}</span>
              <icon name="arrow" class="down-icon" />
            </div>
          </div>
          <div class="select-triangle"></div>
          <div class="select-list">
            <div class="user-content">
              <div class="user-title">
                <img :src="getAvatar" alt class="user-avar" />
                <div class="user-info">
                  <div class="name">{{userInfo.lastName}}</div>
                  <div class="tel">{{userInfo.userId}}</div>
                </div>
              </div>
              <div class="user-item" @click="goPerson">{{$t('home.identityAuth')}}</div>
              <div class="user-item" @click="goPerson">{{$t('home.account')}}&{{$t('home.safe')}}</div>
              <div class="user-item" @click="goPerson">
                <div class="contact">{{$t('personCenter.address')}}</div>
                <div class="count">{{userInfo.addressNum}}</div>
              </div>

              <div class="user-item" @click="logout">{{$t('home.logout')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="divide">|</div>
      <div class="language-tips">
        <div class="select-widget">
          <div class="select-val">
            <img :src="langFlag" alt class="flag-icon" />
            <span class="language">{{language}}</span>
            <icon name="arrow" class="down-icon" />
          </div>
          <div class="select-triangle"></div>
          <div class="select-list">
            <div
              class="select-language-item"
              v-for="item in languageList"
              :key="item.id"
              @click="getSelectVal(item)"
            >
              <img :src="item.flag" alt class="flag-icon" />
              <span class="lang-text">{{item.lang}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="divide">|</div>
      <div class="money-tips">
        <div class="select-widget">
          <div class="select-val">
            <div class="money">
              <img :src="flag" alt class="flag-icon" />
              <span class="money-text">{{$t("coin." +name)}} ({{symbol}})</span>
              <icon name="arrow" class="down-icon" />
            </div>
          </div>
          <div class="select-triangle"></div>
          <div class="select-list">
            <div
              class="money-item"
              v-for="item in coinList"
              :key="item.id"
              @click="getCoinAbbr(item.coinName ,item.coinSymbol, item.coinAbbre, item.coinFlag)"
            >
              <img :src="item.coinFlag" alt class="flag-icon" />
              <span class="lang-text">{{$t("coin."+item.coinName)}} {{item.coinSymbol}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import axios from "@/api/request";
import "@/icons/arrow";
import "@/icons/logo";
export default {
  name: "Navbar",
  components: {},
  data() {
    return {
      width: "200px",
      firstName: "",
      lastName: "",
      avatar: "", //头像,
      currId: 1,
      currSubId: 0,
      isShow: false,
      itemHeight: 0,
      avatarIcon: require("../../assets/imgs/flag_icon_20200526.png"),
      rightArrow: require("../../assets/imgs/right_arrow_20200525.png"),
      downIcon: require("../../assets/imgs/down_icon_20200525.png"),
      coinList: [
        {
          id: 1,
          coinName: "pub_currency_cny",
          coinSymbol: "¥",
          coinAbbre: "CNY",
          coinFlag:
            "https://img.wikifx.com/flag/7d8833382673bab2/CN.png_wiki-template-global",
        },
        {
          id: 2,
          coinName: "pub_currency_usd",
          coinSymbol: "$",
          coinAbbre: "USD",
          coinFlag:
            "https://img.wikifx.com/flag/adaa5e0b8a65a672/US.png_wiki-template-global",
        },
        {
          id: 3,
          coinName: "pub_currency_jpy",
          coinSymbol: "￥",
          coinAbbre: "JPY",
          coinFlag:
            "https://img.wikifx.com/flag/afb23edb45c6c8cf/JP.png_wiki-template-global",
        },
        {
          id: 4,
          coinName: "pub_currency_krw",
          coinSymbol: "₩",
          coinAbbre: "KRW",
          coinFlag:
            "https://img.wikifx.com/flag/66dbd0d47a2b876c/KR.png_wiki-template-global",
        },
        {
          id: 5,
          coinName: "pub_currency_gbp",
          coinSymbol: "£",
          coinAbbre: "GBP",
          coinFlag:
            "https://img.wikifx.com/flag/52c9e8fc8d7d65f6/UK.png_wiki-template-global",
        },
        {
          id: 6,
          coinName: "pub_currency_eur",
          coinSymbol: "€",
          coinAbbre: "EUR",
          coinFlag:
            "https://img.wikifx.com/flag/bff59f293f0e9019/EU.png_wiki-template-global",
        },
        {
          id: 7,
          coinName: "pub_currency_aud",
          coinSymbol: "A$",
          coinAbbre: "AUD",
          coinFlag:
            "https://img.wikifx.com/flag/045fe4098d24356d/AU.png_wiki-template-global",
        },
        {
          id: 8,
          coinName: "pub_currency_cad",
          coinSymbol: "C$",
          coinAbbre: "CAD",
          coinFlag:
            "https://img.wikifx.com/flag/b4b32b9e9479f387/CA.png_wiki-template-global",
        },
        {
          id: 9,
          coinName: "pub_currency_hkd",
          coinSymbol: "HK$",
          coinAbbre: "HKD",
          coinFlag:
            "https://img.wikifx.com/flag/ccc558d92f93bcf8/HK.png_wiki-template-global",
        },
        {
          id: 10,
          coinName: "pub_currency_sgd",
          coinSymbol: "S$",
          coinAbbre: "SGD",
          coinFlag:
            "https://img.wikifx.com/flag/a3b71275d25ab1b4/SG.png_wiki-template-global",
        },
        {
          id: 11,
          coinName: "pub_currency_rub",
          coinSymbol: "₽",
          coinAbbre: "RUB",
          coinFlag:
            "https://img.wikifx.com/flag/a51a924ab68d9812/BY.png_wiki-template-global",
        },
        {
          id: 12,
          coinName: "pub_currency_vnd",
          coinSymbol: "₫",
          coinAbbre: "VND",
          coinFlag: "https://img.wikifx.com/flag/5617a7f7260ccb29/VN.png_wiki-template-global"
        },
        {
          id: 13,
          coinName: "pub_currency_thb",
          coinSymbol: "฿",
          coinAbbre: "THB",
          coinFlag: "https://img.wikifx.com/flag/a7c2bd12dd2df53c/TH.png_wiki-template-global"
        },
        {
          id: 14,
          coinName: "pub_currency_myr",
          coinSymbol: "RM",
          coinAbbre: "MYR",
          coinFlag: "https://img.wikifx.com/flag/dded20f8b8d376dd/MY.png_wiki-template-global"
        },
        {
          id: 15,
          coinName: "pub_currency_idr",
          coinSymbol: "Rp",
          coinAbbre: "IDR",
          coinFlag: "https://img.wikifx.com/flag/73e04ce3ec720dd1/ID.png_wiki-template-global"
        }
      ],
      userList: [
        {
          id: 1,
          info: "身份认证",
        },
        {
          id: 2,
          info: "邮箱账号",
        },
        {
          id: 3,
          info: "联系人",
        },
        {
          id: 4,
          info: "地址簿",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      language: "language",
      langAbbr: "langAbbr",
      langFlag: "langFlag",
      languageList: "languageList",
      name: "coinName",
      symbol: "coinSymbol",
      addre: "coinAbbre",
      flag: "coinFlag",
      rate: "rate",
      userInfo: "userInfo",
      navActive: "navActive",
      flagList: "flagList",
      areaFlag: "areaFlag",
      areaCode: "areaCode",
    }),
    ...mapGetters(["getTel", "getAvatar"]),
  },
  methods: {
    ...mapMutations([
      "changeAssetStatus",
      "changeLanguage",
      "changeNav",
      "getFlags",
      "changeAreaName",
    ]),
    ...mapActions(["changeCoin", "getUserInfo"]),
    goPerson() {
      this.$router.push({ path: "/console/user" });
      this.changeNav(3);
    },
    // 退出
    logout() {
      localStorage.setItem("Authorization", "");
      localStorage.setItem("isShowAsset", "");
      localStorage.setItem("navActive", "");
      this.changeAssetStatus("show");
      localStorage.setItem("coinAbbre", this.addre);
      localStorage.setItem("coinName", this.name);
      localStorage.setItem("coinSymbol", this.symbol);
      localStorage.setItem("coinFlag", this.flag);
      localStorage.setItem("coinRate", this.rate);
      
      location.href = "/login";
      this.$Message.success(this.$t("home.logout"));
    },
    // 选择语言
    getSelectVal(item) {
      this.$i18n.locale = item.value;
      this.$store.commit("changeLanguage", item);
      this.getFlags();
      this.changeAreaName({ flag: this.areaFlag, code: this.areaCode, countryCode: item.countryCode });
    },
    // 选择货币种类
    getCoinAbbr(name, symbol, abbre, flag) {
      this.changeCoin({ name: name, symbol, abbre, flag });
    }
  },
  async mounted() {
    // 获取个人信息
    await this.getUserInfo();
  },
};
</script>
<style lang="scss" scoped>
@import "@/style/tooltips.scss";
.header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  background: rgba(28, 47, 98, 1);
  height: 40px;
  line-height: 40px;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  z-index: 11;

  .header-left {
    margin-left: 4px;
    color: #fff;
    .website {
      color: #fff;
      text-decoration: none;
    }

    .website,
    .divide,
    .language-tips,
    .money {
      display: inline-block;
    }

    .divide {
      opacity: 0.3;
    }

    .website {
      padding: 0 24px;
      cursor: pointer;
      opacity: 0.89;
      transition: all 0.2s ease-out;

      &:hover {
        opacity: 1;
        // background: rgba(0, 0, 0, 0.19);
      }
    }

    .logo-icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 11px;
      margin-bottom: 3px;
      fill: #fff;
    }
  }

  .right {
    text-align: right;
    color: #fff;

    .divide {
      opacity: 0.3;
    }
    .language-tips {
      display: inline-block;
      .select-widget {
        @include select-widget();

        .select-val {
          padding: 0 24px;
          @include select-val();
          width: 182px;
          text-align: center;
          .language {
            // width: 90px;
            display: inline-block;
            text-align: center;
            margin: 0 10px;
          }
        }

        .select-triangle {
          @include select-triangle();
        }

        .select-list {
          @include select-list($w: 150px);
        }
      }
    }
    .flag-icon {
      width: 21px;
      height: 14px;
      vertical-align: middle;
    }
    .money-text {
      display: inline-block;
      // width: 88px;
      text-align: center;
      margin: 0 10px;
    }
    .down-icon {
      display: inline-block;
      width: 8px;
      height: 4px;
      transform: rotate(0);
      transition: all 0.2s ease;
      fill: #fff;
      vertical-align: middle;
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
    .money-tips {
      display: inline-block;
      .select-widget {
        @include select-widget();

        .select-val {
          padding: 0 24px;
          @include select-val();
          .money {
            min-width: 130px;
            text-align: center;
          }
        }

        .select-triangle {
          @include select-triangle();
        }

        .select-list {
          @include select-list($w: 210px, $h: 300px);
          .money-item {
            padding: 12px 0 12px 24px;
            text-align: left;
            color: #333;
            font-size: 14px;
            -webkit-transition: all 0.3s ease-out;
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
              vertical-align: middle;
              margin-right: 10px;
            }
            .lang-text {
              vertical-align: middle;
            }
          }
        }
      }
    }
    .msg-tips {
      display: inline-block;
      .select-widget {
        @include select-widget();

        .select-val {
          @include select-val();
        }

        .select-triangle {
          @include select-triangle();
        }

        .select-list {
          @include select-list(396px, auto, 16px 0);
        }
      }
    }
    .message,
    .divide,
    .username,
    .logout {
      display: inline-block;
    }

    .avatar-icon {
      width: 22px;
      height: 22px;
      border-radius: 4px;
    }
    .username .usertext {
      margin: 0 10px;
    }

    .message,
    .username,
    .logout {
      padding: 0 24px;
      cursor: pointer;
      opacity: 0.89;
      transition: all 0.2s ease-out;

      &:hover {
        opacity: 1;
        // background: rgba(0, 0, 0, 0.19);
      }
    }

    .msg-title {
      padding: 10px 24px;
      font-size: 14px;
      color: #b7b7b7;
      line-height: normal;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }

    .msg-content {
      font-size: 13px;
      color: #333333;
      margin-bottom: 5px;
    }
    .msg-list {
      height: 345px;
      border-bottom: 1px solid #f0f0f0;
      .msg-item {
        padding: 15px 24px;
        font-size: 12px;
        color: #b7b7b7;
        line-height: normal;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
        transition: all 0.2s ease-out;

        &:hover {
          background: #f4f7fa;

          .msg-content {
            color: #3674d7;
          }
        }
      }
    }

    .msg-icon,
    .logout-icon {
      display: inline-block;
      width: 16px;
      height: 15px;
      vertical-align: middle;
      mask-repeat: no-repeat;
      background: #fff;
      margin-right: 11px;
    }

    .more {
      text-align: center;
      padding: 13px 0 0;
      font-size: 13px;
      color: #333333;
      line-height: normal;
      &:hover {
        color: #3674d7;
      }
    }
    .user-tips {
      display: inline-block;
      .select-widget {
        @include select-widget();

        .select-val {
          @include select-val();
        }

        .select-triangle {
          @include select-triangle();
        }

        .select-list {
          @include select-list(200px, auto, 16px 0 0);
        }
      }
    }
    .user-content {
      line-height: normal;
      .user-title {
        display: flex;
        align-items: center;
        padding: 12px 26px 24px;
        line-height: normal;
        text-align: left;
        .user-avar {
          width: 34px;
          height: 34px;
          border-radius: 4px;
        }
        .user-info {
          margin-left: 10px;
          color: #333;
          font-size: 14px;
          .tel {
            color: #b7b7b7;
          }
        }
      }
      .user-item {
        display: flex;
        padding: 15px 24px;
        font-size: 12px;
        color: #333;
        line-height: normal;
        text-align: left;
        border-top: 1px solid #f0f0f0;
        transition: all 0.2s ease-out;
        text-decoration: none;
        &:hover {
          background: #f4f7fa;
          color: #3674d7;
        }
        .contact,
        count {
          flex: 1;
        }
        .count {
          text-align: right;
          color: #999999;
          font-size: 13px;
          &:hover {
            color: #3674d7;
          }
        }
      }
    }

    .msg-icon {
      mask-image: url("../../assets/imgs/ding_svg_20200526.svg");
    }

    .logout-icon {
      mask-image: url("../../assets/imgs/logout_svg_20200526.svg");
    }
  }
}
</style>