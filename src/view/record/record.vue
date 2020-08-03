<template>
  <div class="record">
    <div class="title">
      <icon name="mine3" class="title-icon"></icon>
      <h4>全部记录</h4>
    </div>
    <div class="center">
      <div class="center-top">
        <div class="option">分类</div>
        <div
          v-for="(value,key) in transFilter"
          :key="key"
          @click="getTransList(value.status)"
          class="option"
        >
          <div class="txt" :class="value.status === transKey ? 'active':''">{{value.name}}</div>
        </div>
      </div>
      <div class="center-c">
        <div class="option">分类</div>
        <div
          class="option"
          v-for="(value,key) in statusFilter"
          :key="key"
          @click="getStatusList(value.status) "
        >
          <div class :class="value.status === statusKey ? 'active':''">{{value.name}}</div>
        </div>
      </div>
      <div class="center-bottom">
        <h4 class="time" @click="test()">时间</h4>
        <Row>
          <Date-picker
            type="date"
            placeholder=""
            class="select1"
            value="startTime"
            @on-change="startChange"
          ></Date-picker>
          <Date-picker
            type="date"
            placement="bottom-end"
            placeholder=""
            class="select"
            value="endTime"
            @on-change="endChange"
          ></Date-picker>
        </Row>
      </div>
    </div>
    <InfiniteLoad
      :orderList="formatOrderList"
      :isLoading="isLoading"
      :noMore="noMore"
      @loadMore="loadMore"
    ></InfiniteLoad>
  </div>
</template>

<script>

