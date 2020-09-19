<template>
  <ModalMask
    :isShowModal="isShowDetailModal"
    :isHideMask="isHideDetailMask"
    @closeModal="closeDetailModal"
  >
    <template>
      <span class="close-btn" @click="closeModal"></span>
    </template>
    <template v-slot:body>
      <div class="content" v-if="modalType === 1 || modalType === 9 ">
        <div class="content-title">{{$t('home.deposit')}}{{$t('home.detail')}}</div>
        <div class="content-desc">
          <div class="key">{{$t('home.orderId')}}</div>
          <div class="val">{{detail.orderId}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.createTime')}}</div>
          <div class="val">{{detail.createAt}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.depositType')}}</div>
          <div
            class="val"
          >{{detail.fromCoin}}{{ detail.type === 2 ? ' / ' + $t('home.usdAbbr'):'' }}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.status')}}</div>
          <div class="val">{{detail.statusStr}}</div>
        </div>

        <div class="content-desc">
          <div class="key">{{$t('home.deposit')}}{{detail.coinType}}</div>
          <div class="val">{{detail.number}} {{detail.fromCoin}}</div>
        </div>

        <div class="content-desc">
          <div class="key">{{$t('account.depositAccountDetail')}}</div>
          <div
            class="val"
          >{{detail.accountType === 'USD' ? $t('home.usdAbbrAcct'): detail.accountType}} {{$t('home.account')}}</div>
        </div>
        <div class="content-desc" v-if="detail.type === 2">
          <div class="key">{{$t('account.depositRate')}}</div>
          <div class="val">1 {{detail.fromCoin}} = {{detail.usd}} (USD)</div>
        </div>
        <div class="content-desc" v-if="detail.type === 2">
          <div class="key">{{$t('account.incomeMoney')}}</div>
          <div class="val">${{detail.depositAmount}} (USD)</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('account.tradeHash')}}</div>
          <div class="val long-content">
            <div v-if="showHash" class="hash">
              {{detail.txHash}}
              <div>
                <a :href="detail.txidPrefixUrl">{{$t('account.lookTrade')}}</a>
              </div>
            </div>
            <div v-else @click="showHash=true" class="show-content">{{$t('account.showContent')}}</div>
          </div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('account.payAddress')}}</div>
          <div class="val long-content">
            <div v-if="showAddr" class="hash">{{detail.toAddress}}</div>
            <div v-else @click="showAddr=true" class="show-content">{{$t('account.showContent')}}</div>
          </div>
        </div>
      </div>
      <div class="content" v-if="modalType === 3">
        <div class="content-title">{{$t('home.transfer')}}{{$t('home.detail')}}</div>
        <div class="content-desc">
          <div class="key">{{$t('home.orderId')}}</div>
          <div class="val">{{transfer.orderId}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.status')}}</div>
          <div class="val">{{transfer.status}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.transferMoney')}}</div>
          <div class="val">{{transfer.money}} (USD)</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.createTime')}}</div>
          <div class="val">{{transfer.createAt}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{transfer.isFrom}}</div>
          <div class="val">{{transfer.payName}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.payAccount')}}</div>
          <div class="val">{{transfer.from}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.marks')}}</div>
          <div class="val long-content">{{transfer.comment}}</div>
        </div>
      </div>
      <div class="content" v-if="modalType === 5">
        <div class="content-title">{{$t('home.exchange')}}{{$t('home.detail')}}</div>
        <div class="content-desc">
          <div class="key">{{$t('home.orderId')}}</div>
          <div class="val">{{exchange.orderId}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.exchangeMoney')}}</div>
          <div class="val">
            <div
              class="exchang-amount"
            >{{exchange.bidAmount}} {{exchange.bidCoin === 'USD' ? `(${exchange.bidCoin})`:exchange.bidCoin}}</div>
            <div
              class="exchang-amount"
            >{{exchange.askAmount}} {{exchange.askCoin === 'USD' ? `(${exchange.askCoin})`:exchange.askCoin}}</div>
          </div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.exchange')}}{{$t('account.type')}}</div>
          <div
            class="val"
          >{{exchange.bidCoin === 'USD' ? $t('home.usdAbbr'):exchange.bidCoin}} → {{exchange.askCoin === 'USD' ? $t('home.usdAbbr'):exchange.askCoin}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.createTime')}}</div>
          <div class="val">{{exchange.createAt}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.payAccount')}}</div>
          <div
            class="val"
          >{{exchange.bidCoin === 'USD' ? $t('home.usdAbbrAcct'):exchange.bidCoin}} {{$t("home.account")}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.incomeAccount')}}</div>
          <div
            class="val"
          >{{exchange.askCoin === 'USD' ? $t('home.usdAbbrAcct'):exchange.askCoin}} {{$t("home.account")}}</div>
        </div>
      </div>
      <div class="content" v-if="modalType === 2">
        <div class="content-title">{{$t('home.withdraw')}}{{$t('home.detail')}}</div>
        <div class="content-desc">
          <div class="key">{{$t('home.orderId')}}</div>
          <div class="val">{{detail.orderId}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.createTime')}}</div>
          <div class="val">{{detail.createAt}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.network')}}</div>
          <div class="val">{{detail.coin}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.status')}}</div>
          <div class="val">{{detail.statusStr}}</div>
        </div>

        <div class="content-desc">
          <div class="key">{{$t('home.account')}}</div>
          <div
            class="val"
          >{{detail.accountType === 'USD' ?$t('home.usdAbbrAcct'):detail.accountType }} {{$t('home.account')}}</div>
        </div>
        <div class="content-desc" v-if="detail.type === 2">
          <div class="key">{{$t('home.withdrawNum')}}</div>
          <div class="val">{{detail.usdAmount}} {{detail.fromCoin}}</div>
        </div>

        <div class="content-desc">
          <div class="key">{{$t('home.withdraw')}}{{detail.amountType}}</div>
          <div
            class="val"
          >{{detail.accountType === 'USD' ? '$':''}}{{detail.amount}} {{detail.accountType === 'USD' ? `(${detail.accountType})`:detail.accountType}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.fees')}}</div>
          <div
            class="val"
          >{{detail.accountType === 'USD' ? '$':''}}{{detail.fee}} {{detail.accountType === 'USD' ? `(${detail.accountType})`:detail.accountType}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{detail.dynamicAccount}}</div>
          <div
            class="val"
          >{{detail.accountType === 'USD' ? '$':''}}{{detail.dynamicMoney}} {{detail.accountType === 'USD' ? `(${detail.accountType})`:detail.accountType}}</div>
        </div>
        <!-- <div class="content-desc">
              <div class="key">{{$t('home.recipient')}}</div>
              <div class="val">{{detail.toAddress}}</div>
        </div>-->
        <div class="content-desc" v-if="detail.status === 4">
          <div class="key">{{$t('account.tradeHash')}}</div>
          <div class="val long-content">
            <div v-if="showHash" class="hash">
              {{detail.txHash}}
              <div>
                <a :href="detail.txidPrefixUrl">{{$t('account.lookTrade')}}</a>
              </div>
            </div>
            <div v-else @click="showHash=true" class="show-content">{{$t('account.showContent')}}</div>
          </div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('account.withdrawAddr')}}</div>
          <div class="val long-content">
            <div v-if="showAddr" class="hash">{{detail.toAddress}}</div>
            <div v-else @click="showAddr=true" class="show-content">{{$t('account.showContent')}}</div>
          </div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.marks')}}</div>
          <div class="val long-content">{{detail.comment}}</div>
        </div>
      </div>
      <div class="content" v-if="modalType === 6">
        <div class="content-title">{{vasaDetail.info}}</div>
        <div class="content-desc">
          <div class="key">{{$t('home.orderId')}}</div>
          <div class="val">{{vasaDetail.orderId}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.createTime')}}</div>
          <div class="val">{{vasaDetail.createAt}}</div>
        </div>

        <div class="content-desc">
          <div class="key">{{$t('account.visaMoney')}}</div>
          <div class="val">{{vasaDetail.toMoney}} USD</div>
        </div>

        <div class="content-desc">
          <div class="key">{{$t('home.payAccount')}}</div>
          <div class="val">{{vasaDetail.fromCoin}}{{$t('home.account')}}</div>
        </div>
        <div class="content-desc">
          <div class="key">{{$t('home.incomeAccount')}}</div>
          <div class="val">{{vasaDetail.toCoin}}{{$t('home.account')}}</div>
        </div>
      </div>
    </template>
  </ModalMask>
</template>

<script>
import ModalMask from "@/view/components/ModalMask";

export default {
  name: "AccountDetail",
  components: {
    ModalMask
  },
  props: {
      detail: Object, // 充值、提现详情
      transfer: Object, // 转账详情
      exchange: Object, // 兑换详情
      vasaDetail: Object, // vasa 卡
      isHideDetailMask: Boolean,
      isShowDetailModal: Boolean,
      modalType: Number, // 弹框类型
  },
  data() {
    return {
      showHash: false, // 显示内容
      showAddr: false, // 显示地址
    };
  },
  methods: {
    closeModal() {
        this.closeDetailModal();
    },
    closeDetailModal() {
        this.showHash = false;
        this.showAddr = false;
        this.$emit('closeDetailModal', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.close-btn {
  top: 10px;
  right: -40px;
}
.content {
  width: 560px;
  padding: 32px 40px 60px;

  .content-title {
    margin-bottom: 40px;
    font-size: 22px;
    line-height: 40px;
    color: #333;
    font-weight: bold;
    text-align: center;
  }

  .content-desc {
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;
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