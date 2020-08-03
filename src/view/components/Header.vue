<template>
  <div class="header">
    <div class="content">
      <div>
        <img :src="logo" alt class="logo" />
      </div>
      <div class="right">
        <div class="site-text">WikiPay 首页</div>
        <div class="divide">|</div>
        <div class="language-tips">
          <div class="select-widget">
            <div class="select-val">
              <img :src="flagIcon" alt class="flag-icon" />
              <span class="language">{{defaultLang}}</span>
              <span class="down-icon"></span>
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
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      logo: require("./header/images/logo_icon_20200525.png"),
      flagIcon: require("../../assets/imgs/flag_icon_20200526.png"),
      defaultLang: "简体中文",
      languageList: [
        {
          id: 1,
          lang: "简体中文",
          flag: require("../../assets/imgs/flag_icon_20200526.png"),
          value: "zh-cn"
        },
        // {
        //   id: 2,
        //   lang: "繁体中文",
        //   flag: require("../../assets/imgs/flag_icon_20200526.png"),
        //   value: "zh-cn"
        // },
        // {
        //   id: 3,
        //   lang: "英语",
        //   flag: require("../../assets/imgs/flag_icon_20200526.png"),
        //   value: "zh-cn"
        // }
      ]
    };
  },
  computed: {
    currentLanguage() {
      return this.$store.state.language;
    }
  },
  methods: {
    // 选择语言
    getSelectVal(val) {
      this.defaultLang = val;
    },
    backHome() {
      this.$router.push("/");
    },
    selectLang(value) {
      if (value === "en") {
        this.language = "English";
      } else if (value === "zh-CN") {
        this.language = "简体中文";
      } else if (value === "vi") {
        this.language = "越南語";
      }
      this.$i18n.locale = value;
      this.$store.commit("changeLanguage", value);
      this.languageId = value;
      localStorage.setItem("language", value);
    }
  },
  created() {
    let language = ["zh-CN", "en", "vi"];
    let JsSrc = (navigator.language || navigator.browserLanguage).toLowerCase();
    // JsSrc = JsSrc == "zh-cn" ? "zh" : JsSrc;

    // 如何导航到这个页面的（ 1、通过刷新或location.reload方法显示的）
    if (window.performance.navigation.type != 1) {
      if (language.indexOf(JsSrc) > -1) {
        this.$store.commit("changeLanguage", JsSrc);
      } else {
        // 默认设置中文
        this.$store.commit("changeLanguage", "zh-CN");
      }
    }
    window.addEventListener("setLanguage", () => {
      document.title = this.$t("title");
    });
    this.pathName = this.$route.name;
    if (localStorage.getItem("language")) {
      this.language = this.$i18n.locale = this.$store.getters.getLanguage;
    } else {
      this.language = this.$i18n.locale = "zh-CN";
    }
    this.languageId = this.language;
    if (this.language === "en") {
      this.language = "English";
    } else if (this.language === "zh-CN") {
      this.language = "简体中文";
    } else if (this.language === "vi") {
      this.language = "越南語";
    }
  }
};
</script>

<style lang="scss" scoped>
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
  }

  .select-triangle {
    @include select-triangle();
  }

  .select-list {
    @include select-list();
  }
}
.header {
  background: #040e2a;
  .content {
    min-width: 1200px;
    width: 1200px;
    margin: 0 auto;
    padding: 10px 0;
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
    margin-right: 24px;
    font-size: 14px;
    opacity: 0.9;
    &:hover {
      opacity: 1;
    }
  }
  .divide {
    display: inline-block;
  }

  .language-tips {
    display: inline-block;
    .select-widget {
      width: 162px;
      @include select-widget();

      .select-val {
        padding: 0 24px;
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
          width: 60px;
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
          mask-image: url("../../assets/login/arrow_20200717.svg");
          background-color: #fff;
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
        height: 160px;
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
}
</style>