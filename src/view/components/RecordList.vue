<template>
  <div class="trade-list">
    <div class="title">
      <img :src="tradeIcon" alt class="icon" />
      <span class="text">交易记录</span>
    </div>
    <div class="tab-list">
      <div class="tab-title">
        <div
          class="tab-item"
          v-for="(item, key) in tabList"
          :key="key"
          @click="switchTab(item.id, item.type)"
          :class="item.id === currentIndex ? 'active':''"
        >{{item.name}}</div>
      </div>

      <InfiniteLoad
        :orderList="formatAccountList"
        :isLoading="isLoading"
        :noMore="noMore"
        @loadMore="loadMore"
        @enterDetail="enterDetail"
      ></InfiniteLoad>
    </div>

    <ModalMask
      :isShowModal="isShowDetailModal"
      :isHideMask="isHideDetailMask"
      @closeModal="closeDetailModal"
      @openModal="openDetailModal"
    >
      <template v-slot:body>
        <div class="content" v-if="modalType === 1">
          <div class="content-title">充值详情</div>
          <div class="content-desc">
            <div class="key">订单号</div>
            <div class="val">{{detail.orderId}}</div>
          </div>
          <div class="content-desc">
            <div class="key">充值类型</div>
            <div class="val">{{detail.withdrawType}}</div>
          </div>
          <div class="content-desc">
            <div class="key">状态</div>
            <div class="val">{{detail.statusStr}}</div>
          </div>
          <div class="content-desc">
            <div class="key">创建时间</div>
            <div class="val">{{detail.createAt}}</div>
          </div>
          <div class="content-desc">
            <div class="key">充值{{detail.coinType}}</div>
            <div class="val">{{detail.amount}} {{detail.coin}}</div>
          </div>
        </div>
        <div class="content" v-if="modalType === 3">
          <div class="content-title">转账详情</div>
          <div class="content-desc">
            <div class="key">订单号</div>
            <div class="val">{{transfer.orderId}}</div>
          </div>
          <div class="content-desc">
            <div class="key">状态</div>
            <div class="val">{{transfer.status}}</div>
          </div>
          <div class="content-desc">
            <div class="key">转账金额</div>
            <div class="val">{{transfer.money}} USD</div>
          </div>
          <div class="content-desc">
            <div class="key">创建时间</div>
            <div class="val">{{transfer.createAt}}</div>
          </div>
          <div class="content-desc">
            <div class="key">{{transfer.isFrom}}人姓名</div>
            <div class="val">{{transfer.payName}}</div>
          </div>
          <div class="content-desc">
            <div class="key">付款账户</div>
            <div class="val">{{transfer.from}}</div>
          </div>
          <div class="content-desc">
            <div class="key">备注</div>
            <div class="val">{{transfer.comment}}</div>
          </div>
        </div>
        <div class="content" v-if="modalType === 5">
          <div class="content-title">兑换详情</div>
          <div class="content-desc">
            <div class="key">订单号</div>
            <div class="val">{{exchange.orderId}}</div>
          </div>
          <div class="content-desc">
            <div class="key">兑换金额</div>
            <div class="val">
              <div class="exchang-amount">{{exchange.bidAmount}} {{exchange.bidCoin}}</div>
              <div class="exchang-amount">{{exchange.askAmount}} {{exchange.askCoin}}</div>
            </div>
          </div>
          <div class="content-desc">
            <div class="key">兑换类型</div>
            <div class="val">{{exchange.bidCoin}} / {{exchange.askCoin}}</div>
          </div>
          <div class="content-desc">
            <div class="key">创建时间</div>
            <div class="val">{{exchange.createAt}}</div>
          </div>
          <div class="content-desc">
            <div class="key">付款账户</div>
            <div class="val">{{exchange.bidCoin}}</div>
          </div>
          <div class="content-desc">
            <div class="key">收款账户</div>
            <div class="val">{{exchange.askCoin}}</div>
          </div>
        </div>
        <div class="content" v-if="modalType === 2">
          <div class="content-title">提现详情</div>
          <div class="content-desc">
            <div class="key">订单号</div>
            <div class="val">{{detail.orderId}}</div>
          </div>
          <div class="content-desc">
            <div class="key">网络</div>
            <div class="val">{{detail.coin}}</div>
          </div>
          <div class="content-desc">
            <div class="key">状态</div>
            <div class="val">{{detail.statusStr}}</div>
          </div>
          <div class="content-desc">
            <div class="key">创建时间</div>
            <div class="val">{{detail.createAt}}</div>
          </div>
          <div class="content-desc">
            <div class="key">提现数量</div>
            <div class="val">{{detail.amount}} {{detail.fromCoin}}</div>
          </div>
          <div class="content-desc">
            <div class="key">手续费</div>
            <div class="val">{{detail.fee}} {{detail.fromCoin}}</div>
          </div>
          <div class="content-desc">
            <div class="key">变动{{detail.coinType}}</div>
            <div class="val">{{detail.dynamicMoney}} {{detail.fromCoin}}</div>
          </div>
          <div class="content-desc">
            <div class="key">接收方</div>
            <div class="val">{{detail.toAddress}}</div>
          </div>
          <div class="content-desc">
            <div class="key">备注</div>
            <div class="val">{{detail.comment}}</div>
          </div>
        </div>
      </template>
    </ModalMask>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import InfiniteLoad from "../components/InfiniteLoad";
