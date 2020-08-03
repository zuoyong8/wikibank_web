<template>
  <div class="right">
    <div class="">
      <PersonalData></PersonalData>
      <div class="assets-info">
        <div class="title">
          <span class="text">账户总资产折合</span>
          <span
            class="hide-assets"
            @click="changeShowState"
          >{{isShowAsset==="show" ? "隐藏资产":"显示资产"}}</span>
        </div>
        <div class="all-assets">
          {{ isShowAsset==="show" ? getWallet.total: "******"}}
          <span
            class="coin-marks"
          >{{coinAbbre}}</span>
        </div>
        <div class="account-list">
          <div class="available">
            可用 ({{coinAbbre}})
            <div class="number">{{isShowAsset==="show" ? getWallet.available : "****"}}</div>
          </div>
          <div class="withdraw">
            提现中（{{coinAbbre}}）
            <div class="number">{{isShowAsset==="show" ? getWallet.withdraw: "****"}}</div>
          </div>
          <div class="valuation">
            美元预估收益（{{coinAbbre}}）
            <div class="number">{{isShowAsset==="show" ? getProfit.evaluate: "****"}}</div>
          </div>
          <div class="profit">
            美元年化收益
            <div class="number">{{getProfit.annual}}%</div>
          </div>
        </div>
      </div>

      <div class="coin-info">
        <div class="coin-title">
          <div class="type">账户</div>
          <div class="available">可用</div>
          <div class="withdraw">提现中</div>
          <div class="valuation">估值 ({{coinAbbre}})</div>
        </div>
        <div class="coin-row" v-for="(item, key) in getAccountList" :key="key">
          <div class="coin-item">
            <div class="type">
              <img :src="item.coinAvatar" alt class="coin-avator" />
              <span class="coin-name">{{item.coinName}} 账户</span>
            </div>
            <div class="available">{{isShowAsset==="show" ? item.available: "******"}}</div>
            <div class="withdraw">{{isShowAsset==="show" ? item.withdraw: "******"}}</div>
            <div class="valuation">{{isShowAsset==="show" ? item.evaluate: "******"}} {{coinAbbre}}</div>
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
            ref="tab"
          >{{tab.name}}</li>
          <div class="tab-line" :style="{left: (number)+ 'px'}"></div>
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

      <ModalMask
        :isShowModal="isShowDetailModal"
        :isHideMask="isHideDetailMask"
        @closeModal="closeDetailModal"
        @openModal="openDetailModal"
      >
        <template v-slot:body>
          <div class="content" v-if="modalType === 1 || modalType === 9 ">
            <div class="content-title">充值详情</div>
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
              <div class="key">充值数量</div>
              <div class="val">{{detail.amount}} USD</div>
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
              <div class="val">{{detail.amount}} USDT</div>
            </div>
            <div class="content-desc">
              <div class="key">区块高度</div>
              <div class="val">{{detail.txidPrefixUrl}}（16区块 确认）</div>
            </div>
            <div class="content-desc">
              <div class="key">手续费</div>
              <div class="val">{{detail.fee}} USDT</div>
            </div>
            <div class="content-desc">
              <div class="key">接收方</div>
              <div class="val">{{detail.toAddress}}</div>
            </div>
            <div class="content-desc">
              <div class="key">交易哈希值</div>
              <div class="val">{{detail.txHash}}</div>
            </div>
            <div class="content-desc">
              <div class="key">备注</div>
              <div class="val">{{detail.comment}}</div>
            </div>
          </div>
        </template>
      </ModalMask>
    </div>
  </div>
</template>

<script>
import {
  formatDate,
  getDate,
  getTime,
  saveDecimal,
  formatTel,
  getCoinDigit,
  formatEmail
} from "../../filters.js";
import PersonalData from "../components/PersonalData";
import InfiniteLoad from "../components/InfiniteLoad";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  fetchBill,
  fetchWithdrawDepositDetail,
  fetchTransferDetail,
  fetchExchangeDetail
} from "../../api/request";
import ModalMask from "../components/ModalMask";

