<template>
  <!-- <div class="usd-list"> -->
    <div class="assets-info">
      <div class="title">
        <img :src="assetsIcon" alt class="icon" />
        <span class="text">USD {{$t("account.assets")}}</span>
      </div>
      <div class="all-assets">
        <div class="wallet">
          ${{getWallet.usdThousandTotal}}
          <span class="coin-marks">(USD)</span>
        </div>
        <div class="button-list">
          <router-link
            :to="{path: `${item.path}`}"
            v-for="(item, key) in featureList"
            :key="key"
            class="feature"
          >
            <img :src="item.icon" alt class="icon" />
            <span class="text">{{$t('home.'+item.name)}}</span>
          </router-link>
        </div>
      </div>
      <div class="account-list">
        <div class="available">
          {{$t("home.availAsset")}} 
          <div class="number">${{getWallet.usdAvail}} (USD)</div>
        </div>
        <div class="withdraw">
          {{$t("home.withdrawAsset")}}
          <div class="number">${{getWallet.usdFrozen}} (USD)</div>
        </div>
        <div class="valuation">
          {{$t("home.valuaAsset")}}
          <div class="number">${{getProfit.usdeEvaluate}} (USD)</div>
        </div>
        <div class="available">
          {{$t("home.profit")}}
          <div class="number">{{getProfit.annual}}%</div>
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "usd_list",
  components: {},
  data() {
    return {
      assetsIcon: require("../../assets/account/usd_20200710.png"), // assets
      featureList: [
        {
          id: 0,
          icon: require("../../assets/account/deposit_20200710.png"),
          path: "/usd/deposit",
          name: "deposit"
        },
        {
          id: 1,
          icon: require("../../assets/account/transfer_20200710.png"),
          path: "/usd/transfer",
          name: "transfer"
        },
        {
          id: 2,
          icon: require("../../assets/account/exchange_20200710.png"),
          path: "/usd/exchange",
          name: "exchange"
        },
        {
          id: 3,
          icon: require("../../assets/account/withdraw_20200710.png"),
          path: "/usd/withdraw",
          name: "withdraw"
        }
      ]
    };
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre"]),

    ...mapGetters(["getProfit", "getWallet"])
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
@mixin title {
  padding: 17px 64px;
  border-bottom: 1px solid #eeeeee;
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
  .account-list {
    padding: 40px 64px;
    display: flex;
    justify-content: space-between;
    color: #1c2f62;
    font-size: 14px;
    .number {
      font-weight: bold;
      font-size: 18px;
      color: #1c2f62;
      margin-top: 14px;
    }
  }
}
</style>