import ModalMask from "../components/ModalMask";
import axios from "../../api/request";
import {
  fetchBill,
  fetchWithdrawDeposit,
  fetchWithdrawDepositDetail,
  fetchTransferDetail,
  fetchExchangeDetail
} from "../../api/request";
import {
  formatDate,
  getStatus,
  getDate,
  getTime,
  saveDecimal,
  formatEmail,
  sum
} from "../../filters.js";
export default {
  name: "usd_list",
  components: {
    InfiniteLoad,
    ModalMask
  },
  data() {
    return {
      manAvatar: require("../../assets/account/man_avatar_20200710.png"),
      womanAvatar: require("../../assets/account/woman_avatar_20200710.png"),
      detail: {}, // 充值、提现详情
      transfer: {}, // 转账详情
      exchange: {}, // 兑换详情
      isHideDetailMask: true,
      isShowDetailModal: false,
      tradeIcon: require("../../assets/account/record_20200710.png"), // trade
      modalType: 0, // 弹框类型
      currentIndex: 0, // 当前选中的tab
      statusKey: 0, // 类型
      rows: 10,
      page: 0,
      orderList: [],
      isLoading: true,
      noMore: false
    };
  },
  props: {
      accountType: String,
      tabList: Array
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre"]),

    ...mapGetters(["getProfit", "getWallet"]),
    formatAccountList() {
      let { rate, coinSymbol, coinAbbre, orderList } = this;

      return orderList.map(item => {
        let comment = item.comment ? item.comment : "";
        let type, state, usd, orderId;
        let order = item.orderId + "";
        let orderStart = order.substring(0, 4);
        let orderEnd = order.substring(order.length - 3, order.length);
        let orderDateTime = formatDate(item.createAt, "yyyy-MM-dd hh:mm");
        let usdt = saveDecimal(item.amount, item.showPrecision);
        let statusStr = item.status === 1 ? "成功" : "失败";
        let sex = item.sex === 1 ? "先生" : "女士";
        let coin = item.type === 3 ? "USD" : item.coin;
        let avatar;
        let name;
        let amount;
        let infos;
        orderId = orderStart + "......" + orderEnd;

        if (item.type == 1 ) {
          type = "充值";
          name = item.name === "CARD" ? "CARD": item.name;
          avatar = item.icon;
          infos = type + " · " + name;
          amount = saveDecimal(+item.amount, item.showPrecision) + (item.name = "CARD" ? "USD": item.name);
           // 根据usd计算对应的货币价格
          usd = coinAbbre === "USD" ? "":
            saveDecimal(+item.amount *  (item.name = "CARD" ? 1 : +item.usd) * rate , 2) +
            coinAbbre;
        } else if (item.type === 2) {
          type = "提现";
          avatar = item.icon;
          let money = +item.amount.replace(/^\-|\+$/, '');
          infos = type + " · " + item.name.split('-')[0];
          amount ='-'+ saveDecimal(sum(+money, +item.fee, item.showPrecision), item.showPrecision) + item.name.split('-')[0];
           // 根据usd计算对应的货币价格
          usd =
            saveDecimal(money *  +item.usd * rate , 2) +
            coinAbbre;
        } else if (item.type === 3) {
          type = "转账 ";
          if(item.avatar) {
            avatar = item.avatar;
          } else {
            avatar = item.sex === 1 ? this.manAvatar : this.womanAvatar;
          }
          let money = +item.amount.replace(/(\+|-)/, '');
         
          infos = item.name;
          amount = (item.side === 1 ? "+":"-") + saveDecimal(money, item.showPrecision) + "USD"; // side 1、来自 2、去往
          usd = coinAbbre === 'USD' ? "": saveDecimal(money * rate, item.showPrecision) + coinAbbre;
        } else if (item.type === 5) {
          let fromCoin = item.name.split('/')[0];
          let toCoin = item.name.split('/')[1];
          let fromMoney = item.amount.split('/')[0];
          let toMoney = item.amount.split('/')[1];
          let symbol = item.amount.split('')[0];
          let decimal = 2;
          type = "兑换";
          avatar = item.icon;
          infos = type + " · " + item.name;
          if(fromCoin === "USD") {
            if(toCoin === "USDT") {
              decimal = 4;
            } else if(toCoin === "BTC") {
              decimal = 8;
            } else if(toCoin === "ETH"){
              decimal = 5;
            } else {
              decimal = 2;
            }
          } else if(fromCoin === "USDT") {
            decimal = 4;
          } else if(fromCoin === "BTC") {
            decimal = 8;
          } else if(fromCoin === "ETH"){
            decimal = 5;
          }

          if(fromCoin === "USD") {
            amount =  fromMoney + fromCoin;
            usd = toMoney + toCoin;
          } else {
            amount =  fromMoney + fromCoin;
            usd = toMoney + toCoin;
          }
        } else if (item.type === 6) {
          type = "VISA转入";
          avatar = item.icon;
          amount = item.amount;
        } else if (item.type === 8) {
          type = "商家";
          avatar = item.icon;
          amount = item.amount;
        } else if (item.type === 9) {
          type = "AB卡充值";
          avatar = item.icon;
          amount = item.amount;
        }
       

        return {
          id: item.orderId,
          avator: avatar,
          createTime: orderDateTime,
          date: getDate(orderDateTime),
          time: getTime(orderDateTime),
          name: name,
          orderId: item.orderId,
          ellipsisOrderId: orderId,
          usdt: amount, // 数字货币
          usd: usd, // 转换后对应的货币 
          showPrecision: item.showPrecision, // 保留的小数位数
          state: statusStr, // 账单状态
          infos: infos, // 账单信息
          type: type, // 账单类型
          originType: item.type, // 数字type
          marks: comment // 备注
        };
      });
    }
  },
  mounted() {
    this.switchTab(1, 1);
    this.fetchWallet();
  },
  methods: {
    ...mapActions(['fetchWallet']),
    openDetailModal(a) {
      this.isShowDetailModal = a;
      this.isHideDetailMask = false;
    },
    closeDetailModal(a) {
      this.isShowDetailModal = a;
      this.isHideDetailMask = true;
    },
    // 切换tab
    switchTab(id, type) {
      this.noMore = false;
      this.orderList = [];
      this.page = 1;
      this.statusKey = type;
      this.currentIndex = id;
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

      const params = {
        type: this.statusKey,
        page: this.page,
        rows: this.rows,
        coin: this.accountType
      };

      this.isLoading = false;

      const res = await axios.fetchTradeRecord(params);

      this.isLoading = true;

      if (res.code === 0) {
        let { transactions } = res.data;
  
        this.orderList = [...this.orderList, ...transactions];
        if (transactions.length === 0) this.noMore = true;
      } else {
        this.$Message.error(res.msg);
      }
    },
    // enterDetail
    async enterDetail(id, type) {
      this.modalType = type;
      const params = { orderId: id };
      if (type === 1 || type === 2) {
        // 充值 提现
        const res = await fetchWithdrawDepositDetail(params);
        let item = res.data;
  
        this.detail = {
          orderId: item.orderId,
          coin: item.coin === "AB" ? "USD": item.coin,
          fromCoin: item.coin.split('-')[0],
          statusStr: item.statusStr,
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          amount: saveDecimal(item.amount, item.showPrecision),
          txidPrefixUrl: item.txidPrefixUrl,
          fee: saveDecimal(item.fee, item.showPrecision),
          fromAddress: item.fromAddress,
          toAddress: item.toAddress,
          txHash: item.txHash,
          comment: item.comment,
          coinType: item.coin === "AB" ? "金额":"数量",
          withdrawType: item.coin === "AB" ? "CARD":"",
          dynamicMoney: saveDecimal(sum(item.fee, item.amount, item.showPrecision), item.showPrecision)  // 变动金额
        };
      } else if (type === 3) {
        // 转账
        const res = await fetchTransferDetail(params);
        let item = res.data;
        this.transfer = {
          orderId: item.orderId,
          userId: item.userId,
          status: item.status ? "成功" : "失败",
          isFrom: item.money.indexOf('-') > -1 ? "收款":"付款",
          money: saveDecimal(item.money.replace(/-/, ''), 2),
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          payName: `${item.lastName}(*${item.lastName})`,
          from: formatEmail(item.from),
          to: item.to,
          comment: item.comment
        };
      } else if (type === 5) { // 兑换
        const res = await fetchExchangeDetail(params);
        let item = res.data;
        this.exchange = {
          orderId: item.orderId,
          askCoin: item.askCoin, // 被被兑换币种
          bidCoin: item.bidCoin, // 兑换币种
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          bidAmount: "-" + item.strBidAmount , // 兑换金额
          askAmount: "+" + item.strAskAmount, // 被兑换数量
          usd: item.usd, // 兑换时汇率
        };
      }
      this.openDetailModal(true);
    }
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

.trade-list {
  margin: 0 30px;
  background: #fff;
  .title {
    @include title;
  }
  .tab-list {
    margin: 0 64px;
    border-bottom: 1px solid #eeeeee;
    font-size: 14px;
    .tab-title {
      padding: 17px 0;
      .tab-item {
        background: #fff;
        display: inline-block;
        // padding: 5px 18px;
        color: #666;
        cursor: pointer;
        margin-right: 95px;
        transition: all 0.2s ease-out;
        &:hover {
          color: #3674D7;
          font-weight: bold;
        }
      }
      .active {
        // background: #3674d7;
        color: #3674d7;
        border-radius: 3px;
      }
    }
  }
}
.content {
  width: 760px;
  padding: 32px 88px 60px;
  .content-title {
    font-size: 22px;
    color: #000;
    font-weight: bold;
    text-align: center;
  }
  .content-desc {
    display: flex;
    justify-content: space-between;
    color: #999;
    font-size: 14px;
    margin-top: 44px;
    .exchang-amount {
      text-align: right;
    }
  }
}
</style>