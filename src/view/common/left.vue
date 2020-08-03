
<template>
  <!-- 内页 -->
  <div class="layout">
    <header class="header">
      <div class="header-left">
        <div class="website">
          <span class="logo-icon"></span>
          WikiPay 官网
        </div>
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
                {{userInfo.lastName}}
                <img
                  :src="downIcon"
                  alt
                  class="down-icon"
                />
              </div>
            </div>
            <div class="select-triangle"></div>
            <div class="select-list">
              <div class="user-content">
                <div class="user-title">
                  <img :src="getAvatar" alt class="user-avar" />
                  <div class="user-info">
                    <div class="name">{{userInfo.lastName}}</div>
                    <div class="tel">{{getTel}}</div>
                  </div>
                </div>
                <router-link :to="{path: '/console/user'}" class="user-item">
                  身份认证
                </router-link>
                <router-link :to="{path: '/console/user'}" class="user-item">
                  账户&安全
                </router-link>
                <div class="user-item">
                  <div class="contact">地址薄</div>
                  <div class="count">{{userInfo.addressNum}}</div>
                </div>

                <div class="user-item" @click="logout">退出登录</div>
              </div>
            </div>
          </div>
        </div>
        <div class="divide">|</div>
        <div class="language-tips">
          <div class="select-widget">
            <div class="select-val">
              <img :src="flagIcon" alt class="flag-icon" />
              {{defaultLang}}
              <img :src="downIcon" alt class="down-icon" />
            </div>
            <div class="select-triangle"></div>
            <div class="select-list">
              <div
                class="select-language-item"
                v-for="item in languageList"
                :key="item.id"
                @click="getSelectVal(item.lang)"
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
                <img :src="coinFlag" alt class="flag-icon" />
                <span class="money-text">{{coinName}} ({{coinSymbol}}) </span>
                <img
                  :src="downIcon"
                  alt
                  class="down-icon"
                />
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
                {{item.coinName}} {{item.coinSymbol}}
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="logout" @click="logout">
          <span class="logout-icon"></span>
          退出账号
        </div>-->
      </div>
    </header>

    <div class="left">
      <div class="menu">
        <div class="menu-list active" v-for="item in pathList" :key="item.id">
          <div :class=" item.id === currId && item.children.length === 0 ?　'active-bar':''"></div>
          <div
            class="menu-item"
            :class=" item.id === currId && item.children.length === 0 ?　'active':''"
            @click="swictchPath(item.id, item.path, item.children)"
          >
            <div :class="['menu-icon', item.iconName]"></div>
            <div class="menu-text">{{item.name}}</div>
            <div class="arrow-icon" :class="item.id === currId ? 'arrow-open-icon':''" 
            v-if= item.children.length></div>
          </div>
          <div
            class="submenu-list"
            :class=" item.id === currId ?　'submenu-active':''"
            :style="item.id === currId ? {'height': itemHeight+`px`}: {'height':'0'}"
          >
            <div
              class="submenu-item"
              @click="swictchSubPath(subItem.id, subItem.path)"
              v-for="subItem in item.children"
              :key="subItem.id"
              :class="subItem.id === currSubId ?　'active-bg':''"
            >
              <div :class="subItem.id === currSubId ?　'active-bar':''"></div>
              <div :class="['submenu-icon', subItem.iconName]"></div>
              <div class="submenu-text">{{subItem.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="download">
        <div class="first">
          <div class="df">
            <div class="group"></div>
            <div class="writing">
              <span class="top">下载</span>
              <span class="bt">Google</span>
            </div>
          </div>
          <div class="ds">
            <div class="code"></div>
          </div>
        </div>
        <div class="second">
          <div class="dt">
            <div class="robot"></div>
            <div class="writing">
              <span class="top">下载</span>
              <span class="bt">Android</span>
            </div>
          </div>
          <div class="dfo">
            <div class="apple"></div>
            <div class="writing">
              <a href="https://apps.apple.com/us/app/id1516993350">
              <span class="top">下载</span>
              <span class="bt">Ios</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import axios from "../../api/request";
export default {
  name: "mine",
  components: {
  },
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
      flagIcon: require("../../assets/imgs/flag_icon_20200526.png"),
      downIcon: require("../../assets/imgs/down_icon_20200526.png"),
      defaultLang: "简体中文",
      coinFlag:
        "https://img.wikifx.com/flag/adaa5e0b8a65a672/US.png_wiki-template-global",
      coinName: "美元",
      coinSymbol: "$",
      coinAbbre: "USD",
      languageList: [
        {
          id: 1,
          lang: "简体中文",
          flag: require("../../assets/imgs/flag_icon_20200526.png")
        },
        {
          id: 2,
          lang: "繁体中文",
          flag: require("../../assets/imgs/flag_icon_20200526.png")
        }
      ],
      coinList: [
        {
          id: 1,
          coinName: "人民币",
          coinSymbol: "¥",
          coinAbbre: "CNY",
          coinFlag:
            "https://img.wikifx.com/flag/7d8833382673bab2/CN.png_wiki-template-global"
        },
        {
          id: 2,
          coinName: "美元",
          coinSymbol: "$",
          coinAbbre: "USD",
          coinFlag:
            "https://img.wikifx.com/flag/adaa5e0b8a65a672/US.png_wiki-template-global"
        },
        {
          id: 3,
          coinName: "日元",
          coinSymbol: "￥",
          coinAbbre: "JPY",
          coinFlag:
            "https://img.wikifx.com/flag/afb23edb45c6c8cf/JP.png_wiki-template-global"
        },
        {
          id: 4,
          coinName: "韩元",
          coinSymbol: "₩",
          coinAbbre: "KRW",
          coinFlag:
            "https://img.wikifx.com/flag/66dbd0d47a2b876c/KR.png_wiki-template-global"
        },
        {
          id: 5,
          coinName: "英镑",
          coinSymbol: "£",
          coinAbbre: "GBP",
          coinFlag:
            "https://img.wikifx.com/flag/52c9e8fc8d7d65f6/UK.png_wiki-template-global"
        },
        {
          id: 6,
          coinName: "欧元",
          coinSymbol: "€",
          coinAbbre: "EUR",
          coinFlag:
            "https://img.wikifx.com/flag/bff59f293f0e9019/EU.png_wiki-template-global"
        },
        {
          id: 7,
          coinName: "澳元",
          coinSymbol: "A$",
          coinAbbre: "AUD",
          coinFlag:
            "https://img.wikifx.com/flag/045fe4098d24356d/AU.png_wiki-template-global"
        },
        {
          id: 8,
          coinName: "加元",
          coinSymbol: "C$",
          coinAbbre: "CAD",
          coinFlag:
            "https://img.wikifx.com/flag/b4b32b9e9479f387/CA.png_wiki-template-global"
        },
        {
          id: 9,
          coinName: "港元",
          coinSymbol: "HK$",
          coinAbbre: "HKD",
          coinFlag:
            "https://img.wikifx.com/flag/ccc558d92f93bcf8/HK.png_wiki-template-global"
        },
        {
          id: 10,
          coinName: "新加坡元",
          coinSymbol: "S$",
          coinAbbre: "SGD",
          coinFlag:
            "https://img.wikifx.com/flag/a3b71275d25ab1b4/SG.png_wiki-template-global"
        },
        {
          id: 11,
          coinName: "卢布",
          coinSymbol: "₽",
          coinAbbre: "RUB",
          coinFlag:
            "https://img.wikifx.com/flag/a51a924ab68d9812/BY.png_wiki-template-global"
        }
      ],
      pathList: [
        {
          id: 1,
          path: "/console/asset",
          name: "首页",
          iconName: "assets-icon",
          children: [
            // {
            //   id: 11,
            //   path: "/console/asset/deposit",
            //   iconName: "deposit-icon",
            //   name: "充值"
            // },
            // {
            //   id: 12,
            //   path: "/console/asset/withdraw",
            //   iconName: "withdraw-icon",
            //   name: "提现"
            // },
            // {
            //   id: 13,
            //   path: "/console/asset/transfer",
            //   iconName: "transfer-icon",
            //   name: "转账"
            // }
          ]
        },
        {
          id: 21,
          path: "/console/usd",
          iconName: "usd-icon",
          name: "USD 账户",
          children: [
          ]
        },
        {
          id: 23,
          path: "/console/usdt",
          iconName: "usdt-icon",
          name: "USDT 账户",
          children: [
          ]
        },
        {
          id: 24,
          path: "/console/btc",
          iconName: "btc-icon",
          name: "BTC 账户",
          children: [
          ]
        },
        {
          id: 22,
          path: "/console/eth",
          iconName: "eth-icon",
          name: "ETH 账户",
          children: [
          ]
        },
        // {
        //   id: 2,
        //   path: "",
        //   iconName: "record-icon",
        //   name: "钱包",
        //   children: [
           
        //   ]
        // },
        {
          id: 3,
          path: "/console/user",
          iconName: "user-icon",
          name: "个人中心",
          children: [
            // {
            //   id: 31,
            //   path: "/console/user/setting",
            //   iconName: "safe-icon",
            //   name: "安全设置"
            // },
            // {
            //   id: 32,
            //   path: "/console/user/message",
            //   iconName: "msg-icon",
            //   name: "消息中心"
            // }
          ]
        }
      ],
      messageList: [
        {
          id: 1,
          message: "hello,world",
          time: "2020-05-26"
        },
        {
          id: 2,
          message: "您的账户已提现$5454 USD/1231 USDT",
          time: "2020-05-26"
        }
      ],
      userList: [
        {
          id: 1,
          info: "身份认证"
        },
        {
          id: 2,
          info: "邮箱账号"
        },
        {
          id: 3,
          info: "联系人"
        },
        {
          id: 4,
          info: "地址簿"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      name: "coinName",
      symbol: "coinSymbol",
      addre: "coinAbbre",
      flag: "coinFlag",
      userInfo: "userInfo"
    }),
    ...mapGetters(["getTel", "getAvatar"])
  },
  methods: {
    ...mapMutations(["changeAssetStatus"]),
    ...mapActions(["changeCoin","getUserInfo"]),
    init() {
      this.coinName = this.name;
      this.coinSymbol = this.symbol;
      this.coinFlag = this.flag;
      this.coinAbbre = this.abbre;
    },
    // 退出
    logout() {
      localStorage.setItem("Authorization", "");
      localStorage.setItem("isShowAsset", "");
      this.changeAssetStatus('show');
      localStorage.setItem("coinAbbre", this.addre);
      localStorage.setItem("coinName", this.name);
      localStorage.setItem("coinSymbol", this.symbol);
      localStorage.setItem("coinFlag", this.flag);
      this.$router.push("/");
      this.$Message.success("退出成功!");
    },
    //选择语言
    getSelectVal(val) {
      this.defaultLang = val;
    },
    // 选择货币种类
    getCoinAbbr(name, symbol, abbre, flag) {
      this.coinName = name;
      this.coinSymbol = symbol;
      this.coinFlag = flag;
      this.changeCoin({ name, symbol, abbre, flag });
    },
    // 切换菜单/ 打开菜单
    swictchPath(id, path, child) {
      this.currId = id;
      this.currSubId = 0;
      this.$router.push(path);
      const len = child.length;
      this.itemHeight = len * 65.69;
    },
    // 切换子菜单
    swictchSubPath(id, path) {
      this.currSubId = id;
      this.$router.push(path);
    }
  },
  mounted() {
    // 获取个人信息
    this.getUserInfo();
    
    // this.$Message.error('您已在其它地方登录！');
      
    let { id, path, children } = this.pathList[0];
    this.swictchPath(id, path, children);
    this.init();
  }
};
</script>
<style scoped lang='scss'>
@import "../../style/tooltips.scss";
.content {
  margin-left: 268px;
  width: calc(100% - 268px);
}
.layout {
  background:#f5f6fa;
  .header {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    min-width: 1200px;
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
        mask-repeat: no-repeat;
        background: #fff;
        margin-right: 11px;
        margin-bottom: 3px;
        mask-image: url("../../assets/imgs/logo_svg_20200526.svg");
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
          }

          .select-triangle {
            @include select-triangle();
          }

          .select-list {
            @include select-list();
          }
        }
      }
      .flag-icon {
        width: 21px;
        height: 14px;
        vertical-align: middle;
      }
      .money-text {
        margin: 0 4px;
      }
      .down-icon {
        display: inline-block;
        width: 8px;
        height: 4px;
        transform: rotate(0);
        transition: all .2s ease;
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
              width: 130px;
              text-align: center;
            }
          }

          .select-triangle {
            @include select-triangle();
          }

          .select-list {
            @include select-list($w: 169px, $h: 300px);
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
        width: 28px;
        height: 28px;
        border-radius: 4px;
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

  .left {
    position: fixed;
    left: 0;
    top: 40px;
    bottom: 0;
    z-index: 9;
    
    .menu {
      padding-top: 20px;
      width: 268px;
      height: 100%;
      background: #fff;

      .menu-list {
        position: relative;
        cursor: pointer;

        .menu-item {
          width: 216px;
          padding: 22px 0;
          margin: 0 auto;
          padding-left: 20px;
          font-size: 16px;
          font-family: MicrosoftYaHei;
          border-radius: 4px;
          margin-left: 24px;
          transition: all 0.2s ease-out;

          &:hover {
            color: #3674d7;

            .menu-icon {
              background: #3674d7;
            }
          }

          .menu-icon {
            width: 18px;
            height: 14px;
            display: inline-block;
            mask-repeat: no-repeat;
            vertical-align: middle;
            background: #828aa4;
          }

          .usd-icon {
            mask-image: url("../../assets/account/usd_20200710.svg");
          }
          .usdt-icon {
            mask-image: url("../../assets/account/usdt_20200710.svg");
          }
          .eth-icon {
            mask-image: url("../../assets/account/eth_20200710.svg");
          }
          .btc-icon {
            mask-image: url("../../assets/account/btc_20200710.svg");
          }
          
          .assets-icon {
            mask-image: url("../../assets/imgs/assets_svg_20200525.svg");
          }

          .record-icon {
            mask-image: url("../../assets/imgs/record_svg_20200525.svg");
          }

          .user-icon {
            mask-image: url("../../assets/imgs/user_svg_20200525.svg");
          }

          .menu-text {
            display: inline-block;
            vertical-align: middle;
            margin-left: 16px;
          }

          .arrow-icon {
            width: 7px;
            height: 12px;
            margin-left: 68px;
            margin-top: 2px;
            display: inline-block;
            mask-repeat: no-repeat;
            vertical-align: middle;
            transition: all 0.2s linear;
            transform: rotate(0);
            mask-image: url("../../assets/imgs/arrow_svg_20200526.svg");
            background: #62697f;
          }

          .arrow-open-icon {
            background: #fff;
            transform: rotate(90deg);
          }

          .icon {
            color: #f00;
          }
        }

        .active {
          background: #3674d7;
          color: #fff;

          .menu-icon {
            background: #fff;
          }

          &:hover {
            color: #fff;

            .menu-icon {
              background: #fff;
            }
          }
        }

        .active-bar {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 64px;
          background: #3674d7;
        }

        .submenu-item {
          position: relative;
          width: 216px;
          padding: 22px 0;
          margin: 0 auto;
          padding-left: 38px;
          font-size: 16px;
          font-family: MicrosoftYaHei;
          border-radius: 4px;
          margin-left: 24px;
          transition: all 0.2s ease-out;

          &:hover {
            color: #3674d7;

            .submenu-icon {
              background: #3674d7;
            }
          }

          .active-bar {
            position: absolute;
            left: -24px;
            top: 0;
            width: 4px;
            height: 64px;
            background: #3674d7;
          }

          .submenu-icon {
            width: 18px;
            height: 14px;
            display: inline-block;
            mask-repeat: no-repeat;
            vertical-align: middle;
            background: #828aa4;
          }
          
          .deposit-icon {
            mask-image: url("../../assets/imgs/deposit_svg_20200525.svg");
          }

          .withdraw-icon {
            mask-image: url("../../assets/imgs/withdraw_svg_20200525.svg");
          }

          .transfer-icon {
            mask-image: url("../../assets/imgs/transfer_svg_20200525.svg");
          }

          .safe-icon {
            mask-image: url("../../assets/imgs/safe_svg_20200525.svg");
          }

          .msg-icon {
            mask-image: url("../../assets/imgs/msg_svg_20200525.svg");
          }

          .submenu-text {
            display: inline-block;
            vertical-align: middle;
            margin-left: 16px;
          }
        }

        .active-bg {
          background: #3674d7;
          color: #fff;

          .submenu-icon {
            background: #fff;
          }

          &:hover {
            color: #fff;

            .submenu-icon {
              background: #fff;
            }
          }
        }

        .submenu-list {
          position: relative;
          visibility: hidden;
          transition: all 0.3s linear;
          transform-origin: top;
          overflow: hidden;
        }

        .submenu-active {
          visibility: visible;
        }
      }
    }

    .download {
      width: 268px;
      height: 160px;
      position: absolute;
      bottom: 40px;
      left: 0;
      z-index: 9;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
      .writing {
        a {
          color: #fff;
          text-decoration: none;
        }
      }
      .first,
      .second {
        height: 48px;
        margin-top: 26px;
        margin-left: 16px;
      }

      .first {
        margin-bottom: 14px;

        .df {
          margin-right: 14px;
        }

        .df,
        .ds {
          float: left;
          cursor: pointer;
          width: 111px;
          height: 48px;
          background: rgba(165, 173, 198, 1);
          border-radius: 4px;

          &:hover {
            background: rgba(38, 98, 194, 1);
            box-shadow: 0px 2px 12px 0px rgba(54, 116, 215, 0.5);
          }

          .group {
            mask-image: url("../../assets/imgs/group.svg");
            margin: 12px 10px 0 15px;
            width: 23px;
            height: 24px;
          }

          .code {
            mask-image: url("../../assets/imgs/qrcode.svg");
            width: 30px;
            height: 30px;
            margin-top: 8px;
            margin-left: 41px;
          }

          .group,
          .code {
            float: left;
            background-color: white;
            mask-size: 100%;
          }

          .writing {
            margin-top: 6px;
            float: left;
            a {
              color: #fff;
            }
            .top,
            .bt {
              display: block;
              height: 19px;
              font-size: 14px;
              line-height: 19px;
              font-size: 14px;
            }

            .bt {
              font-size: 13px;
            }
          }
        }
      }

      .second {
        .dt {
          margin-right: 14px;
        }

        .dt,
        .dfo {
          float: left;
          cursor: pointer;
          width: 111px;
          height: 48px;
          background: rgba(165, 173, 198, 1);
          border-radius: 4px;
          font-size: 14px;

          &:hover {
            background: rgba(38, 98, 194, 1);
            box-shadow: 0px 2px 12px 0px rgba(54, 116, 215, 0.5);
          }

          .apple {
            margin: 9px 10px 0 24px;
            float: left;
            width: 22px;
            height: 27px;
            background-image: url("../../assets/imgs/apple1.png");
            background-repeat: no-repeat;
            background-size: 100%;
          }

          .writing {
            margin-top: 6px;
            float: left;

            .top,
            bt {
              display: block;
              width: 29px;
              height: 19px;
              font-size: 14px;
              line-height: 19px;
            }

            .bt {
              font-size: 13px;
            }
          }

          .robot {
            float: left;
            height: 27px;
            width: 23px;
            margin: 11px 5px 0 15px;
            background-image: url("../../assets/imgs/robot1.png");
            background-repeat: no-repeat;
            background-size: 100%;
          }

          .writing {
            margin-top: 6px;
            float: left;

            .top,
            .bt {
              display: block;
              height: 19px;
              font-size: 14px;
              line-height: 19px;
            }

            .bt {
              font-size: 13px;
            }
          }
        }
      }
    }

    .title {
      width: 212px;
      height: 64px;
      border-radius: 8px;

      &:hover {
        background: rgba(54, 116, 215, 1);
        box-shadow: 0px 2px 12px 0px rgba(54, 116, 215, 0.5);
        color: white;

        .icon {
          background-color: #fff;
        }

        .txt {
          color: white;
        }
      }

      .icon {
        width: 18px;
        height: 14px;
        float: left;
        margin: 26px 16px 24px 20px;
        background-color: #62697f;
      }

      .icon-one {
        mask-image: url("../../assets/imgs/mine5.svg");
      }

      .icon-two {
        mask-image: url("../../assets/imgs/mine3.svg");
      }

      .icon-three {
        mask-image: url("../../assets/imgs/mine7.svg");
      }

      .txt {
        margin: 22px 0;
        height: 21px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: rgba(98, 105, 127, 1);
        line-height: 21px;
        float: left;
      }
    }

    .menu-item {
      .icon {
        width: 18px;
        height: 14px;
        float: left;
        margin: 26px 16px 24px 38px;
        background-color: #828aa4;
      }

      .icon-f {
        mask-image: url("../../assets/imgs/mine8.svg");
      }

      .icon-s {
        mask-image: url("../../assets/imgs/mine9.svg");
      }

      .icon-t {
        mask-image: url("../../assets/imgs/mine10.svg");
      }

      .icon-s {
        mask-image: url("../../assets/imgs/mine9.svg");
      }

      .icon-forth {
        mask-image: url("../../assets/imgs/mine8.svg");
      }

      .icon-fifth {
        mask-image: url("../../assets/imgs/mine9.svg");
      }

      .icon-six {
        mask-image: url("../../assets/imgs/mine8.svg");
      }

      .icon-seven {
        mask-image: url("../../assets/imgs/user1.svg");
      }

      .icon-eight {
        mask-image: url("../../assets/imgs/user2.svg");
        width: 17px;
        height: 13px;
        float: left;
        background-color: #828aa4;
        margin-top: 22px;
      }

      .txt {
        margin: 21px 106px 23px 0px;
        height: 21px;
        line-height: 21px;
        float: left;
      }

      .txt1,
      .txt2 {
        height: 21px;
        float: left;
        margin-top: 22px;
      }

      .icon-seven {
        width: 17px;
        height: 18px;
        margin-top: 22px;
      }
    }
  }
}
</style>