import "../../icons/mine3";
import {
  formatDate,
  getStatus,
  getDate,
  getTime,
  formatNumberFloor
} from "../../filters.js";
import InfiniteLoad from "../components/InfiniteLoad";
import { fetchWithdrawDeposit } from "../../api/request.js";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  components: {
    InfiniteLoad
  },
  data() {
    return {
      startTime: 0,
      endTime: 0,
      statusKey: 0,
      isClear: false,
      rows: 10, // 每页数据量
      page: 1, // 第几页
      orderList: [],
      isLoading: true,
      noMore: false,
      infos: [],
      transFilter: [
        {
          id: 1,
          name: "充值",
          status: 1
        },
        {
          id: 2,
          name: "提现",
          status: 2
        }
      ],
      transKey: 1,
      statusKey: 3,
      statusFilter: [
        {
          id: 1,
          name: "进行中",
          status: 3
        },
        {
          id: 2,
          name: "成功",
          status: 4
        },
        {
          id: 3,
          name: "失败",
          status: 5
        }
      ]
    };
  },
  mounted() {
    const { transKey, statusKey } = this;

    this.getWithdrawDepositList(transKey, statusKey);
  },
  computed: {
     ...mapState({
      rate: "rate",
      coinSymbol: "coinSymbol",
      coinAbbre: "coinAbbre"
    }),
    formatOrderList() {
      let { rate, coinSymbol, coinAbbre, orderList } = this;

      return orderList.map(item => {
        let comment = item.comment ? item.comment : "";
        let type, state, usd, orderId;
        let order = item.orderId + "";
        let orderStart = order.substring(0, 4);
        let orderEnd = order.substring(order.length - 3, order.length);
        let orderDateTime = formatDate(item.createAt, "yyyy-MM-dd hh:ss");
        let usdt = formatNumberFloor(item.amount, item.showPrecision);

        orderId = orderStart + "......" + orderEnd;

        type = item.type == 1 ? "充值" : "提现";

        // 根据usd计算对应的货币价格
        if (item.coin == "AB") {
          usd =
            coinSymbol +
            formatNumberFloor(item.amount * rate, item.showPrecision) +
            coinAbbre;
        } else {
          usd =
            coinSymbol +
            formatNumberFloor(item.usd * rate, item.showPrecision) +
            coinAbbre;
        }

        return {
          id: item.orderId,
          avator: item.icon,
          createTime: orderDateTime,
          date: getDate(orderDateTime),
          time: getTime(orderDateTime),
          name: item.coin,
          account: "USDT-ERC20",
          orderId: item.orderId,
          ellipsisOrderId: orderId,
          usdt: item.amount + item.coin, // 数字货币
          usd: usd, // 转换后对应的货币
          showPrecision: item.showPrecision, // 保留的小数位数
          state: item.statusStr, // 账单状态
          type: type, // 账单类型
          marks: comment
        };
      });
    }
  },
  methods: {
    startChange(val) {
      this.startTime = new Date(val).getTime();

      this.setDate();
    },

    endChange(val) {
      this.endTime = new Date(val).getTime();
      this.setDate();
    },

    setDate(val) {
      this.noMore = false;
      this.orderList = [];
      this.page = 1;

      this.fetchDate();
    },

    getStartDate(e) {
      if (this.endDate) {
        let startDate = new Date(e).getTime();
        let endDate = new Date(this.endDate).getTime();
        if (startDate > endDate) {
          this.$Message.error("开始时间必须小于结束时间");
        }
      }
      this.startDate = e;
    },

    getEndDate(e) {
      if (this.startDate) {
        let startDate = new Date(this.startDate).getTime();
        let endDate = new Date(e).getTime();
        if (endDate < startDate) {
          this.$Message.error("结束时间必须大于开始时间");
        }
      }
      this.endDate = e;
    },

    getTransList(type) {
      this.transKey = type;
      this.getWithdrawDepositList(type, this.statusKey);
    },

    getStatusList(status) {
      this.statusKey = status;

      this.getWithdrawDepositList(this.transKey, status)
    },

    getWithdrawDepositList(type, status) {
      this.noMore = false;
      this.orderList = [];
      this.page = 1;
      this.transKey = type;
      this.statusKey = status;

      this.startTime = new Date(this.startTime).getTime();
      this.endTime = new Date(this.endTime).getTime();

      this.fetchDate();
    },

    loadMore() {
      if (!this.isLoading) return;
      if (this.noMore) return;

      this.page = this.page + 1;

      this.fetchDate();
    },

    async fetchDate() {
      if (!this.isLoading) return;
      if (this.noMore) return;

      let params = {
        type: this.transKey,
        status: this.statusKey,
        rows: this.rows,
        page: this.page,
        startDate: this.startTime,
        endDate: this.endTime
      };

      this.isLoading = false;

      const res = await fetchWithdrawDeposit(params);

      this.isLoading = true;

      if (res.code === 0) {
        let { info } = res.data;

        this.orderList = [...this.orderList, ...info];
        if (info.length === 0) this.noMore = true;
      } else {
        this.$Message.error(res.msg);
      }
    }
  }
};
</script>
<style lang='stylus' scoped>
.record {
  margin-left: 308px;
  margin-top: 88px;
  width: 100%;
  .asset {
    margin-left: 40px;

    .header {
      height: 40px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(183, 183, 183, 1);

      th {
        height: 19px;

        .first {
          margin-right: 50px;
          width: 29px;
          margin-left: 16px;
        }

        .sec {
          margin-right: 192px;
          width: 57px;
        }

        .third {
          margin-right: 430px;
          width: 140px;
        }

        .forth {
          margin-right: 163px;
          width: 77px;
        }

        .fifth {
          margin-right: 190px;
          width: 29px;
        }

        .six {
          margin-right: 132px;
          width: 29px;
        }

        .seven {
          width: 29px;
        }
      }
    }
  }

  .row {
    height: 81px;
    border-top: 1px solid #F6F6F6;

    td {
      .avatar {
        margin-right: 50px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-top: 26px;
        margin-left: 16px;
      }

      .time {
        width: 84px;
      }

      .sec {
        margin-right: 430px;
        width: 140px;

        .time-top {
          width: 132px;
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          font-family: MicrosoftYaHei;
        }

        .time-bottom {
          width: 132px;
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: MicrosoftYaHei;
        }
      }

      .third {
        margin-right: 163px;
        width: 104px;
        font-size: 14px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      .forth {
        margin-right: 190px;
        width: 58px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
        font-family: MicrosoftYaHei;
      }

      .fifth {
        margin-right: 132px;
        width: 29px;
      }

      .six {
        width: 29px;
      }
    }
  }

  .title {
    margin-top: 88px;
    margin: 14px;
    height: 30px;

    .title-icon {
      float: left;
      width: 20px;
      height: 18px;
      margin: 7px 12px 5px 0;
    }

    h4 {
      float: left;
      width: 102px;
      height: 30px;
      font-size: 18px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(98, 105, 127, 1);
      line-height: 30px;
    }
  }

  .center {
    height: 150px;
    background: rgba(245, 246, 250, 1);
    margin-bottom: 13px;
    position: relative;

    .center-top {
      height: 20px;
      position: absolute;
      top: 65px;
      left: 21px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;

      .txt {
        float: left;
      }

      .option {
        float: left;
        height: 19px;
        margin-right: 48px;
        cursor: pointer;

        &:hover {
          color: #3674D7;
        }
      }

      .active {
        color: #3674D7;
      }
    }

    .center-c {
      height: 20px;
      margin-top: 20px;
      position: absolute;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
      top: 90px;
      left: 21px;

      .txt {
        float: left;
        margin-right: 48px;
      }

      .option {
        height: 19px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        line-height: 19px;
        float: left;
        margin-right: 48px;
        cursor: pointer;

        &:hover {
          color: #3674D7;
        }
      }

      .active {
        color: #3674D7;
      }
    }

    .center-bottom {
      position: absolute;
      top: 17px;
      left: 21px;
      height: 32px;

      .time {
        margin-right: 48px;
        min-width: 28px;
        height: 19px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
        line-height: 19px;
      }

      .select1 {
        position: absolute;
        top: -26px;
        left: 76px;
        width: 160px;
        height: 28px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
      }

      .select {
        position: absolute;
        top: -26px;
        left: 257px;
        width: 160px;
        height: 28px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
      }
    }
  }
}
</style>
