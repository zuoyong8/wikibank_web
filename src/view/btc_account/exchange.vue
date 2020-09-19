<template>
  <AccountExchange
    :fromCoinAvatar="fromCoinAvatar"
    :formCoin="formCoin"
    :toCoin="toCoin"
    :number="number"
    :price="price"
    :stepNum="stepNum"
    :payPassword="payPassword"
    :moneyList="moneyList"
    :isDisabled="isDisabled"
    v-model="number"
    @checkFromCoin="checkFromCoin"
    @getPrice="getPrice"
    @next="next"
    @getMoney="getMoney"
    @enterPassword="enterPassword"
  ></AccountExchange>
</template>

<script>
import AccountExchange from "../components/AccountExchange";
import { saveDecimal } from "../../filters.js";
import { mapGetters } from "vuex";
export default {
  name: "deposit",
  components: {
    AccountExchange
  },
  data() {
    return {
      fromCoinAvatar: require("../../assets/person/btc_icon_20200624.png"),
      formCoin: "BTC",
      toCoin: "USD",
      number: "",
      price: '1',
      stepNum: 1,
      payPassword: "", // 支付密码
      isDisabled: true
    };
  },
  computed: {
    ...mapGetters(["getWallet"]),
    moneyList() {
        return [];
    }
  },
  methods: {
    getPrice(usd, decimal) {
      this.price = saveDecimal(usd, decimal);
    },
    checkFromCoin(item) {
      this.fromCoinAvatar = item.avatar;
      this.toCoin = item.name;
    },
    next() {
      this.stepNum++;
    },
    getMoney(val) {
      if (this.number > this.getWallet.btcAvail) {
        this.number = this.getWallet.btcAvail;
      }
      this.number = val;
    },
    enterPassword(val) {
      this.payPassword = val;
    }
  }
};
</script>