export default {
  data() {
    return {
      manAvatar: require("../../assets/account/man_avatar_20200710.png"),
      womanAvatar: require("../../assets/account/woman_avatar_20200710.png"),
      detail: {}, // 充值、提现详情
      transfer: {}, // 转账详情
      exchange: {}, // 兑换详情
      isHideDetailMask: true,
      isShowDetailModal: false,
      modalType: 0, // 弹框类型
      isShowMoney: false,
      moneyText: "隐藏资产",
      typeImage: require("../../assets/imgs/flag_icon_20200526.png"),
      infos: [],
      timer: null, // 计时器
      tabs: [
        {
          id: 0,
          name: "全部",
          type: 0
        },
        {
          id: 1,
          name: "充值",
          type: 1
        },
        {
          id: 2,
          name: "转账",
          type: 3
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
      ],
      tabIndex: 0, // tab下划线
      number: 0, // 下划线
      statusKey: 0,
      rows: 10,
      page: 0,
      orderList: [],
      isLoading: true,
      noMore: false,
      statusText: "隐藏资产" // 是否显示资产
    };
  },
  components: {
    PersonalData,
    InfiniteLoad,
    ModalMask
  },
  mounted() {
    this.changeTab(0, 0);
    this.fetchWallet();
    this.fetchProfit();
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre", "isShowAsset"]),

    ...mapGetters(["getProfit", "getWallet", "getAccountList"]),

    formatAccountList() {
      let { rate, coinSymbol, coinAbbre, orderList } = this;

      return orderList.map(item => {
        let comment = item.comment ? item.comment : "";
        let type, state, usd, orderId;
        let order = item.orderId + "";
        let orderStart = order.substring(0, 4);
        let orderEnd = order.substring(order.length - 3, order.length);
        let orderDateTime = formatDate(item.createAt, "yyyy-MM-dd hh:mm");

        let statusStr = item.status === 1 ? "成功" : "失败";
        let sex = item.sex === 1 ? "先生" : "女士";
        let coin = item.type === 3 ? "USD" : item.coin;
        let avatar;
        let name;
        let infos = item.info;
        let usdt;
        orderId = orderStart + "......" + orderEnd;

        if (item.type == 1) {
          type = "充值";
          avatar = item.icon;
          name = item.coin;
          usdt = saveDecimal(item.amount, item.showPrecision);
        } else if (item.type === 2) {
          type = "提现";
          avatar = item.icon;
          name = item.coin;
          usdt = item.money + item.fromCoin;
        } else if (item.type === 3) {
          type = "转账 ";
          if (!item.avatar) {
            avatar = item.sex === 1 ? this.manAvatar : this.womanAvatar;
          } else {
            avatar = item.avatar;
          }
          let money = +item.money.replace(/(\+|-)/g, "");
          name = item.firstName + sex;
          usdt =
            (item.money.indexOf("-") > -1 ? "-" : "+") +
            saveDecimal(money, item.showPrecision) +
            "USD"; // side 1、来自 2、去往
          usd =
            coinAbbre === "USD"
              ? ""
              : saveDecimal(money * rate, item.showPrecision) + coinAbbre;
        } else if (item.type === 5) {
          type = "兑换";
          avatar = item.icon;
          infos = item.info + "/" + item.toCoin;

          let fromMoney = +item.money.replace(/(\+|-)/g, "");
          let toMoney = +item.toMoney.replace(/(\+|-)/g, "");
          let fromPrec = getCoinDigit(item.fromCoin);
          let toPrec = getCoinDigit(item.toCoin);
          usdt = "-" + saveDecimal(fromMoney, fromPrec) + item.fromCoin;
          usd = saveDecimal(toMoney, toPrec) + item.toCoin;
        } else if (item.type === 6) {
          type = "VISA转入";
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
          date: getDate(orderDateTime),
          time: getTime(orderDateTime),
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
          marks: comment // 备注
        };
      });
    }
  },
  methods: {
    ...mapMutations(["changeAssetStatus"]),
    ...mapActions(["fetchProfit", "fetchWallet"]),

    changeShowState() {
      if (this.isShowAsset === "show") {
        this.changeAssetStatus("hide");
        this.statusText = "显示资产";
      } else {
        this.changeAssetStatus("show");
        this.statusText = "隐藏资产";
      }
    },
    closeDetailModal(a) {
      this.isShowDetailModal = a;
      this.isHideDetailMask = true;
    },
    openDetailModal(a) {
      this.isShowDetailModal = a;
      this.isHideDetailMask = false;
    },
    showMoney() {
      if (this.isShowMoney) {
        this.moneyText = "隐藏资产";
      } else {
        this.moneyText = "显示资产";
      }
      this.isShowMoney = !this.isShowMoney;
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
        rows: this.rows
      };

      this.isLoading = false;

      const res = await fetchBill(params);

      this.isLoading = true;

      if (res.code === 0) {
        let { infos } = res.data;

        this.orderList = [...this.orderList, ...infos];
        if (infos.length === 0) this.noMore = true;
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
      let left = this.$refs.tab[0].clientWidth;
      this.number = left * id;
      this.fetchDate();
    },

    // enterDetail
    async enterDetail(id, type) {
      if (type === 6) return;
      this.modalType = type;
      const params = { orderId: id };
      if (type === 1 || type === 2 || type === 9) {
        // 充值 提现 CARD 充值
        const res = await fetchWithdrawDepositDetail(params);
        let item = res.data;
        this.detail = {
          orderId: item.orderId,
          coin: item.coin === "AB" ? "CARD" : item.coin,
          statusStr: item.statusStr,
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          amount: saveDecimal(item.amount, item.showPrecision),
          txidPrefixUrl: item.txidPrefixUrl,
          fee: item.fee,
          fromAddress: item.fromAddress,
          toAddress: item.toAddress,
          txHash: item.txHash,
          comment: item.comment
        };
      } else if (type === 3) {
        // 转账
        const res = await fetchTransferDetail(params);
        let item = res.data;
        this.transfer = {
          orderId: item.orderId,
          userId: item.userId,
          status: item.status ? "成功" : "失败",
          isFrom: item.money.indexOf("-") > -1 ? "收款" : "付款",
          money: saveDecimal(item.money, 2),
          createAt: formatDate(item.createAt, "yyyy-MM-dd hh:mm:ss"),
          payName: `${item.lastName}(*${item.lastName})`,
          from: formatEmail(item.from),
          to: item.to,
          comment: item.comment
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
          bidAmount: "-" + item.strBidAmount, // 兑换金额
          askAmount: "+" + item.strAskAmount, // 被兑换数量
          usd: item.usd, // 兑换时汇率
          comment: item.comment
        };
      }
      this.openDetailModal(true);
    }
  }
};
</script>
<style lang='scss' scoped>
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

.right {
  height: 100%;
  padding-top: 20px;
  width: 1330px;
  margin: 0 auto;
  .assets-info {
    margin-left: 30px;
    margin-right: 30px;
    background: #fff;
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
    .account-list {
      padding: 40px 64px;
      display: flex;
      // justify-content: space-between;
      color: #1c2f62;
      font-size: 14px;
      .number {
        font-weight: bold;
        font-size: 18px;
        color: #1c2f62;
        margin-top: 14px;
      }
      .available, .withdraw,.profit {
        flex:1;
      }
      .withdraw {
        padding-left: 24px;
      }
      .valuation {
        padding-left: 8px;
      }
      .profit {
        text-align: right;
      }
    }
  }

  .coin-info {
    background: #fff;
    margin: 16px 30px;
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
         background:rgba(232, 240, 252, 0.3);
         cursor: pointer;
      }
      &:last-child {
        .coin-item {
          border-bottom: 0;
        }
      }
    }
    .coin-item {
      display: flex;
      // justify-content: space-between;
      border-bottom: 1px solid #F6F6F6;
      padding: 15px 0;
      margin: 0 64px;
      color: #333333;
      font-size: 14px;
      line-height: 30px;
      .coin-avator {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .coin-name {
        vertical-align: middle;
        font-weight: bold;
        margin-left: 20px;
        font-size: 14px;
        color: #333;
      }
    }
    .type,
    .available,
    .withdraw,
    .valuation {
      flex: 1;
      font-weight: bold;
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
    margin: 0 30px;
    background: #fff;
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
    }

    .tabActive {
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
    }
  }
}
</style>                 