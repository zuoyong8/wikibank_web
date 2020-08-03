<template>
  <div class="usd-list">
    <div class="assets-info">
        <div class="title">
            <img :src="assetsIcon" alt="" class="icon">
            <span class="text">BTC 账户资产</span>
        </div>
      <div class="all-assets">
        <div class="wallet">
          {{getWallet.btcThousandTotal}}
          <span class="coin-marks">BTC</span>
        </div>
        <div class="button-list">
          <router-link :to="{path: `${item.path}`}"  v-for="(item, key) in featureList" :key="key" class="feature">
            <img :src="item.icon" alt="" class="icon">
            <span class="text">{{item.name}}</span>
          </router-link>
        </div>
      </div>
      <div class="account-list">
        <div class="available">
          可用 (BTC)
          <div class="number">{{getWallet.btcAvail}}</div>
        </div>
        <div class="withdraw">
          提现中 (BTC)
          <div class="number">{{getWallet.btcFrozen}}</div>
        </div>
       
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "usd_list",
  components: {
    
  },
  data() {
    return {
      assetsIcon: require('../../assets/account/btc_20200714.png'), // assets
      featureList: [
          {
              id: 0,
              icon: require("../../assets/account/deposit_20200710.png"),
              path: "/console/btc/deposit",
              name: "充值"
          },
          {
              id: 2,
              icon: require("../../assets/account/exchange_20200710.png"),
              path: "/console/btc/exchange",
              name: "兑换"
          },
          {
              id: 3,
              icon: require("../../assets/account/withdraw_20200710.png"),
              path: "/console/btc/withdraw",
              name: "提现"
          },
      ],
    };
  },
  computed: {
    ...mapGetters(["getWallet"]),
  },
};
</script>

<style lang="scss" scoped>
@mixin title{
    padding: 17px 64px;
    border-bottom: 1px solid #EEEEEE;
    font-size: 18px;
    color: #62697f;
    .icon {
        width: 18px;
        height: 18px;
    }
    .text {
        font-weight: bold;
        vertical-align: middle;
        margin-left: 12px;
    }
}
.usd-list {
  min-height: 100vh;
  padding-top: 20px;
  width: 1330px;
  margin: 0 auto;
  .assets-info {
    margin: 44px 30px 16px 30px;
    background: #fff;
    .title {
         @include title;
    }
    .all-assets {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 40px 64px 0;
      .wallet {
        font-size: 40px;
        color: #1c2f62;
        font-weight: bold;
      }
      .coin-marks {
        font-size: 24px;
        color: #2c354c;
        font-weight: bold;
      }
      .button-list {
        .feature {
          display: inline-block;
          padding: 10px 14px;
          border-radius: 4px;
          color: #3674d7;
          font-size: 16px;
          border: 1px solid rgba(54, 116, 215, 0.49);
          margin-right: 24px;
          text-decoration: none;
          transition: all .2s ease-out;
          &:last-child {
            margin-right: 0;
          }
          &:hover {
            border: 1px solid rgba(54, 116, 215, 1);
            background: rgba(54, 116, 215, 0.08);
          }
          .text {
            font-size: 16px;
            margin-left: 10px;
            vertical-align: middle;
          }
          .icon {
            width: 20px;
            height: 15px;
          }
        }
      }
    }
    .account-list {
      padding: 40px 64px;
      display: flex;
      color: #1c2f62;
      font-size: 14px;
      .number {
        font-weight: bold;
        font-size: 18px;
        color: #1c2f62;
        margin-top: 14px;
      }
      .available, .withdraw {
          width: 230px;
      }
    }
    
  }
}
</style>