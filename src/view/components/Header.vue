<template>
  <div class="header">
    <div class="content">
      <div>
      <a href="/" >
        <img @click="toTop" :src="logo" alt class="logo" />
      </a>
      </div>
      <div class="right">
        <slot>
          <div class="qrcode-box" :style="{marginRight: '24px'}">
            <icon name="qrcode" class="code-icon"/>
            <div class="qrcode">
              <canvas id="download" class="inner-qrcode"></canvas>
            </div>
          </div>
          <div class="divide">|</div>
          <a href="/"  class="site-text">{{$t("login.businessSys")}}</a>
        </slot>
        <div class="divide">|</div>
        <div class="language-tips">
          <div class="select-widget">
            <div class="select-val">
              <img :src="langFlag" alt class="flag-icon" />
              <span class="language">{{language}}</span>
              <icon name="arrow" class="down-icon"/>
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
        <!-- <div class="divide login-divide">|</div> -->
        <!-- <a href="/login" class="site-text login-btn">{{$t("login.login")}}</a> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { backtop } from '@/utils/index.js';
import QRCode from "qrcode";
import '@/icons/arrow';
import "@/icons/qrcode";
export default {
  name: "",
  components: { QRCode },
  data() {
    return {
      logo: require("./header/images/logo_icon_20200525.png"),
    };
  },
  computed: {
    ...mapState(['language', 'langFlag', 'languageList', "flagList", "areaFlag", 'areaCode', 'countryCode'])
  },
  methods: {
    ...mapMutations(['getFlags', 'changeAreaName']),
    // 选择语言
    getSelectVal(item) {
      this.$i18n.locale = item.value;
      this.$store.commit("changeLanguage", item);
      this.getFlags();
      const areaItem = { 
        flag: this.areaFlag, 
        code: this.areaCode,
        countryCode: this.countryCode
      };
      this.changeAreaName(areaItem);
    },
    toTop() {
      backtop();
    },
    createQrocde() {
      let qrcode = document.querySelector("#download");
      QRCode.toCanvas(qrcode, "https://m.wikipay.net/download", {
        width: 110,
        height: 110,
      });
    },
  },
  mounted() {
    this.createQrocde();
  },
  created() {
    // let JsSrc = (navigator.language || navigator.browserLanguage).toLowerCase();
    // console.log(JsSrc)
    // // JsSrc = JsSrc == "zh-cn" ? "zh" : JsSrc;

    // // 如何导航到这个页面的（ 1、通过刷新或location.reload方法显示的）
    // if (window.performance.navigation.type != 1) {
    //   if (this.languageList.indexOf(JsSrc) > -1) {
    //     this.$store.commit("changeLanguage", JsSrc);
    //   } else {
    //     // 默认设置中文
    //     this.$store.commit("changeLanguage", "zh-CN");
    //   }
    // }

    // window.addEventListener("changeLanguage", () => {
    //   document.title = this.$t("title");
    // });

    // if (localStorage.getItem("language")) {
    //   this.language = this.$i18n.locale = this.langAbbr;
    // } else {
    //   this.language = this.$i18n.locale = "zh-CN";
    // }

  },
};
</script>

<style lang="scss" scoped>
$common-width: 1200px;
@mixin select-widget {
  position: relative;
  z-index: 1;
  display: inline-block;
  cursor: pointer;
  transition: all 0.2s ease-out;
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.19);

    .select-list,
    .select-triangle {
      visibility: visible;
      transform: scaleY(1);
    }
    .down-icon {
      transform: rotate(180deg);
    }
  }
}
@mixin select-val {
  display: inline-block;
}
@mixin select-list($w: 132px, $h: 150px, $padd: 16px 0) {
  overflow: auto;
  visibility: hidden;
  position: absolute;
  top: 40px;
  left: 0;
  width: $w;
  height: $h;
  background: #fff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  transform-origin: top;
  transform: scaleY(0);
  padding: $padd;
}
@mixin select-triangle() {
  visibility: hidden;
  position: absolute;
  width: 0;
  height: 0;
  left: 60px;
  top: 28px;
  content: "";
  display: block;
  border-width: 7px 7px 7px 7px;
  border-style: solid;
  border-color: transparent transparent #fff transparent;
}
.select-widget {
  @include select-widget();

  .select-val {
    @include select-val();
    // width: 175px;
    text-align: center;
  }

  .select-triangle {
    @include select-triangle();
  }

  .select-list {
    @include select-list();
  }
}

.header {
  background: rgba(4,14,42, 1);
  transition: all 0.5s;
  font-size: 14px;
  &:hover{
    background: rgba(4,14,42, 1);
  }
  .content {
    width: $common-width;
    margin: 0 auto;
    // padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    width: 132px;
    height: 30px;
    opacity: 0.9;
    &:hover {
      opacity: 1;
    }
  }
  
  .site-text {
    display: inline-block;
    cursor: pointer;
    color: #fff;
    text-decoration: none;
    padding: 15px 24px;
    font-size: 14px;
    opacity: 0.9;
    &:hover {
      opacity: 1;
    }
  }
  .login-btn{
    display: none;
    background: #3674D7;
    margin-left: 24px;
  }
  .divide {
    display: inline-block;
    color: #515a6e;
    &.login-divide{
      display: none;
    }
  }

  .language-tips {
    display: inline-block;
    .select-widget {
      // width: 162px;
      @include select-widget();

      .select-val {
        padding: 0 0 0 24px;
        color: #fff;
        @include select-val();
        .flag-icon {
          width: 21px;
          height: 14px;
          vertical-align: middle;
          margin-right: 8px;
        }
        .language {
          display: inline-block;
          // width: 76px;
          text-align: center;
          white-space: nowrap;
          text-overflow: ellipsis;
          opacity: 0.9;
          &:hover {
            opacity: 1;
          }
        }
        .down-icon {
          transition: all 0.2s ease;
          display: inline-block;
          vertical-align: middle;
          width: 8px;
          height: 4px;
          margin-left: 8px;
          fill: currentColor;
        }
      }

      .select-triangle {
        @include select-triangle();
        top: 18px;
        left: 72px;
      }

      .select-list {
        @include select-list($w: 158px);
        top: 30px;
        height: 150px;
      }
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
  }

  .qrcode-box {
    display: inline-block;
    position: relative;
    &:hover {
      .qrcode {
        visibility: visible;
        opacity: 1;
        transform: scaleY(1);
      }
    }

    .code-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      fill: #fff;
      vertical-align: middle;
      cursor: pointer;
    }

    .qrcode {
      position: absolute;
      top: 32px;
      left: -43px;
      width: 106px;
      height: 106px;
      border-radius: 2px;
      background: #fff;
      transition: all 0.2s ease-in;
      transform: scaleY(0);
      transform-origin: center top;
      opacity: 0;
      visibility: hidden;
      overflow: hidden;

      .inner-qrcode {
        background: #d8d8d8;
        margin-top: -2px;
        max-width: 100%;
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .header .content {
    width: 992px;
  }
}
</style>