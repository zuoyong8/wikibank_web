<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">充值</span>
    </div>
    <div class="content">
      
      <div v-if="checkCoin === 'BTC'">
        <div class="row" :style="{alignItems:'end'}">
          <div class="key">充值地址</div>
          <div class="val">
            <DepositQrcode :coinName="coin" :accountType="2" :address="address" :logo="logo"></DepositQrcode>
          </div>
        </div>
        <div class="tips" >
          温馨提示 
          <p>• 请勿向上述地址充值任何非 BTC 资产，否则资产将不可找回。 </p>
          <p>• 您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，2次网络确认后可提币。</p> <p>• 最小充值金额：0.001 BTC，小于最小金额的充值将不会上账且无法退回。 </p>
          <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
        </div>
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
          <p>您的 BTC 将会充值到 BTC 账户里</p> 
          <p>地址为限时动态地址，请在有效时间内完成充值</p> 
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
      title: "充值",
       isShowDepositModal: false,
      isHideDepositMask: false,
      isShowCancel: false,
      lastCoinType: "",
      recordCoin:[],
      fromIcon: require("../../assets/person/btc_icon_20200624.png"),
      toIcon: require("../../assets/account/wikipay_btc_20200728.png"),
      fromText: "BTC",
      toText: "WikiPay-BTC",
      depositIcon: require("../../assets/account/deposit_icon_20200703.png"),
      checkCoin: "BTC", // 选中的币种
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
      logo: require("../../assets/account/btc_logo_20200727.png")
    };
  },
  mounted() {
    this.openDepositModal(true);
  },
  methods: {
    know() {
      this.selectCoin(2, "BTC");
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

      const res = await axios.coinAddress(params);

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
        width: 130px;
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
      margin-left: 129px;
      margin-top: 39px;
      color: #999;
      font-size: 12px;
      line-height: 22px;
    }
  }
  .coin-list {
    display: flex;
    justify-content: space-around;
    .coin-item {
      display: inline-block;
      padding: 8px 10px;
      background: #f9f7fd;
      border-radius: 2px;
      text-align: center;
      cursor: pointer;
      margin-right: 80px;
      .coin-avatar {
        width: 24px;
        height: 24px;
      }
      .coin-name {
        display: inline-block;
        margin-top: 4px;
        color: #333;
        font-size: 14px;
        font-weight: bold;
        vertical-align: middle;
        margin-left: 8px;
      }
      .text-active {
        color: #3674d7;
      }
    }
    .active {
      border: 1px solid #3674d7;
      box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
      background: url("../../assets/person/check_icon_20200624.png") no-repeat
        right bottom;
      background-size: 16px 12px;
    }
  }
  .chain-list {
    display: flex;
    align-items: center;
    .chain-item {
      display: inline-block;
      padding: 6px 12px;
      background: #f7f6fb;
      color: #222;
      font-size: 16px;
      cursor: pointer;
      margin-right: 40px;
      margin-left: 0;
    }
    .active {
      border: 1px solid #3674d7;
      box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
      background: url("../../assets/person/check_icon_20200624.png") no-repeat
        right bottom;
      background-size: 16px 12px;
      color: #3674d7;
    }
  }
}
</style>