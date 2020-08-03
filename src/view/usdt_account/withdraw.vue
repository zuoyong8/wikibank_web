<template>
  <AccountWithdraw
    :formWithdrawAddress="withdrawAddress"
    :formNumber="number"
    :formFees="fees"
    :formComment="comment"
    :isShowWithdrawType="isShowWithdrawType"
    :isShowChainName="isShowChainName"
    :coinType="coinType"
    @enterAddress="enterAddress"
    @enterNumber="enterNumber"
    @enterFees="enterFees"
    @enterComment="enterComment"
  ></AccountWithdraw>
</template>

<script>
import AccountWithdraw from "../components/AccountWithdraw";
import { mapGetters } from "vuex";
export default {
  name: "withdraw",
  components: {
    AccountWithdraw
  },
  data() {
    return {
      withdrawAddress: "", // 提现地址
      number: 0, // 提现数量
      fees: 0, // 手续费
      comment: "", // 提现备注
      isShowWithdrawType: false, // 是否显示充值方式
      isShowChainName: true, // 是否显示链名称
      coinType: "USDT" // 数字货币类型
    };
  },
  computed: {
    ...mapGetters(['getWallet'])
  },
  methods: {
    enterAddress(val) {
      this.withdrawAddress = val;
    },
    enterNumber(val) {
      if(val > this.getWallet.usdtAvail) {
        this.number = this.getWallet.usdtAvail;
      }
      this.number = val;
    },
    enterFees(val) {
      this.fees = +val;
    },
    enterComment(val) {
      this.comment = val;
    }
  }
};
</script>