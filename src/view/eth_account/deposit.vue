<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">{{$t('home.deposit')}}</span>
    </div>
    <div class="content">
      
      <div class="row" :style="{alignItems:'end'}">
        <div class="key">{{$t('account.depositAddr')}}</div>
        <div class="val">
          <DepositQrcode :coinName="coin" :accountType="2" :address="address" :logo="logo" :loading="loading" @showQrcode="showQrcode"></DepositQrcode>
        </div>
      </div>
      <div class="tips" >
        {{$t("warmPrompt.warmTips")}}  
        <p>• {{$t("warmPrompt.notFind", {coin: "ETH"})}}</p>
        <p>• {{$t("warmPrompt.notFind", {count: "12", number: "12"})}}</p> 
        <p>• {{$t("warmPrompt.minMoney", {minMoney: "0.01 ETH"})}}</p>
        <p>• {{$t("warmPrompt.coinBase")}}</p>
        <p>• {{$t("warmPrompt.confirmSafe")}}</p>
      </div>

    </div>

    <DepositModal 
    :isShowDepositModal="isShowDepositModal"
    :isHideDepositMask="isHideDepositMask"
    :isShowCancel="isShowCancel" 
    :fromIcon="fromIcon"
    :toIcon="toIcon"
    :fromText="fromText"
    :toText="toText"
    :title="title"
    @closeDepositModal="closeDepositModal"
    @openDepositModal="openDepositModal"
    @konw="know"
    @back="back"
    >
      <template v-slot:desc>
        <div class="model-tips">
          <p>{{$t('account.depositAccount', {from: 'ETH', to: 'ETH'})}}</p> 
          <p>{{$t('account.dynamicAddr')}}</p> 
        </div>
      </template>
    </DepositModal>
  </div>
</template>

<script>
import axios from "../../api/request";
import VueQr from 'vue-qr';
import DepositQrcode from "../components/DepositQrcode";
import DepositModal from "../components/DepositModal";
export default {
  name: "deposit",
  components: {
    DepositQrcode,
    DepositModal,
    VueQr
  },
  data() {
    return {
      title:"deposit",
      isShowDepositModal: false,
      isHideDepositMask: false,
      isShowCancel: false,
      lastCoinType: "",
      recordCoin:[],
      fromIcon: require("../../assets/person/eth_icon_20200624.png"),
      toIcon: require("../../assets/account/wikipay_eth_20200728.png"),
      fromText: "ETH",
      toText: "WikiPay-ETH",
      depositIcon: require("../../assets/account/deposit_icon_20200703.png"),
      checkCoin: "ETH", // 选中的币种
      checkChain: "ERC20", // 选中的链名称
      coin: "", // checkCoin + checkChain
      isShowChain: true, // 显示链名称
      coinIndex: 1,
      chainIndex: 1,
      coinList: [
        {
          id: 1,
          coinAvatat: require("../../assets/person/usdt_icon_20200624.png"),
          coinName: "USDT"
        },
        {
          id: 2,
          coinAvatat: require("../../assets/person/btc_icon_20200624.png"),
          coinName: "BTC"
        },
        {
          id: 3,
          coinAvatat: require("../../assets/person/eth_icon_20200624.png"),
          coinName: "ETH"
        },
        {
          id: 4,
          coinAvatat: require("../../assets/person/card_icon_20200703.png"),
          coinName: "CARD"
        }
      ], // 添加地址簿币列表
      chainList: [
        {
          id: 1,
          chainName: "ERC20"
        },
        {
          id: 2,
          chainName: "OMNI"
        }
      ], // chain
      address:"",
      logo: require("../../assets/account/eth_logo_20200727.png"),
      loading: false
    };
  },
  mounted() {
    this.openDepositModal(true);
    
  },
  methods: {
    know() {
      this.selectCoin(3, "ETH");
      this.openDepositModal(false);
      if(this.checkCoin === "CARD") return;
      this.showQrcode();
    },
    back() {
      this.openDepositModal(false);
    },
    closeDepositModal() {
      this.isShowDepositModal = true;
      this.isHideDepositMask = false;
    },
    openDepositModal(a) {
      this.isShowDepositModal = a;
      this.isHideDepositMask = false;
    },
    // 选择 coin
    selectCoin(id, name) {
      this.coinIndex = id;
      this.checkCoin = name;

      if (id > 3) return;
      if (id > 1) {
        this.coin = name;
        this.isShowChain = false;
      } else {
        this.coin = name + "-" + this.checkChain;
        this.isShowChain = true;
      }
    },
     // 显示二维码
    async showQrcode() {
      const params = {
        coin: this.coin,
        accountType: 1
      };
      this.loading = true;
      const res = await axios.coinAddress(params);
      this.loading = false;
      if (res.code === 0) {
        const { address } = res.data;
        this.address = address;
      } else {
        this.$Message.error(res.msg);
      }
    },
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
.account {
  margin: 0 30px;
  background: #fff;
  .title {
    @include title;
  }
  .model-tips {
    font-size: 14px;
    color: #333;
    margin-top: 48px;
    line-height: 21px;
  }
  .content {
    padding: 42px 64px;
    .row {
      display: flex;
      align-items: center;
      .key {
        color: #666;
        font-size: 14px;
        width: 90px;
      }
      .val {
        .enter-input {
          border: 1px solid #ccc;
          padding: 10px 12px;
          width: 360px;
          border-radius: 2px;
          outline: none;
          &::placeholder {
            color: #ccc;
          }
        }
        .confirm {
          margin-top: 40px;
          display: inline-block;
          width: 360px;
          padding: 12px 0;
          text-align: center;
          background: #3674d7;
          color: #fff;
          font-size: 17px;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
    .tips {
      margin-left: 90px;
      margin-top: 39px;
      color: #999;
      font-size: 12px;
      line-height: 22px;
    }
  }
  // .coin-list {
  //   display: flex;
  //   justify-content: space-around;
  //   .coin-item {
  //     display: inline-block;
  //     padding: 8px 10px;
  //     background: #f9f7fd;
  //     border-radius: 2px;
  //     text-align: center;
  //     cursor: pointer;
  //     margin-right: 80px;
  //     .coin-avatar {
  //       width: 24px;
  //       height: 24px;
  //     }
  //     .coin-name {
  //       display: inline-block;
  //       margin-top: 4px;
  //       color: #333;
  //       font-size: 14px;
  //       font-weight: bold;
  //       vertical-align: middle;
  //       margin-left: 8px;
  //     }
  //     .text-active {
  //       color: #3674d7;
  //     }
  //   }
  //   .active {
  //     border: 1px solid #3674d7;
  //     box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
  //     background: url("../../assets/person/check_icon_20200624.png") no-repeat
  //       right bottom;
  //     background-size: 16px 12px;
  //   }
  // }
  // .chain-list {
  //   display: flex;
  //   align-items: center;
  //   .chain-item {
  //     display: inline-block;
  //     padding: 6px 12px;
  //     background: #f7f6fb;
  //     color: #222;
  //     font-size: 16px;
  //     cursor: pointer;
  //     margin-right: 40px;
  //     margin-left: 0;
  //   }
  //   .active {
  //     border: 1px solid #3674d7;
  //     box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
  //     background: url("../../assets/person/check_icon_20200624.png") no-repeat
  //       right bottom;
  //     background-size: 16px 12px;
  //     color: #3674d7;
  //   }
  // }
}
</style>