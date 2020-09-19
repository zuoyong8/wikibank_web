<template>
    <div class="left">
      <div class="menu">
        <div class="menu-list active" v-for="item in pathList" :key="item.id">
          <div :class=" item.id === navActive && item.children.length === 0 ?　'active-bar':''"></div>
          <div
            class="menu-item"
            :class=" item.id === navActive && item.children.length === 0 ?　'active':''"
            @click="swictchPath(item.id, item.path)"
          >
            <div :class="['menu-icon', item.iconName]"></div>
            <div class="menu-text">{{$t('leftMenu.'+item.name)}}</div>
          </div>
        </div>
      </div>
      <div class="download">
        <div class="first">
          <div class="df">
            <div class="group"></div>
            <div class="writing">
              <span class="top">{{$t('login.download')}}</span>
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
              <span class="top">{{$t('login.download')}}</span>
              <span class="bt">Android</span>
            </div>
          </div>
          <div class="dfo">
            <div class="apple"></div>
            <div class="writing">
              <a href="https://apps.apple.com/us/app/id1516993350">
              <span class="top">{{$t('login.download')}}</span>
              <span class="bt">Ios</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: "Navbar",
  components: {},
  data() {
    return {
      pathList: [
        {
          id: 1,
          path: "/console/asset",
          name: "home",
          iconName: "assets-icon",
          children: [],
        },
        {
          id: 21,
          path: "/usd?id=1&type=1",
          iconName: "usd-icon",
          name: "usdAccount",
          children: [],
        },
        {
          id: 23,
          path: "/usdt?id=1&type=1",
          iconName: "usdt-icon",
          name: "usdtAccount",
          children: [],
        },
        {
          id: 24,
          path: "/btc?id=1&type=1",
          iconName: "btc-icon",
          name: "btcAccount",
          children: [],
        },
        {
          id: 22,
          path: "/eth?id=1&type=1",
          iconName: "eth-icon",
          name: "ethAccount",
          children: [],
        },
        {
          id: 3,
          path: "/console/user",
          iconName: "user-icon",
          name: "personCenter",
          children: [],
        },
      ],
    };
  },
  computed: {
    ...mapState({
        navActive: 'navActive',
    })
  },
  methods: {
    ...mapMutations(['changeNav']),
    // 切换菜单/ 打开菜单
    swictchPath(id, path) {
      this.changeNav(id);
      this.$router.push(path);
      localStorage.setItem('navActive', id)
    },
    
  },
  mounted() {
    this.changeNav(+this.navActive);
  }
};
</script>
<style lang="scss" scoped>
 .left {
    position: fixed;
    left: 0;
    top: 40px;
    bottom: 0;
    z-index: 9;
    
    .menu {
      padding-top: 20px;
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
          margin-left: 15px;
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
            -webkit-mask-image: url("../../assets/account/usd_20200710.svg");
            mask-image: url("../../assets/account/usd_20200710.svg");
          }
          .usdt-icon {
            -webkit-mask-image: url("../../assets/account/usdt_20200710.svg");
            mask-image: url("../../assets/account/usdt_20200710.svg");
          }
          .eth-icon {
            -webkit-mask-image: url("../../assets/account/eth_20200710.svg");
            mask-image: url("../../assets/account/eth_20200710.svg");
          }
          .btc-icon {
            -webkit-mask-image: url("../../assets/account/btc_20200710.svg");
            mask-image: url("../../assets/account/btc_20200710.svg");
          }
          
          .assets-icon {
            -webkit-mask-image: url("../../assets/imgs/assets_svg_20200525.svg");
            mask-image: url("../../assets/imgs/assets_svg_20200525.svg");
          }

          .record-icon {
            -webkit-mask-image: url("../../assets/imgs/record_svg_20200525.svg");
            mask-image: url("../../assets/imgs/record_svg_20200525.svg");
          }

          .user-icon {
            -webkit-mask-image: url("../../assets/imgs/user_svg_20200525.svg");
            mask-image: url("../../assets/imgs/user_svg_20200525.svg");
          }

          .menu-text {
            display: inline-block;
            vertical-align: middle;
            margin-left: 16px;
          }
        }

        .active {
          background: #3674d7;
          color: #fff;
          margin: 15px 15px 15px 15px;
          pointer-events: none;
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
      }
    }

  }
</style>