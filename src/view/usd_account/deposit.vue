<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">{{$t('home.deposit')}}</span>
    </div>
    <div class="content">
      <div class="row">
        <div class="key">{{$t('account.depositWay')}}</div>
        <div class="val">
          <div class="coin-list">
            <div
              class="coin-item"
              v-for="(item, key) in coinList"
              :key="key"
              @click="selectCoin(item.id, item.coinName)"
              :class="item.id === coinIndex ? 'active':''"
            >
              <img :src="item.coinAvatat" alt class="coin-avatar" />
              <div
                class="coin-name"
                :class="item.id === coinIndex ? 'text-active':''"
              >{{item.coinName}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="checkCoin === 'USDT'">
        <div class="row" :style="{marginTop: '24px'}" v-show="isShowChain">
          <div class="key">{{$t('account.chainNmme')}}</div>
          <div class="val">
            <div>
              <div class="chain-list">
                <div
                  class="chain-item"
                  v-for="(item, key) in chainList"
                  :key="key"
                  @click="selectChain(item.id, item.chainName)"
                  :class="item.id === chainIndex ? 'active':''"
                >{{item.chainName}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '24px',alignItems:'end'}" v-if="chainIndex !== -1">
          <div class="key">{{$t('account.depositAddr')}}</div>
          <div class="val">
            <DepositQrcode
              :coinName="coin"
              :accountType="1"
              :address="address"
              :logo="logo"
              :loading="loading"
              @showQrcode="showQrcode"
            ></DepositQrcode>
          </div>
        </div>
        <div class="tips" v-if=" checkCoin==='USDT' && checkChain === 'ERC20'">
          {{$t("warmPrompt.warmTips")}}
          <p>• {{$t("warmPrompt.notFind", {coin: 'ERC20_ USDT'})}}</p>
          <p>• {{$t("warmPrompt.confirmCoin", {count: '12', number: '12'})}}</p>
          <p>• {{$t("warmPrompt.minMoney", {minMoney: '10 ERC20_ USDT'})}}</p>
          <p>• {{$t("warmPrompt.confirmSafe")}}</p>
        </div>
        <div class="tips" v-if=" checkCoin==='USDT' && checkChain === 'OMNI'">
          {{$t("warmPrompt.warmTips")}}
          <p>• {{$t("warmPrompt.notFind", {coin: 'OMNI_ USDT'})}}</p>
          <p>• {{$t("warmPrompt.notDeposit")}}</p>
          <p>• {{$t("warmPrompt.confirmCoin", {count: '1', number: '2'})}}</p>
          <p>• {{$t("warmPrompt.minMoney", {minMoney: '10 OMNI_ USDT'})}}</p>
          <p>• {{$t("warmPrompt.confirmSafe")}}</p>
        </div>
      </div>
      <div v-else-if="checkCoin ==='BTC'">
        <div class="row" :style="{marginTop: '24px',alignItems:'end'}">
          <div class="key">{{$t('account.depositAddr')}}</div>
          <div class="val">
            <DepositQrcode
              :coinName="coin"
              :accountType="1"
              :address="address"
              :logo="logo"
              :loading="loading"
              @showQrcode="showQrcode"
            ></DepositQrcode>
          </div>
        </div>
        <div class="tips">
          {{$t("warmPrompt.warmTips")}}
          <p>• {{$t("warmPrompt.notFind", {coin: 'BTC'})}}</p>
          <p>• {{$t("warmPrompt.confirmCoin", {count: '1', number: '2'})}}</p>
          <p>• {{$t("warmPrompt.minMoney", {minMoney: '0.001 BTC'})}}</p>
          <p>• {{$t("warmPrompt.confirmSafe")}}</p>
        </div>
      </div>
      <div v-else-if="checkCoin === 'ETH'">
        <div class="row" :style="{marginTop: '24px',alignItems:'end'}">
          <div class="key">{{$t('account.depositAddr')}}</div>
          <div class="val">
            <DepositQrcode
              :coinName="coin"
              :accountType="1"
              :address="address"
              :logo="logo"
              :loading="loading"
              @showQrcode="showQrcode"
            ></DepositQrcode>
          </div>
        </div>
        <div class="tips">
          {{$t("warmPrompt.warmTips")}}
          <p>• {{$t("warmPrompt.notFind", {coin: 'ETH'})}}</p>
          <p>• {{$t("warmPrompt.confirmCoin", {count: '12', number: '12'})}}</p>
          <p>• {{$t("warmPrompt.minMoney", {minMoney: '0.01 ETH'})}}</p>
          <p>• {{$t("warmPrompt.coinBase")}}</p>
          <p>• {{$t("warmPrompt.confirmSafe")}}</p>
        </div>
      </div>
      <div v-else-if="checkCoin === 'CARD'">
        <div class="row" :style="{marginTop: '24px',alignItems:'baseline'}">
          <div class="key">{{$t('account.depositPwd')}}</div>
          <div class="val">
            <div>
              <input
                type="text"
                class="enter-input"
                v-model="password"
                :placeholder="$t('customError.depositPwd')"
              />
            </div>
            <div class="confirm" @click="deposit">{{$t('account.confirm')}}</div>
          </div>
        </div>
        <div class="tips">
          {{$t("warmPrompt.depositSummary")}}
          <p>1、{{$t("warmPrompt.abCard")}}</p>
          <p>2、{{$t("warmPrompt.nameIdentity")}}</p>
          <p>3、{{$t("warmPrompt.abRule")}}</p>
        </div>
      </div>
      <div class="row" v-if="coinIndex === -1">
        <div class="key"></div>
        <div class="val">
          <div class="deposit-tips">{{$t('account.depositTips')}}...</div>
        </div>
      </div>
      <div class="row" v-if="coinIndex === 1 && chainIndex === -1">
        <div class="key"></div>
        <div class="val">
          <div class="deposit-tips">{{$t('account.chainTips')}}...</div>
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
      :toText="$t('home.usdAbbr')"
      :title="title"
      @closeDepositModal="closeDepositModal"
      @openDepositModal="openDepositModal"
      @konw="know"
      @back="back"
    >
      <template v-slot:desc>
        <div class="model-tips">
          <p>{{$t('account.exchangeTips', {from: coin})}}</p>
          <p>{{$t('account.dynamicAddr')}}</p>
        </div>
      </template>
    </DepositModal>
  </div>
</template>

<script>
import axios from "../../api/request";
import VueQr from "vue-qr";
import DepositQrcode from "../components/DepositQrcode";
import DepositModal from "../components/DepositModal";
import { mapActions } from "vuex";
export default {
  name: "deposit",
  components: {
    DepositQrcode,
    DepositModal,
    VueQr,
  },
  data() {
    return {
      title: "deposit",
      isShowDepositModal: false,
      isHideDepositMask: false,
      isShowCancel: true,
      lastCoinType: "",
      recordCoin: [],
      fromIcon: "",
      toIcon: require("../../assets/account/usd_logo_20200728.png"),
      fromText: "",
      toText: "USD",
      depositIcon: require("../../assets/account/deposit_icon_20200703.png"),
      checkCoin: "", // 选中的币种
      checkChain: "", // 选中的链名称
      coin: "", // checkCoin + checkChain
      isShowChain: true, // 显示链名称
      coinIndex: -1,
      chainIndex: -1,
      coinList: [
        {
          id: 1,
          coinAvatat: require("../../assets/person/usdt_icon_20200624.png"),
          coinName: "USDT",
        },
        {
          id: 2,
          coinAvatat: require("../../assets/person/btc_icon_20200624.png"),
          coinName: "BTC",
        },
        {
          id: 3,
          coinAvatat: require("../../assets/person/eth_icon_20200624.png"),
          coinName: "ETH",
        },
        {
          id: 4,
          coinAvatat: require("../../assets/person/card_icon_20200703.png"),
          coinName: "CARD",
        },
      ], // 添加地址簿币列表
      chainList: [
        {
          id: 1,
          chainName: "ERC20",
        },
        {
          id: 2,
          chainName: "OMNI",
        },
      ], // chain
      password: "",
      address: "",
      logo: require("../../assets/account/usdt_erc20_20200727.png"),
      loading: false,
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["fetchWallet"]),
    know() {
      this.openDepositModal(false);
      if (this.checkCoin === "CARD") return;
      this.showQrcode();
    },
    back() {
      this.coinIndex = -1;
      this.chainIndex = -1;
      this.checkCoin = "";
      this.checkChain = "";
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
      this.coin = name;
      if (id > 1) {
        this.isShowChain = false;
        this.checkChain = "";
        this.checkCoin = name;
        this.fromText = name;
        if (this.coin === "BTC") {
          this.logo = require("../../assets/account/btc_logo_20200727.png");
          this.fromIcon = require("../../assets/person/btc_icon_20200624.png");
        } else if (this.coin === "ETH") {
          this.logo = require("../../assets/account/eth_logo_20200727.png");
          this.fromIcon = require("../../assets/person/eth_icon_20200624.png");
        }
        if (name === "CARD") return;
        this.isShowModel(name);
      } else if (id === 1) {
        this.checkCoin = name;
        this.coin = name + "-" + this.checkChain;
        this.chainIndex = -1;
        this.isShowChain = true;
      }
    },
    // 选择 chain
    selectChain(id, name) {
      this.chainIndex = id;
      this.checkChain = name;
      this.coin = this.checkCoin + "-" + name;
      this.isShowModel(this.coin);
      if (this.coin === "USDT-ERC20") {
        this.logo = require("../../assets/account/usdt_erc20_20200727.png");
        this.fromIcon = require("../../assets/account/usdt_ecr20_20200728.png");
      } else {
        this.logo = require("../../assets/account/usdt_omni_20200727.png");
        this.fromIcon = require("../../assets/account/usdt_omni_20200728.png");
      }
      this.fromText = this.coin;
    },
    isShowModel(name) {
      if (this.recordCoin.findIndex((item) => item === name) > -1) {
        this.showQrcode();
      } else {
        this.recordCoin.push(name);
        this.openDepositModal(true);
      }
    },
    // 显示二维码
    async showQrcode() {
      const params = {
        coin: this.coin,
        accountType: 2,
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
    // AB 卡充值
    async deposit() {
      if (!this.password.trim())
        return this.$Message.error(this.$t("customError.depositPwd"));

      const params = {
        cardNo: this.password, // 充值卡密码
      };
      const res = await axios.abDeposit(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.success(this.$t("customError.depositSuccess"));
          this.fetchWallet();
          setTimeout( () => {
            this.$router.push({
              path: "/usd",
              query: { id: 1, type: 1 },
            });
          },2000)
          
        } else {
          this.$Message.error(this.$t("customError.depositFail"));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
  },
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
    padding: 32px 64px;
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
  //     margin-right: 30px;
  //     .coin-avatar {
  //       width: 24px;
  //       height: 24px;
  //     }
  //     .coin-name {
  //       display: inline-block;
  //       color: #333;
  //       font-size: 16px;
  //       vertical-align: middle;
  //       margin-left: 8px;
  //     }
  //     .text-active {
  //       color: #3674d7;
  //       font-weight: bold;
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
  //     margin-right: 32px;
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