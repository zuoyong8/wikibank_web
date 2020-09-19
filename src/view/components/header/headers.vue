<template>
<div class="headers">
    <div id="left"></div>
    <div class="header">
        <div class="header-left">
            <img :src="logoIcon" alt class="logo-icon" @click="backHome" />
        </div>
        <div class="header-right">
            <div class="website" @click="backHome">WikiPay官网</div>
            <span class="divide"></span>
            <!--<div class="selected-country">
          <img src="./images/flag1.png" alt="网络问题" width="20px" height="13px">
          <span class='country-txt'>简体中文</span>
          <i class="pointer"></i>
          <ul class="dropdrown">
            <li class="country">
              <img src="./images/flag1.png" alt="">
              <span>简体中文</span>
            </li>
            <li class="country">
              <img src="./images/flag3.png" alt="">
              <span>繁體中文</span>
            </li>
            <li class="country-last">
              <img src="./images/flag2.png" alt="">
                <span>English</span>
            </li>
          </ul>
        </div>-->
            <div class="select-country">
                <Dropdown trigger="hover" @on-click="selectLang">
                    <a href="javascript:void(0)" class="country">
                        <img src="./images/flag1.png" alt v-if="languageId=='zh-CN'" />
                        <img src="./images/flag2.png" alt v-if="languageId=='en'" />
                        <img src="./images/flag3.png" alt v-if="languageId=='vi'" />
                        <span class="country-text">{{language}}</span>
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="item in options" :name="item.value" :key="item.value">
                            <img src="./images/flag1.png" alt v-if="item.value=='zh-CN'" />
                            <img src="./images/flag2.png" alt v-if="item.value=='en'" />
                            <img src="./images/flag3.png" alt v-if="item.value=='vi'" />
                            {{item.label}}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    </div>
    <div id="right"></div>
</div>
</template>

<script>
export default {
    name: "headers",
    data() {
        return {
            logoIcon: require("./images/logo_icon_20200525.png"),
            language: "简体中文",
            options: [{
                    label: "简体中文",
                    value: "zh-CN"
                }
                // {
                //   label: "English",
                //   value: "en"
                // },
                // {
                //   label: "越南語",
                //   value: "vi"
                // }
            ],
            languageId: "zh-CN"
        };
    },
    computed: {
        currentLanguage() {
            return this.$store.state.language;
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
    },
    methods: {
        backHome() {
            this.$router.push("/home");
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
    }
};
</script>

<style lang="stylus" scoped>
.headers {
    background: rgba(4, 14, 42, 1);
    height: 28px;
}

#left {
    position: absolute;
    top: 0;
    left: 0;
    width: 19%;
}

#right {
    position: absolute;
    top: 0;
    right: 0;
    width: 19%;
}

.header {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;

    // position:absolute;
    // z-index:5;
    // top:0
    .header-left {
        float: left;
        cursor: pointer;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        line-height: 14px;
        margin: 15px 0 8px 0;

        .logo-icon {
            width: 132px;
            height: 30px;
        }
    }
}

.header-right {
    float: right;
    margin-top: 15px;

    .website {
        margin: 0 0 8px 0;
        float: left;
        width: 87px;
        height: 14px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 14px;
        cursor: pointer;
    }

    .divide {
        margin: 0 24px;
        float: left;
        display: block;
        width: 1px;
        height: 14px;
        background: rgba(255, 255, 255, 1);
        opacity: 0.3;
    }

    .select-country {
        float: left;
        margin-top: -3px;

        .country {
            color: #FFF;

            &:hover {
                text-decoration: none;
            }

            .country-text {
                display: inline-block;
                margin-left: 15px;
                width: 57px;
            }
        }
    }

    .selected-country {
        float: left;
        height: 28px;
        cursor: pointer;
        margin-top: 3px;
        position: relative;

        &:hover {
            .dropdrown {
                display: block;
            }

            .pointer {
                -webkit-transform: rotate(180deg);
                -moz-transform: rotate(180deg);
                -o-transform: rotate(180deg);
                -ms-transform: rotate(180deg);
                transform: rotate(180deg);
            }
        }

        .country-txt {
            margin-left: 14px;
            margin-right: 12px;
            display: inline-block;
            height: 17px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: rgba(255, 255, 255, 1);
        }

        .pointer {
            width: 8px;
            height: 4px;
            background: url('./images/route.png') no-repeat;
            display: inline-block;
            margin-bottom: 3px;
            -webkit-transition: -webkit-transform 0.3s;
            -moz-transition: -moz-transform 0.3s;
            -o-transition: -o-transform 0.3s;
            -ms-transition: -ms-transform 0.3s;
        }

        .dropdrown {
            display: none;
            position: absolute;
            top: 31px;
            left: -23px;
            z-index: 6;
            width: 158px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);

            .country,
            .country-last {
                height: 40px;
                padding: 14px 0;

                img {
                    margin-right: 13px;
                    margin-left: 24px;
                }
            }

            .country-last {
                margin-bottom: 13px;
            }

            &:hover {
                background: rgba(244, 247, 250, 1);
            }
        }
    }
}
</style>
