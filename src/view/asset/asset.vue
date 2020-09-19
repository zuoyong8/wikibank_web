<template>
    <div class>
      <div class="assets-info">
        <div class="title">
          <span class="text">{{$t('home.allAsset')}}</span>
          <span
            class="hide-assets"
            @click="changeShowState"
          >{{isShowAsset==="show" ? $t('home.'+hideAsset):$t('home.'+showAsset)}}</span>
        </div>
        <div class="assets-box">
          <div class="assets-data">
            <div class="all-assets">
              <div class="wallet">
                {{ isShowAsset==="show" ? `${coinSymbol}` + getWallet.total: "******"}}
                <span
                  class="coin-marks"
                >({{coinAbbre}})</span>
              </div>
            </div>

            <div class="account-list">
              <div class="available account-item">
                {{$t('home.availAsset')}}
                <div class="number">{{isShowAsset==="show" ? `${coinSymbol}` + getWallet.available + ` (${coinAbbre})` : "****"}}</div>
              </div>
              <div class="withdraw account-item">
                {{$t('home.withdrawAsset')}}
                <div class="number">{{isShowAsset==="show" ? `${coinSymbol}` + getWallet.withdraw + ` (${coinAbbre})`: "****"}}</div>
              </div>
              <div class="valuation account-item">
                {{$t('home.valuaAsset')}}
                <div class="number">{{isShowAsset==="show" ? `${coinSymbol}` + getProfit.evaluate + ` (${coinAbbre})`: "****"}}</div>
              </div>
              <div class="profit account-item">
                {{$t('home.profit')}}
                <div class="number">{{getProfit.annual}}%</div>
              </div>
            </div>
          </div>
          <div class="assets-pie">
            <h4 class="pie-title">
              <span>{{$t("home.assetsPercent")}}</span>
            </h4>
            <div ref="assetsPie" class="pie"></div>
            <!--
            <div class="pie-bottom">分布比例按照资产折合价值</div>
            -->
          </div>
          <div class="assets-progress">
            <div class="group" v-for="(item, index) in progressList" :key="index">
              <span class="intro">{{item.name === 'USD'? $t('home.usdAbbr'):item.name}}</span>
              <span class="progress">
                <i :style="{width: item.percent}"></i>
              </span>
              <span class="percent">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="coin-info">
        <div class="coin-title">
          <div class="type">{{$t('home.account')}}</div>
          <div class="available">{{$t('home.availAsset')}}</div>
          <div class="withdraw">{{$t('home.withdrawAsset')}}</div>
          <div class="valuation">{{$t('home.valua')}}</div>
        </div>
        <div class="coin-row" v-for="(item, key) in getAccountList" :key="key">
          <div class="coin-item" @click="goAccount(item.coinName)">
            <div class="type">
              <img :src="item.coinAvatar" alt class="coin-avator" />
              <span class="coin-name">{{item.coinName === 'USD' ? $t('leftMenu.usdAccount'):`${item.coinName} ` + $t('home.account')}}</span>
            </div>
            <div class="available">{{isShowAsset==="show" ? item.available: "******"}}</div>
            <div class="withdraw">{{isShowAsset==="show" ? item.withdraw: "******"}}</div>
            <div class="valuation">{{isShowAsset==="show" ? `${coinSymbol}` + `${item.evaluate} (${coinAbbre})`: "******"}} </div>
          </div>
        </div>
      </div>
      <div class="tab-list">
        <ul class="tabs">
          <li
            v-for="(tab, index) in tabs"
            :key="index"
            @click="changeTab(tab.id, tab.type)"
            class="tab"
            :class="{tabActive:tabIndex == index}"
            :ref="'tab'+ tab.id"
          >{{$t('home.'+tab.name)}}</li>
          <div class="tab-line" :style="{left: (number)+ 'px', width: tabLineWidth + 'px'}"></div>
        </ul>
        <div class="tab-item">
          <InfiniteLoad
            :orderList="formatAccountList"
            :isLoading="isLoading"
            :noMore="noMore"
            @loadMore="loadMore"
            @enterDetail="enterDetail"
          ></InfiniteLoad>
        </div>
      </div>

      <AccountDetail
        :detail="detail"
        :transfer="transfer"
        :exchange="exchange"
        :vasaDetail="vasaDetail"
        :isHideDetailMask="isHideDetailMask"
        :isShowDetailModal="isShowDetailModal"
        :modalType="modalType"
        @closeDetailModal="closeDetailModal"
      ></AccountDetail>
    </div>
