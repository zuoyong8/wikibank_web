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
      isShowChainName: false, // 是否显示链名称
      coinType: "BTC" // 数字货币类型
    };
  },
  methods: {
    enterAddress(val) {
      this.withdrawAddress = val;
    },
    enterNumber(val) {
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