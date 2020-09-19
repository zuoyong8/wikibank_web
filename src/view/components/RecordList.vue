<template>
  <div class="trade-list">
    <div class="title">
      <img :src="tradeIcon" alt class="icon" />
      <span class="text">{{$t('account.record')}}</span>
    </div>
    <div class="tab-list">
      <div class="tab-title">
        <div
          class="tab-item"
          v-for="(item, key) in tabList"
          :key="key"
          @click="switchTab(item.id, item.type)"
          :class="item.id === currentIndex ? 'active':''"
        >{{$t('home.'+item.name)}}</div>
      </div>

      <InfiniteLoad
        :orderList="formatAccountList"
        :isLoading="isLoading"
        :noMore="noMore"
        @loadMore="loadMore"
        @enterDetail="enterDetail"
      ></InfiniteLoad>
    </div>

    <AccountDetail
        :detail="detail"
        :transfer="transfer"
        :exchange="exchange"
        :isHideDetailMask="isHideDetailMask"
        :isShowDetailModal="isShowDetailModal"
        :modalType="modalType"
        @closeDetailModal="closeDetailModal"
      ></AccountDetail>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import InfiniteLoad from "@/view/components/InfiniteLoad";
import ModalMask from "@/view/components/ModalMask";
import axios from "@/api/request";
import AccountDetail from "@/view/components/AccountDetail";
import {
  fetchBill,
  fetchWithdrawDeposit,
  fetchWithdrawDepositDetail,
  fetchTransferDetail,
  fetchExchangeDetail
} from "@/api/request";
import {
  formatDate,
  getStatus,
  getDate,
  getTime,
  saveDecimal,
  formatEmail,
  formatTel,
  sum
} from "@/filters.js";
export default {
  name: "usd_list",
  components: {
    InfiniteLoad,
    ModalMask,
    AccountDetail
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
        let statusStr = item.status === 1 ? this.$t('home.success') : this.$t('home.fail');
        let coin = item.type === 3 ? "USD" : item.coin;
        let avatar;
        let name;
        let amount;
        let infos;
        orderId = orderStart + "......" + orderEnd;

        if (item.type == 1 ) {
          type = this.$t("home.deposit");
          name = item.name === "AB" ? "CARD": item.name.split('-')[0];
          avatar = item.icon;
          infos = type + " · " + name;
          amount = saveDecimal(+item.amount, item.showPrecision) + (item.name === "AB" ? " USD": ` ${name}`);
          // 根据usd计算对应的货币价格
          usd = coinSymbol + saveDecimal(+item.amount *  (item.name === "AB" ? 1 : +item.usd) * rate , 2) +
            ` (${coinAbbre})`;
        } else if (item.type === 2) {
          type = this.$t("home.withdraw");
          avatar = item.icon;
          let money = +item.amount.replace(/^\-|\+$/, '');
          infos = type + " · " + item.name.split('-')[0];
          amount ='-'+ saveDecimal(sum(+money, +item.fee), item.showPrecision) + ' ' + item.name.split('-')[0];
           // 根据usd计算对应的货币价格
          usd = coinSymbol +
            saveDecimal(sum(money, +item.fee) *  +item.usd * rate , 2) +
            ` (${coinAbbre})`;
        } else if (item.type === 3) {
          type = this.$t("home.transfer");
          if(item.avatar) {
            avatar = item.avatar;
          } else {
            avatar = item.sex === 1 ? this.manAvatar : this.womanAvatar;
          }
          let money = +item.amount.replace(/(\+|-)/, '');
          let addr = item.amount.indexOf('-') > -1 ? '-':'+';
          infos = item.name;
          amount = addr + '$' + saveDecimal(money, item.showPrecision) + " (USD)"; // side 1、来自 2、去往
          usd = coinAbbre === 'USD' ? "": coinSymbol + saveDecimal(money * rate, item.showPrecision) + ` (${coinAbbre})`;
        } else if (item.type === 5) {
          type = this.$t("home.exchange");
          let fromCoin = item.name.split('/')[0];
          let toCoin = item.name.split('/')[1];
          let fromMoney = item.amount.split('/')[0];
          let toMoney = item.amount.split('/')[1];
          let decimal = 2;
          let fromAddr = fromMoney.indexOf('-') > -1 ? '-':'+';
          let toAddr = toMoney.indexOf('-') > -1 ? '-':'+';
          avatar = item.icon;
          infos = type + " ( " + (fromCoin === 'USD' ? this.$t('home.usdAbbr'):fromCoin) + ' → ' + (toCoin === 'USD' ? this.$t('home.usdAbbr'):toCoin) + " ) ";
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
          } else if(toCoin === "USDT") {
            decimal = 4;
          } else if(toCoin === "BTC") {
            decimal = 8;
          } else if(toCoin === "ETH"){
            decimal = 5;
          }

          if(toCoin === "USD") {
            amount = toAddr + (toCoin === 'USD' ? '$':'') + (toMoney ? toMoney : '0.00').replace(/(\+|-)/, '') + ` (${toCoin})`;
            usd = coinAbbre === 'USD'? '':coinSymbol + saveDecimal(toMoney * rate, 2) + ` (${coinAbbre})`;
          } else {
            amount = (toMoney ? toMoney : '0.00') +` ${toCoin}`;
            usd = coinSymbol + saveDecimal(toMoney * rate * item.usd, 2) + ` (${coinAbbre})`;
          }
        } else if (item.type === 6) {
          type = this.$t("account.visaPay");
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
          date: getDate(item.createAt),
          time: getTime(item.createAt),
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
  async mounted() {
    try {
      const { id, type } = this.$route.query
      this.switchTab(+id, type);
      await this.fetchWallet();
    } catch (error) {
      this.$Message.error(this.$t('login.alreadyLogin'));
    }
    
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
        if (transactions.length === 0 || transactions.length < this.rows) this.noMore = true;
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
        let { status } = res.data;
        let typeText, statusText;
        if(type === 1) {
          typeText = this.$t('home.deposit');
        } else if(type === 2) {
          typeText = this.$t("home.withdraw");
        }
        switch(status) {
          case 1:
            statusText = this.$t("home.notCheck");
            break;
          case 2:
            statusText = this.$t("home.checking");
            break;
          case 3:
            statusText = type === 1 ? this.$t("home.depositing") : this.$t("home.withdrawAsset");
            break;
          case 4:
            statusText = type === 1 ? this.$t("account.depositSuccessStatus"):this.$t("account.withdrawSuccessStatus");
            break;
          case 5:
            statusText = type === 1 ? this.$t("account.depositFailStatus"):this.$t("account.withdrawFailStatus");
            break;
          case 6:
            statusText = this.$t("home.checkFail");
            break;
        }
        let usd = item.accountType === 2 ? item.usd : 1; // USD账户汇率为 item.usd 数字货币账户汇率为 1
        let decimal = item.accountType === 2 ?  2 : item.showPrecision;
        this.detail = {
          orderId: item.orderId,
          coin: item.coin === "AB" ? "USD": item.coin,
          fromCoin: item.coin.split('-')[0],
          toCoin: item.coin.split('-')[1],
          status: item.status,
          statusStr: statusText,
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          amount: saveDecimal(item.amount * usd, decimal), // 提现金额/数量
          depositAmount: saveDecimal(item.amount * item.usd, 2),
          number: saveDecimal(item.amount, item.showPrecision),
          txidPrefixUrl: item.txidPrefixUrl + item.txHash,
          fee: saveDecimal(item.fee * usd, decimal), // 提现手续费
          fromAddress: item.fromAddress,
          toAddress: item.toAddress,
          txHash: item.txHash ,
          comment: item.comment,
          coinType: item.coin === "AB" ? this.$t("home.money"):this.$t("account.amount"),
          withdrawType: item.coin === "AB" ? "CARD":"",
          dynamicAccount: (item.coin === "AB" || item.accountType === 2) ? this.$t('home.dynamicMoney'): this.$t('home.dynamicNum'),
          dynamicMoney: saveDecimal(sum(item.fee * usd, item.amount * usd), decimal),  // 变动金额/数量
          accountType: item.accountType === 2 ? 'USD': item.coin.split('-')[0],
          amountType: item.accountType === 2 ? this.$t('home.money'): this.$t('account.amount'),
          usd: item.usd,
          type: item.accountType,
          usdAmount: saveDecimal(item.amount, item.showPrecision)
        };
      } else if (type === 3) {
        // 转账
        const res = await fetchTransferDetail(params);
        let item = res.data;
        let addr = item.money.indexOf('-') > -1 ? '-':'+';
        this.transfer = {
          orderId: item.orderId,
          userId: item.userId,
          status: item.status ? this.$t('home.success') : this.$t('home.fail'),
          isFrom: item.money.indexOf('-') > -1 ? this.$t('account.incomeName') : this.$t('home.payName'),
          money: addr + '$' + saveDecimal(item.money.replace(/-/, ''), 2),
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          payName: `${item.lastName}(*${item.lastName})`,
          from: formatTel(item.from),
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
          bidAmount: "-" + (item.bidCoin === 'USD' ? `$${item.strBidAmount}`:item.strBidAmount) , // 兑换金额
          askAmount: "+" + (item.askCoin === 'USD' ?  `$${item.strAskAmount}`:item.strAskAmount), // 被兑换数量
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
  margin: 0 30px 0;
  background: #fff;
  border-radius: 4px;
  .title {
    @include title;
  }
  .tab-list {
    margin: 0 64px;
    font-size: 14px;
    .tab-title {
      display: flex;
      padding: 17px 0;
      .tab-item {
        // width: 25%;
        background: #fff;
        display: inline-block;
        padding: 5px 90px 5px 0;
        color: #666;
        cursor: pointer;
        // margin-right: 95px;
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
  width: 560px;
  padding: 32px 40px 60px;
  .content-title {
    margin-bottom: 40px;
    font-size: 22px;
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  .content-desc {
    margin-bottom: 28px;
    display: flex;
    justify-content: space-between;
    color: #999;
    font-size: 14px;
    .val {
      color: #333;
    }
    &:last-child{
      margin-bottom: 0;
    }
    .exchang-amount {
      text-align: right;
    }
    .hash {
      cursor: pointer;
    }
    .show-content {
      color: #3674D7;
      cursor: pointer;
    }
    .long-content {
      width: 360px;
      text-align: right;
      word-break: break-word;
    }
  }
}
</style>