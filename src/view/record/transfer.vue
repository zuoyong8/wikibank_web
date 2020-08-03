<template>
  <div class="record">
    <div class="title">
      <icon name="mine3" class="title-icon"></icon>
      <h4>转账记录</h4>
    </div>
    <div class="center">
      <div class="center-c">
        <div class="txt">状态</div>
        <div
          class="option"
          v-for="item in statusFilter"
          :key="item.id"
          @click="getTransferList(item.status)"
          :class="item.status === statusKey ? 'active':''"
        >
          <div>{{item.name}}</div>
        </div>
      </div>
      <div class="center-bottom">
        <h4 class="time">时间</h4>
        <Row>
          <Date-picker
            type="date"
            placeholder
            class="select1"
            value="startTime"
            style="width:160px;heigth:180px"
            @on-change="startChange"
          ></Date-picker>
          <Date-picker
            type="date"
            placement="bottom-end"
            placeholder
            class="select"
            style="width:160px;heigth:180px"
            value="endTime"
            @on-change="endChange"
          ></Date-picker>
        </Row>
      </div>
    </div>
    <InfiniteLoad
      :orderList="formatTransferList"
      :isLoading="isLoading"
      :noMore="noMore"
      @loadMore="loadMore"
      @enterDetail="enterDetail"
    ></InfiniteLoad>
    <!-- <table class="asset">
        <tr class='header'>
            <th><div class="first">类别</div></th>
            <th><div class="sec"> 订单时间</div></th>
            <th><div class="third">名称 | 账号 | 订单号</div></th>
            <th><div class="forth">金额 | 明细</div> </th>
            <th><div class="fifth">状态</div> </th>
            <th><div class="six">备注</div></th>
            <th><div class="seven">操作</div></th>
        </tr>
        <tr class="row" v-for='(info,index) in infos' :key='index'>
            <td><div class="avatar"><img :src="info.avatar" alt="图片飞走了"></div></td>
            <td>
                <div class="time">{{info.createAt}}</div>
            </td>
            <td><div class="sec">
                 <div class="time-top">{{info.info}}</div>
               <div class="time-bottom">订单号：{{info.orderNumber}}</div>
                </div></td>
            <td><div class="third">{{info.money}}</div></td>
            <td><div class="forth">转账成功</div></td>
            <td><div class="fifth">转账</div></td>
            <td><div class="six">详情</div></td>
        </tr>
    </table>-->
  </div>
</template>

<script>
import "../../icons/mine3";
import { formatDate, getStatus, getDate, getTime, formatNumberFloor } from "../../filters.js";
import InfiniteLoad from "../components/InfiniteLoad.vue";
import { mapState } from "vuex";
import { fetchTransfer } from "../../api/request";

export default {
  components: {
    InfiniteLoad
  },
  data() {
    return {
      statusFilter: [
        {
          id: 1,
          name: "全部",
          status: 0
        },
        {
          id: 2,
          name: "成功",
          status: 1
        },
        {
          id: 3,
          name: "失败",
          status: 2
        }
      ],
      rows: 10,
      page: 1,
      startTime: 0,
      endTime: 0,
      end: "",
      start: "",
      statusKey: 0,
      transferList: [],
      isLoading: true,
      noMore: false
    };
  },
  methods: {
    // timeChange() {
    //   let params = {};
    //   if (this.startTime != "") {
    //     this.start = new Date(this.startTime).getTime().toString();
    //   }
    //   if (this.endTime != "") {
    //     this.end = (new Date(this.endTime).getTime() + 86399000).toString();
    //   }
    //   if (this.start != "") {
    //     params.startTime = this.start;
    //   }
    //   if (this.end != "") {
    //     params.endTime = this.end;
    //   }
    //   if (this.statusKey > 1) {
    //     params.status = this.statusKey;
    //   }
    // },
    // 详情
    enterDetail(id) {
      this.$router.push(`/console/record/transfer/${id}`);
    },

    startChange(val) {
      this.startTime = new Date(val).getTime();

      this.setDate();
    },

    endChange(val) {
      this.endTime = new Date(val).getTime();
      this.setDate();
    },

    setDate() {
      this.noMore = false;
      this.transferList = [];
      this.page = 1;

      this.fetchDate();
    },

    loadMore() {
      if (!this.isLoading) return;
      if (this.noMore) return;

      this.page = this.page + 1;

      this.fetchDate();
    },

    getTransferList(status) {
      // const rows = this.rows;
      // const page = this.page;
      // const startTime = this.startTime;
      // const endTime = this.endTime;
      // this.statusKey = status;
      // let params = {
      //   status: status,
      //   rows,
      //   page,
      //   startTime,
      //   endTime
      // };
      // this.fetchTransferList(params);
      this.noMore = false;
      this.transferList = [];
      this.page = 1;
      this.statusKey = status;

      this.startTime = new Date(this.startTime).getTime();
      this.endTime = new Date(this.endTime).getTime();
  
      this.fetchDate();
    },

    async fetchDate() {
      if (!this.isLoading) return;
      if (this.noMore) return;

      const params = {
        status: this.statusKey,
        rows: this.rows,
        page: this.page,
        startDate: this.startTime,
        endDate: this.endTime
      };

      this.isLoading = false;

      const res = await fetchTransfer(params);

      this.isLoading = true;

      if (res.code === 0) {
        let { transInfo } = res.data;

        this.transferList = [...this.transferList, ...transInfo];
        if (transInfo.length === 0) this.noMore = true;
        
      } else {
        this.$Message.error(res.msg);
      }
    }
  },
  mounted() {
    this.getTransferList(0);
  },
  computed: {
    ...mapState({
      rate: "rate",
      coinSymbol: "coinSymbol",
      coinAbbre: "coinAbbre"
    }),
    formatTransferList() {
      let { rate, coinSymbol, coinAbbre, transferList } = this;

      return transferList.map( item => {
          
          let type, state, usd, orderId;
          let order = item.orderNumber+"";
          let orderStart = order.substring(0,4);
          let orderEnd = order.substring(order.length-3, order.length);
          let orderDateTime = formatDate(item.createAt, "yyyy-MM-dd hh:ss");
          let usdt = formatNumberFloor(item.amount, 2);

          orderId = orderStart + "......" + orderEnd;

          // 根据usd计算对应的货币价格
          usd = coinSymbol + formatNumberFloor(item.money * rate, 2) + coinAbbre;;

          let from = item.type === 1 ? "来自":"去往";

          return {
              id: item.orderNumber,
              avator: item.avatar,
              createTime: orderDateTime,
              date: getDate(orderDateTime),
              time: getTime(orderDateTime),
              name: from + item.firstName + item.lastName,
              account: "USDT-ERC20",
              orderId: item.orderNumber,
              ellipsisOrderId: orderId,
              usdt: item.money + "USD", // 数字货币
              usd: "≈" + usd, // 转换后对应的货币
              state: item.statusStr, // 账单状态
              type: "转账", // 账单类型
              marks: item.comment
          }
      });
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
    height: 102px;
    position: relative;
    background: rgba(245, 246, 250, 1);
    margin-bottom: 20px;

    .center-c {
      height: 20px;
      margin-top: 20px;
      position: absolute;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
      left: 21px;
      top: 50px;

      .txt {
        float: left;
        margin-right: 48px;
      }

      .option {
        min-width: 28px;
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
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
      }

      .select {
        position: absolute;
        top: -26px;
        left: 257px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
      }
    }
  }
}
</style>