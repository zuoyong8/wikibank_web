<template>
  <RecordList
    :accountType="accountType"
    :tabList="tabList"
  ></RecordList>
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
      accountType: "ETH",
      tabList: [
        {
          id: 1,
          name: "deposit",
          type: 1
        },
        {
          id: 3,
          name: "exchange",
          type: 5
        },
        {
          id: 4,
          name: "withdraw",
          type: 2
        }
      ] // tab list
    };
  }
};
</script>

<style lang="scss" scoped>

</style>