</template>

<script>
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';

import {
  formatDate,
  getDate,
  getTime,
  saveDecimal,
  formatTel,
  getCoinDigit,
  formatEmail,
  sum
} from "@/filters.js";
import InfiniteLoad from "@/view/components/InfiniteLoad";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  fetchBill,
  fetchWithdrawDepositDetail,
  fetchTransferDetail,
  fetchExchangeDetail,
} from "@/api/request";
import ModalMask from "@/view/components/ModalMask";
import AccountDetail from "@/view/components/AccountDetail";

export default {
  data() {
    return {
      manAvatar: require("../../assets/account/man_avatar_20200710.png"),
      womanAvatar: require("../../assets/account/woman_avatar_20200710.png"),
      detail: {}, // 充值、提现详情
      transfer: {}, // 转账详情
      exchange: {}, // 兑换详情
      vasaDetail: {}, // vasa 卡
      isHideDetailMask: true,
      isShowDetailModal: false,
      modalType: 0, // 弹框类型
      hideAsset: "hideAsset",
      showAsset: "showAsset",
      typeImage: require("../../assets/imgs/flag_icon_20200526.png"),
      infos: [],
      timer: null, // 计时器
      tabs: [
        {
          id: 0,
          name: "all",
          type: 0,
        },
        {
          id: 1,
          name: "deposit",
          type: 1,
        },
        {
          id: 2,
          name: "transfer",
          type: 3,
        },
        {
          id: 3,
          name: "exchange",
          type: 5,
        },
        {
          id: 4,
          name: "withdraw",
          type: 2,
        },
      ],
      tabIndex: 0, // tab下划线
      number: 0, // 下划线
      statusKey: 0,
      rows: 10,
      page: 0,
      orderList: [],
      isLoading: true,
      noMore: false,

      pieChart: null,
      progressList: [],
      tabLineWidth: 0,
    };
  },
  components: {
    InfiniteLoad,
    ModalMask,
    AccountDetail
  },
  async mounted() {
    try {
      this.changeTab(0, 0);
      await this.fetchWallet();
      await this.fetchProfit();
      await this.drawPieChart();
    } catch (error) {
      this.$Message.error(this.$t('login.alreadyLogin'));
    }
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre", "isShowAsset"]),

    ...mapGetters(["getProfit", "getWallet", "getAccountList"]),

    formatAccountList() {
      let { rate, coinSymbol, coinAbbre, orderList } = this;

      return orderList.map((item) => {
        let comment = item.comment ? item.comment : "";
        let type, state, usd, orderId;
        let order = item.orderId + "";
        let orderStart = order.substring(0, 4);
        let orderEnd = order.substring(order.length - 3, order.length);
        let orderDateTime = formatDate(item.createAt, "yyyy-MM-dd hh:mm");

        let statusStr = item.status === 1 ? this.$t('home.success') : this.$t('home.fail');
        let coin = item.type === 3 ? "USD" : item.coin;
        let avatar;
        let name;
        let infos = item.info;
        let usdt;
        orderId = orderStart + "......" + orderEnd;

        if (item.type === 1) {
          type = this.$t("home.deposit");
          avatar = item.icon;
          name = item.coin;
          usdt = saveDecimal(item.money, item.showPrecision) + ' ' + item.coin.split('-')[0];
          usd = coinSymbol + saveDecimal(+item.money *  (item.coin === "AB" ? 1 : +item.usd) * rate , 2) +
            ` (${coinAbbre})`;
        } else if (item.type === 2) {
          type = this.$t("home.withdraw");
          avatar = item.icon;
          name = item.coin;
          let money = +item.money.replace(/(\+|-)/g, "");
          usdt = saveDecimal(+item.money, item.showPrecision) + ' ' + item.coin.split('-')[0];
          usd = coinSymbol + saveDecimal(money *  (item.coin === "AB" ? 1 : +item.usd) * rate , 2) +
            ` (${coinAbbre})`;;
        } else if (item.type === 3) {
          type = this.$t("home.transfer");
          if (!item.avatar) {
            avatar = item.sex === 1 ? this.manAvatar : this.womanAvatar;
          } else {
            avatar = item.avatar;
          }
          let money = +item.money.replace(/(\+|-)/g, "");
          name = item.firstName;
          usdt =
            (item.money.indexOf("-") > -1 ? "-" : "+") + '$' +
            saveDecimal(money, 2) +
            " (USD)"; // side 1、来自 2、去往
          usd =
            coinAbbre === "USD"
              ? ""
              : coinSymbol + saveDecimal(money * rate, 2) + ` (${coinAbbre})`;
        } else if (item.type === 5) {
          type = this.$t("home.exchange");
          avatar = item.icon;
          infos = item.info + " ( " + (item.fromCoin === 'USD' ? this.$t('home.usdAbbr'):item.fromCoin) + " → " + (item.toCoin === 'USD' ? this.$t('home.usdAbbr'):item.toCoin) + " ) ";

          let fromMoney = item.money.replace(/(\+|-)/g, "");
          let toMoney = item.toMoney.replace(/(\+|-)/g, "");
          let fromPrec = getCoinDigit(item.fromCoin);
          let toPrec = getCoinDigit(item.toCoin);
          usdt = "+" + (item.toCoin === 'USD' ? '$':'') + saveDecimal(toMoney, toPrec) + (item.toCoin === 'USD' ? ` (${item.toCoin})`: ` ${item.toCoin}`);
          usd = coinAbbre === 'USD' ? '':coinSymbol + saveDecimal(item.toCoin === 'USD' ? toMoney * rate: toMoney * rate * item.usd, 2) + ` (${coinAbbre})`;
         
        } else if (item.type === 6) {
          type = this.$t("account.visaPay");
          avatar = item.icon;
          let fromMoney = +item.money.replace(/(\+|-)/g, "");
          usdt = "+" + saveDecimal(fromMoney, 2) + "USD";
          usd =
            item.fromCoin === "USD"
              ? ""
              : saveDecimal(fromMoney * rate, 2) + coinAbbre;
        } else if (item.type === 8) {
          type = "商家";
          avatar = item.icon;
        } else if (item.type === 9) {
          type = "AB卡充值";
          avatar = item.icon;
          let fromMoney = +item.money.replace(/(\+|-)/g, "");
          usdt = "+" + saveDecimal(fromMoney, 2) + "USD";
          usd =
            item.fromCoin === "AB"
              ? ""
              : saveDecimal(fromMoney * rate, 2) + coinAbbre;
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
          usdt: usdt, // 数字货币
          usd: usd, // 转换后对应的货币
          showPrecision: item.showPrecision, // 保留的小数位数
          state: statusStr, // 账单状态
          infos: infos, // 账单信息
          type: type, // 账单类型
          originType: item.type, // 数字type
          marks: comment, // 备注
        };
      });
    },
  },
  methods: {
    ...mapMutations(["changeAssetStatus", "changeNav"]),
    ...mapActions(["fetchProfit", "fetchWallet"]),
    goAccount(account) {
      let id = 1;
      if(account === 'USD') {
        id = 21;
      } else if (account === "USDT") {
        id = 23
      } else if (account === "BTC") {
        id = 24
      } else if (account === "ETH") {
        id = 22
      }
      this.changeNav(id);
      this.$router.push({
        path: `/${account}`,
        query: { id: 1, type: 1 }
      })
    },
    //pie chart
    async drawPieChart() {
      let that = this;
      this.pieChart = echarts.init(this.$refs.assetsPie);
      let { usdTotal, usdtTotal, ethTotal, btcTotal, allTotal } = this.getWallet;
      let { getAccountList, rate } = this;

      let data = getAccountList.map( item => {
        return {
          name: item.coinName,
          value: item.evaluate,
          percent: saveDecimal(item.evaluate / allTotal * 100, 2) + "%",
          total: item.total,
        }
      });
      let option = {
        color: [
          "#3674D7",
          "rgba(54,116,215,0.79)",
          "rgba(54,116,215,0.49)",
        ],
        tooltip: {
          trigger: "item",
          formatter: function(item) {
            const { name, total } = item.data;
            return `${name}: ${total}`
          }
        },
        series: [
          {
            type: "pie",
            radius: [0, "60%"],
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 2,
              },
            },
            data: data,
          },
        ],
      };
      this.pieChart.setOption(option);
      window.addEventListener("resize", () => {
        this.pieChart.resize();
      });
      this.progressList = data;
    },

    changeShowState() {
      if (this.isShowAsset === "show") {
        this.changeAssetStatus("hide");
      } else {
        this.changeAssetStatus("show");
      }
    },
    closeModal() {
      this.closeDetailModal(false);
    },
    closeDetailModal(a) {
      this.isShowDetailModal = a;
      this.isHideDetailMask = true;
    },
    openDetailModal(a) {
      this.isShowDetailModal = a;
      this.isHideDetailMask = false;
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
      };

      this.isLoading = false;
      const res = await fetchBill(params);
      this.isLoading = true;

      if (res.code === 0) {
        let { infos } = res.data;

        this.orderList = [...this.orderList, ...infos];
        if (infos.length === 0 || infos.length < this.rows) this.noMore = true;
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 切换tab
    changeTab(id, value) {
      this.noMore = false;
      this.orderList = [];
      this.page = 1;
      this.statusKey = value;

      this.tabIndex = id;
      let left = this.$refs['tab'+ id][0].offsetLeft;
      this.tabLineWidth = this.$refs['tab'+ id][0].offsetWidth - 92;
      this.number = left;
      this.fetchDate();
    },

    // enterDetail
    async enterDetail(id, type) {
      this.modalType = type;
      const params = {
        orderId: id,
      };
      if (type === 1 || type === 2 || type === 9) {
        // 充值 提现 CARD 充值
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

            statusText = type === 1 ? this.$t("home.depositing") : this.$t("hoem.withdrawAsset");
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
          coin: item.coin === "AB" ? "CARD" : item.coin,
          fromCoin: item.coin.split('-')[0],
          toCoin: item.coin.split('-')[1],
          status: item.status,
          statusStr: statusText,
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          amount: saveDecimal(item.amount * usd, decimal),
          depositAmount: saveDecimal(item.amount * item.usd, 2),
          number: saveDecimal(item.amount, item.showPrecision),
          txidPrefixUrl: item.txidPrefixUrl + item.txHash,
          fee: saveDecimal(item.fee * usd, decimal),
          fromAddress: item.fromAddress,
          toAddress: item.toAddress,
          txHash: item.txHash,
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
          isFrom: item.money.indexOf("-") > -1 ? this.$t('account.incomeName') : this.$t('home.payName'),
          money:  addr + '$' + saveDecimal(item.money.replace(/-/, ''), 2),
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          payName: `${item.lastName}(*${item.lastName})`,
          from: formatTel(item.from),
          to: item.to,
          comment: item.comment,
        };
      } else if (type === 5) {
        // 兑换
        const res = await fetchExchangeDetail(params);
        let item = res.data;
        this.exchange = {
          orderId: item.orderId,
          askCoin: item.askCoin, // 被被兑换币种
          bidCoin: item.bidCoin, // 兑换币种
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          bidAmount: "-" + (item.bidCoin === 'USD' ? `$${item.strBidAmount}`:item.strBidAmount), // 兑换金额
          askAmount: "+" + (item.askCoin === 'USD' ? `$${item.strAskAmount}`:item.strAskAmount), // 被兑换数量
          usd: item.usd, // 兑换时汇率
          comment: item.comment,
        };
      } else if (type === 6) {
        let { orderList } = this;
        let { orderId, createAt, toMoney, fromCoin, toCoin, info } = orderList.find( item => item.orderId === id)
        this.vasaDetail = {
          orderId: orderId,
          createAt:  formatDate(createAt, "yyyy-MM-dd hh:mm:ss"),
          toMoney: saveDecimal(toMoney, 2),
          fromCoin: fromCoin,
          toCoin: toCoin,
          info:info
        }
      }
      this.openDetailModal(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin bill-item {
  .type {
    width: 100px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .date {
    width: 150px;
  }

  .name {
    width: 320px;
  }

  .money {
    width: 200px;
  }

  .marks,
  .state,
  .operate {
    width: 100px;
  }
}

@mixin line {
  display: inline-block;
  margin: 0 10px;
  width: 1px;
  height: 10px;
  border-radius: 1px;
  background: #e5e5e5;
}

@mixin title {
  font-size: 14px;
  color: #333;
}

@mixin subtitle {
  font-size: 12px;
  color: #999;
}
// .right {
//   height: 100%;
//   padding-top: 20px;
//   width: 1330px;
//   margin: 0 auto;

  .assets-info {
    position: relative;
    margin: 45px 30px 0;
    background: #fff;
    border-radius: 4px;
    .title {
      padding: 17px 64px;
      border-bottom: 1px solid #eeeeee;
      font-size: 18px;
      color: #62697f;

      .text {
        font-weight: bold;
      }

      .hide-assets {
        margin-left: 10px;
        font-size: 14px;
        color: #3674d7;
        cursor: pointer;
      }
    }
    .assets-data {
      display: flex;
      flex-wrap: wrap;
      width: 50%;
    }
    .all-assets {
      margin-top: 40px;
      font-size: 40px;
      color: #1c2f62;
      margin-left: 64px;
      font-weight: bold;

      .coin-marks {
        font-size: 24px;
        color: #2c354c;
        font-weight: bold;
      }
    }

    .assets-box {
      display: flex;
    }

    .account-list {
      width: 100%;
      padding: 40px 64px 30px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      color: #1c2f62;
      font-size: 14px;

      &::before {
        position: absolute;
        top: 94px;
        left: calc(50% - 64px);
        bottom: 30px;
        content: "";
        border-left: 1px solid #f3f3f3;
      }

      .account-item {
        margin: 10px 0 30px 0;
        width: 50%;
        color: #999;
        white-space:nowrap;
      }

      .number {
        font-weight: bold;
        font-size: 18px;
        color: #1c2f62;
        margin-top: 14px;
      }
    }
    .assets-pie {
      padding: 30px 0 20px;
      width: 27%;

      .pie-title {
        padding: 0 30px;
        line-height: 20px;
        text-align: left;
        span {
          font-size: 14px;
          color: #1c2f62;
        }
      }
      .pie-bottom {
        text-align: center;
        font-style: normal;
        font-size: 12px;
        line-height: 20px;
        color: #999;
      }

      .pie {
        margin-top: 35px;
        width: 100%;
        height: calc(100% - 50px);
      }
    }

    .assets-progress {
      display: flex;
      padding: 85px 10px 20px;
      width: 23%;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      
    }
    .group {
      margin: 3px 0;
      width: calc(100% - 6px);
      display: flex;
      flex-wrap: wrap;
      .intro {
        padding: 0 10px 0 0;
        width: 50px;
        font-size: 12px;
        line-height: 20px;
        text-align: right;
        color: #3674d7;
      }
      .progress {
        margin: 4px;
        width: calc(100% - 110px);
        max-width: 130px;
        height: 12px;
        border: 1px solid #3674d7;
        border-radius: 6px;
        box-sizing: border-box;

        i {
          display: block;
          height: 100%;
          background: #3674d7;
          border-radius: 5px;
        }
      }
      .percent {
        font-size: 12px;
        line-height: 20px;
        color: #3674d7;
      }
    }
  }

  .coin-info {
    background: #fff;
    margin: 16px 30px;
    border-radius: 4px;
    .coin-title {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f5f6fa;
      font-size: 18px;
      color: #62697f;
      padding: 15px 64px;
      font-weight: bold;
    }

    .coin-row {
      &:hover {
        background: rgba(232, 240, 252, 0.3);
        cursor: pointer;
      }

      &:last-child {
        .coin-item {
          border-bottom: 0;
          border-radius: 4px;
        }
      }
    }

    .coin-item {
      display: flex;
      // justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;
      padding: 12px 0;
      margin: 0 64px;
      color: #333333;
      font-size: 14px;
      line-height: 30px;
      border-radius: 4px;
      .coin-avator {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        border-radius: 4px;
      }

      .coin-name {
        vertical-align: middle;
        font-weight: bold;
        margin-left: 20px;
        font-size: 14px;
        color: #333;
        border-radius: 4px;
      }
    }

    .type,
    .available,
    .withdraw,
    .valuation {
      flex: 1;
      font-weight: bold;
    }
    .type{
      min-width: 165px;
    }

    .available {
      padding-left: 115px;
    }

    .withdraw {
      padding-left: 100px;
    }

    .valuation {
      text-align: right;
    }
  }

  .tab-list {
    margin: 0 30px 0;
    background: #fff;
    border-radius: 4px;
    .tab-item {
      padding: 0 64px;
    }
  }

  .tabs {
    height: 64px;
    margin-left: 64px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    position: relative;

    .tab-line {
      position: absolute;
      bottom: 0;
      transition: all 0.3s ease;
      width: 33px;
      height: 3px;
      background: rgba(54, 116, 215, 1);
      border-radius: 3px;
    }

    .tab {
      letter-spacing: normal;
      padding-right: 92px;
      float: left;
      margin-top: 23px;
      margin-bottom: 20px;
      cursor: pointer;
      position: relative;
      &:hover {
        color: rgba(54, 116, 215, 1);
      }
    }

    .tabActive {
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
    }
  }
// }
</style>
