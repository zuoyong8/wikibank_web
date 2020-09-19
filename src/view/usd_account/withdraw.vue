<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">{{$t('home.withdraw')}}</span>
    </div>
    <div class="warn">{{$t('account.withdrawTips')}}</div>
    <div class="content">
      <div class="row">
        <div class="key">{{$t('account.withdrawWay')}}</div>
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
      <div class="row" :style="{marginTop: '24px'}" v-show="isShowChain" v-if="coinIndex !== -1">
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

      <div v-if="isShowForm">
        <div class="row" :style="{marginTop: '24px'}">
          <div class="key">{{$t('account.withdrawAddr')}}</div>
          <div class="val">
            <input
              type="text"
              class="enter-input"
              v-model.trim="withdrawAddress"
              :placeholder="$t('customError.pasteAddress')"
              @blur="vertifyAddr"
            />
            <span class="select-address" @click="selectAddress">
              <img :src="addressIcon" alt="" class="address-icon">
              <span class="address">{{$t("personCenter.addressBook")}}</span>
            </span>
          </div>
        </div>
        <div class="row">
          <div class="key"></div>
          <div class="val">
            <div class="addr-tips">{{addressTips}}</div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '24px'}">
          <div class="key">{{$t("account.amount")}}</div>
          <div class="val">
            <div class="transfer-box">
              <input
                type="text"
                class="enter-input"
                v-model="form.number"
                placeholder="0.00"
                @change="getMoney"
              />
              <div class="all-money">
                {{checkCoin}}
                <span class="split"></span>
                <span class="total" @click="transferAll">{{$t("home.all")}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="input-tips">
              <span>${{calcCoin}} (USD)</span>
              <span class="rule">$1 (USD) = {{price}} {{checkCoin}}</span>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '20px'}">
          <div class="key">{{$t("home.fees")}}</div>
          <div class="val">
            <div class="transfer-box">
              <input
                type="text"
                class="enter-input disabled"
                readonly
                v-model="form.fees"
                :placeholder="$t('home.fees')"
              />
              <div class="all-money">{{checkCoin}}</div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '24px'}">
          <div class="key">{{$t("home.withdraw")}}{{$t("home.marks")}}</div>
          <div class="val">
            <input
              type="text"
              class="enter-input"
              v-model="form.comment"
              :placeholder="$t('placehode.accountDetailShow')"
            />
          </div>
        </div>
        <ExcessVertify
          :isExcess="isExcess"
          :phone="userInfo.phone"
          :value="phoneVertifyCode"
          :tips="tips"
          v-model="phoneVertifyCode"
        ></ExcessVertify>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="confirm" @click="payCheck">{{$t("account.confirm")}}</div>
          </div>
        </div>
        <div class="tips" v-if="checkCoin === 'USDT' && checkChain === 'ERC20'">
          {{$t("warmPrompt.warmTips")}}
          <!-- <p>• {{$t("warmPrompt.minWithdraw", {minCoin: '2 USDT (ERC20)'})}}</p> -->
          <p>• {{$t("warmPrompt.withdrawSafe")}}</p>
        </div>
        <div class="tips" v-if="checkCoin === 'USDT' && checkChain === 'OMNI'">
          {{$t("warmPrompt.warmTips")}}
          <!-- <p>• {{$t("warmPrompt.minWithdraw", {minCoin: '10 USDT (OMNI)'})}}</p> -->
          <p>• {{$t("warmPrompt.withdrawSafe")}}</p>
        </div>
        <div class="tips" v-if="checkCoin === 'BTC'">
          {{$t("warmPrompt.warmTips")}}
          <!-- <p>• {{$t("warmPrompt.minWithdraw", {minCoin: '0.001 BTC'})}}</p> -->
          <p>• {{$t("warmPrompt.withdrawSafe")}}</p>
        </div>
        <div class="tips" v-if="checkCoin === 'ETH'">
          {{$t("warmPrompt.warmTips")}}
          <!-- <p>• {{$t("warmPrompt.minWithdraw", {minCoin: '0.05ETH'})}}</p> -->
          <p>• {{$t("warmPrompt.digitAsset")}}</p>
          <p>• {{$t("warmPrompt.backAccount")}}</p>
          <p>• {{$t("warmPrompt.internetWithdraw")}}</p>
          <p>• {{$t("warmPrompt.withdrawSafe")}}</p>
        </div>
      </div>

      <div class="row" v-if="coinIndex === -1">
        <div class="key"></div>
        <div class="val">
          <div class="deposit-tips">{{$t('account.withdrawWayTips')}}...</div>
        </div>
      </div>
      <div class="row" v-if="coinIndex === 1 && chainIndex === -1">
        <div class="key"></div>
        <div class="val">
          <div class="deposit-tips">{{$t('account.chainTips')}}...</div>
        </div>
      </div>
    </div>

    <!-- 地址簿 -->
    <AddressList
      :isHideAddressMask="isHideAddressMask"
      :isShowAddressModal="isShowAddressModal"
      :addressList="addressList"
      :index="index"
      @getRadio="getRadio"
      @openAddressModal="openAddressModal"
      @closeAddressModal="closeAddressModal"
    >
    </AddressList>

    <CreateQrcode
      :isShowModal="isShowWithdrawModal"
      :isHideMask="isHideWithdrawMask"
      :title="$t('home.withdraw')+$t('home.detail')"
      :qrcodeCode="qrcodeStatus"
      :transId="transId"
      @openWithdrawModal="openWithdrawModal"
      @closeWitdrawModal="closeWitdrawModal"
    >
      <template v-slot:info>
        <div class="detail-info">
          <div class="row">
            <div class="key">{{$t('home.withdrawNum')}}</div>
            <div class="val">
              <div>
                <span class="number">{{form.number}}</span>
                <span class="coin-addre">{{checkCoin}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="key">{{$t('home.fees')}}</div>
            <div class="val">
              <div>
                <span class="number">{{form.fees}}</span>
                <span class="coin-addre">{{checkCoin}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="key">{{$t('account.withdrawAddr')}}</div>
            <div class="val withdraw-address">{{withdrawAddress}}</div>
          </div>
        </div>
      </template>
    </CreateQrcode>

    <DepositModal
      :isShowDepositModal="isShowDepositModal"
      :isHideDepositMask="isHideDepositMask"
      :isShowCancel="isShowCancel"
      :fromIcon="fromIcon"
      :toIcon="toIcon"
      :fromText="$t('home.usdAbbr')"
      :toText="toText"
      :title="title"
      @closeDepositModal="closeDepositModal"
      @openDepositModal="openDepositModal"
      @konw="know"
      @back="back"
    >
      <template v-slot:desc>
        <div class="model-tips">
          <p>{{$t('account.withdrawAddrTips', {coin: coin})}}</p>
        </div>
      </template>
    </DepositModal>
  </div>
</template>

<script>
import axios from "../../api/request";
import DepositQrcode from "../components/DepositQrcode";
import ExcessVertify from "../components/ExcessVertify";
import DepositModal from "../components/DepositModal";
import { mapState, mapGetters, mapActions } from "vuex";
import ModalMask from "../components/ModalMask";
import CreateQrcode from "../components/CreateQrcode";
import { fetchAddressList, handleWithdraw } from "../../api/request";
import { saveDecimal, isNumber } from "../../filters";
import AddressList from "@/view/components/AddressList";
import { vertify } from "@/mixins/vertifyAddr.js"
export default {
  name: "deposit",
  components: {
    DepositQrcode,
    ModalMask,
    CreateQrcode,
    ExcessVertify,
    DepositModal,
    AddressList
  },
  mixins: [vertify],
  data() {
    return {
      withdrawAddress: "", // 提现地址
      addressTips: "", // 验证地址提示
      addressIcon: require('@/assets/account/address_icon_20200902.png'),
      title: "withdraw",
      isShowForm: false, // 是否显示表单
      isShowDepositModal: false,
      isHideDepositMask: false,
      isShowCancel: true,
      recordCoin: [],
      fromIcon: require("../../assets/account/usd_logo_20200728.png"),
      toIcon: "",
      fromText: "USD",
      toText: "",
      tips: "", // 限额提示
      isExcess: false, // 是否限额
      phoneVertifyCode: "", // 短信验证码
      isHideAddressMask: true,
      isShowAddressModal: false,
      isShowWithdrawModal: false,
      isHideWithdrawMask: true,
      transId: "", // 生成二维码id
      depositIcon: require("../../assets/account/withdraw_icon_20200731.png"),
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
      form: {
        withdrawAddress: "", // 提现地址
        number: "", // 提现数量
        fees: 0.0, // 手续费
        comment: "", // 提现备注
      },
      feesDecimal: 0, // 手续费保留位数
      price: 1,
      reallyPrice: 1,
      index: -1,
      addressList: [],
      timer: "",
      statusId: 0, // 状态id
      qrcodeStatus: -1, // 二维码状态
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapGetters(["getWallet"]),
    calcCoin() {
      return saveDecimal(+this.form.number / +this.reallyPrice, 2);
    },
    total() {
      return this.getWallet.usdAvail * this.reallyPrice - this.form.fees < 0
        ? 0
        : this.getWallet.usdAvail * this.reallyPrice - this.form.fees;
    },
  },
  mounted() {
    // this.selectCoin(1, "USDT");
  },
  methods: {
    ...mapActions(["fetchWallet"]),
    know() {
      this.openDepositModal(false);
      if (this.checkCoin === "CARD") return;
      this.getCoinList();
      this.getPrice();
    },
    back() {
      this.coinIndex = -1;
      this.chainIndex = -1;
      this.checkCoin = "";
      this.checkChain = "";
      this.isShowForm = false;
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
    openAddressModal(isShow) {
      this.isShowAddressModal = isShow;
      this.isHideAddressMask = true;
    },
    closeAddressModal(isShow) {
      this.isShowAddressModal = isShow;
      this.isHideAddressMask = true;
    },
    openWithdrawModal(isShow) {
      this.isShowWithdrawModal = isShow;
      this.isHideWithdrawMask = false;
    },
    closeWitdrawModal(isShow) {
      this.isShowWithdrawModal = isShow;
      this.isHideWithdrawMask = true;
      clearInterval(this.timer);
    },
    // 获取数字货币列表
    async getCoinList() {
      const params = {
        coin: this.coin,
      };

      const res = await axios.coinList(params);
      if (res.code === 0) {
        const { withdrawalFee, withdrawalPrecision } = res.data[0];
        this.form.fees = saveDecimal(withdrawalFee, withdrawalPrecision);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 选择提现地址
    async selectAddress() {
      const params = {
        rows: 10,
        page: 1,
      };
      try {
        const res = await fetchAddressList(params);
        if (res.code === 0) {
          this.addressList = res.data.map((item) => {
            return {
              id: item.id,
              url: item.icon,
              coin: item.coin,
              address: item.address,
              comment: item.comment,
            };
          });
          this.isShowAddressModal = true;
        } else {
          this.$Message.error(res.msg);
        }
      } catch (error) {
        this.$Message.error(error);
      }
    },
    // 选中地址
    getRadio(id, address) {
      this.index = id;
      this.withdrawAddress = address;

      this.openAddressModal(false);
    },
    // 提现
    async withdraw() {
      const params = {
        coin: this.coin, // 提现币种
        address: this.withdrawAddress, // 提现的地址
        amount: +this.form.number, // 提现数量
        // usd: +this.form.number, // 币美元价格
        comment: this.form.comment, // comment 备注
        accountType: 2, // 账户类型
      };
      try {
        this.qrcodeStatus = -1;
        const res = await handleWithdraw(params);

        if (res.code === 0) {
          this.transId = res.data.transId;
          this.openWithdrawModal(true);
          this.qrcodeStatus = 1;
          this.timer = setInterval(this.checkTransferStatus, 5000);
        } else {
          this.$Message.error(res.msg);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 金额明细
    getMoney() {
      let money = isNumber(this.form.number) ? this.form.number : 0;

      if (!isNumber(money)) {
        return (this.form.number = "");
      }

      if (this.form.number > this.total) {
        this.form.number = saveDecimal(this.total, this.feesDecimal);
      } else {
        this.form.number = saveDecimal(money, this.feesDecimal);
      }
    },
    // 转账所有
    transferAll() {
      this.form.number = saveDecimal(this.total, this.feesDecimal);
    },

    async getPrice() {
      const params = {
        coin: this.checkCoin,
        type: 2,
        side: "buy",
      };
      if (this.checkCoin === "ETH") {
        this.feesDecimal = 5;
      } else if (this.checkCoin === "BTC") {
        this.feesDecimal = 8;
      } else if (this.checkCoin === "USDT") {
        this.feesDecimal = 4;
      }

      const res = await axios.convertPrice(params);

      if (res.code === 0) {
        const { usd } = res.data;
        this.reallyPrice = 1 / usd;
        this.price = saveDecimal(1 / usd, this.feesDecimal);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 选择 coin
    selectCoin(id, name) {
      this.coinIndex = id;
      this.coin = name;
      this.resetForm();
      if (id > 3) return;
      if (id > 1) {
        this.isShowForm = true;
        this.isShowChain = false;
        this.checkChain = "";
        this.checkCoin = name;
        this.toText = name;
        this.index = -1;
        if (this.coin === "BTC") {
          this.logo = require("../../assets/account/btc_logo_20200727.png");
          this.toIcon = require("../../assets/person/btc_icon_20200624.png");
        } else if (this.coin === "ETH") {
          this.logo = require("../../assets/account/eth_logo_20200727.png");
          this.toIcon = require("../../assets/person/eth_icon_20200624.png");
        }
        this.isShowModel(name);
      } else if (id === 1) {
        this.checkCoin = name;
        this.coin = name + "-" + this.checkChain;
        this.chainIndex = -1;
        this.isShowChain = true;
        this.isShowForm = false;
      }
    },
    // 选择 chain
    selectChain(id, name) {
      this.isShowForm = true;
      this.chainIndex = id;
      this.checkChain = name;
      this.coin = this.checkCoin + "-" + name;
      this.index = -1;
      this.isShowModel(this.coin);
      if (this.coin === "USDT-ERC20") {
        this.logo = require("../../assets/account/usdt_erc20_20200727.png");
        this.toIcon = require("../../assets/account/usdt_ecr20_20200728.png");
      } else {
        this.logo = require("../../assets/account/usdt_omni_20200727.png");
        this.toIcon = require("../../assets/account/usdt_omni_20200728.png");
      }
      this.toText = this.coin;
      this.resetForm();
    },
    isShowModel(name) {
      if (this.recordCoin.findIndex((item) => item === name) > -1) {
        this.getCoinList();
        this.getPrice();
      } else {
        this.recordCoin.push(name);
        this.openDepositModal(true);
      }
    },
    // 重置表单
    resetForm() {
      this.withdrawAddress = "";
      this.form = {
        withdrawAddress: "", // 提现地址
        number: "", // 提现数量
        fees: 0.0, // 手续费
        comment: "", // 提现备注
      };
    },
    // 监测提现状态
    async checkTransferStatus() {
      let { transId } = this;
      this.statusId = transId.split(":")[1];
      const params = { transId: this.statusId, transType: 2 }; // transType 2、提现 3、 转账

      const res = await axios.checkTransferStatus(params);
      this.qrcodeStatus = res.code;
      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.closeWitdrawModal(true);
          this.$Message.success(this.$t("customError.withdrawSuccess"));
          this.fetchWallet();
          setTimeout(() => {
            this.$router.push({
              path: "/usd",
              query: { id: 4, type: 2 },
            });
          }, 2000);
        }
      } else if (res.code === 1010060) {
        // 二维码过期
        clearInterval(this.timer);
      }
    },
    // 验证手机验证码
    async vertifyTelCode() {
      if (!this.phoneVertifyCode.trim())
        return this.$Message.error(this.$t("customError.telVertifyCodeTips"));

      const params = {
        areaCode: this.userInfo.areaCode,
        phoneNumber: this.userInfo.phone,
        smscode: this.phoneVertifyCode,
        device: 2,
      };

      const res = await axios.vertifyTelCode(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (!success) {
          return this.$Message.error(res.msg);
        }
        this.withdraw();
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 风控
    async payCheck() {
      if (!this.withdrawAddress) {
        this.$Message.error(this.$t("customError.withdrawAddressTips"));
        return;
      } else if (!+this.form.number) {
        this.$Message.error(this.$t("customError.amountTips"));
        return;
      }
      const params = {
        payType: 2, // 2、提现 3、转账
        amount: "" + this.form.number,
        coin: this.coin,
      };
      const res = await axios.limitPayCheck(params);
      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.withdraw();
        } else {
          return this.$Message.error(res.msg);
        }
      } else if (res.code === 1010043) {
        this.tips = res.msg;
        if (this.isExcess) {
          this.vertifyTelCode();
        } else {
          this.isExcess = true;
        }
      } else if (res.code === 1010042) {
        this.tips = res.msg;
        if (this.isExcess) {
          this.vertifyTelCode();
        } else {
          this.isExcess = true;
        }
      } else {
        return this.$Message.error(res.msg);
      }
    },
    beforeDestroy() {
      if (this.timer) clearInterval(this.timer);
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

.modal-body {
  .address-list {
    margin: 0 0 8px 7px;
    .address-item {
      position: relative;
      padding: 20px 27px 20px 30px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      .withdraw-pic {
        width: 29px;
        height: 29px;
        // border-radius: 50%;
      }
      .withdraw-type {
        color: #333;
        margin-left: 15px;
        vertical-align: middle;
      }
      .withdraw-code {
        color: #666;
        margin-left: 10px;
        vertical-align: middle;
      }
      .radio {
        position: absolute;
        right: 30px;
        top: 28px;
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #fff;
        border: 2px solid #999;
        border-radius: 50%;
      }
      .active {
        border: 2px solid #3674d7;
      }
    }
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
  .warn {
    padding: 10px 64px;
    background: rgba(255, 104, 89, 0.05);
    color: #333;
    font-size: 12px;
  }
  .rule {
    float: right;
    color: #4eb091;
    background: #f4faf8;
    padding: 4px;
    border-radius: 2px;
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
        .input-tips {
          width: 360px;
          font-size: 12px;
          color: #666;
          margin-top: 6px;
          text-align: left;
          line-height: 12px;
        }
        .enter-input {
          border: 1px solid #ccc;
          padding: 10px 12px;
          width: 360px;
          border-radius: 2px;
          outline: none;
          &:focus {
            border: 1px solid #3674d7;
          }
          &::placeholder {
            color: #ccc;
          }
        }
        .transfer-box {
          position: relative;
          .all-money {
            position: absolute;
            right: 10px;
            top: 12px;
            font-size: 14px;
            color: #333;
            .split {
              display: inline-block;
              width: 1px;
              height: 10px;
              border-radius: 1px;
              background: #ccc;
              opacity: 0.3;
              margin: 0 10px;
            }
            .total {
              color: #3674d7;
              cursor: pointer;
            }
          }
          .disabled {
            background: #f7f7f7;
          }
        }
        .select-address {
          margin-left: 18px;
          cursor: pointer;
          .address {
            margin-left: 7px;
            color: #3674d7;
            vertical-align: middle;
          }
          .address-icon {
            width: 20px;
            height: 20px;
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
        .addr-tips {
          margin-top: 5px;
          line-height: 14px;
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
  .detail-info {
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      .key {
        font-size: 14px;
        color: #999;
        text-align: left;
      }
      .val {
        font-size: 14px;
        color: #333;
        .number {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        .coin-addre {
          font-size: 14px;
          color: #333;
        }
      }
      .withdraw-address {
        width: 165px;
        text-align: left;
        overflow-wrap: break-word;
      }
    }
  }
}
</style>