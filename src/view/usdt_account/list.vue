<template>
  <RecordList :accountType="accountType" :tabList="tabList"></RecordList>
</template>
<script>
import RecordList from "../components/RecordList";

export default {
  name: "usd_list",
  components: {
    RecordList
  },
  data() {
    return {
      accountType: "USDT",
      tabList: [
        {
          id: 1,
          name: "充值",
          type: 1
        },
        {
          id: 3,
          name: "兑换",
          type: 5
        },
        {
          id: 4,
          name: "提现",
          type: 2
        }
      ] // tab list
    };
  }
};
</script>

<style lang="scss" scoped>
</style>