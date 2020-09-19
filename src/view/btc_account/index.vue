<template>
  <div class="assets-info">
      <div class="title">
          <img :src="assetsIcon" alt="" class="icon">
          <span class="text">BTC {{$t("account.assets")}}</span>
      </div>
    <div class="all-assets">
      <div class="wallet">
        {{getWallet.btcThousandTotal}}
        <span class="coin-marks">BTC</span>
      </div>
      <div class="button-list">
        <router-link :to="{path: `${item.path}`}"  v-for="(item, key) in featureList" :key="key" class="feature">
          <img :src="item.icon" alt="" class="icon">
          <span class="text">{{$t('home.'+item.name)}}</span>
        </router-link>
      </div>
    </div>
    <div class="account-list">
      <div class="available">
        {{$t("home.availAsset")}}
        <div class="number">{{getWallet.btcAvail}} BTC</div>
      </div>
      <div class="withdraw">
        {{$t("home.withdrawAsset")}}
        <div class="number">{{getWallet.btcFrozen}} BTC</div>
      </div>
      
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

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
              path: "/btc/deposit",
              name: "deposit"
          },
          {
              id: 2,
              icon: require("../../assets/account/exchange_20200710.png"),
              path: "/btc/exchange",
              name: "exchange"
          },
          {
              id: 3,
              icon: require("../../assets/account/withdraw_20200710.png"),
              path: "/btc/withdraw",
              name: "withdraw"
          },
      ],
    };
  },
  computed: {
    ...mapGetters(["getWallet"]),
  },
  methods: {
    ...mapActions(['fetchWallet'])
  },
  mounted() {
    this.fetchWallet();
  }
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
.assets-info {
  margin: 44px 30px 16px 30px;
  background: #fff;
  border-radius: 4px;
  .title {
        @include title;
  }
  .all-assets {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 64px 0;
    .coin-marks {
      font-size: 24px;
      color: #2c354c;
      font-weight: bold;
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
</style>