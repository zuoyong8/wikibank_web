<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">
        提现
        <span class="rule">(1 {{coinType}} = {{price}} USD )</span>
      </span>
    </div>
    <div
      class="warn"
    >您的提币操作一旦完成，对应的资产所有权将由您变更为目标地址所对应的账户所有人享有，请您务必在提币操作前，仔细核对提币地址信息，确保提币属于自愿行为，并确认不涉及任何传销、非法集资、诈骗等违法情形，谨防上当受骗，避免造成不必要的财产损失。</div>
    <div class="content">
      <div class="row" v-if="isShowWithdrawType">
        <div class="key">充值方式</div>
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
      <div
        class="row"
        v-if="isShowChainName"
        :style="{marginTop: isShowWithdrawType ? '47px':'0'}"
        v-show="isShowChain"
      >
        <div class="key">链名称</div>
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
        <div class="row" :style="{marginTop: isShowChainName ? '47px':'0'}">
          <div class="key">提现地址</div>
          <div class="val">
            <input
              type="text"
              class="enter-input"
              v-model="withdrawAddress"
              placeholder="粘贴地址或从地址簿选择"
            />
            <span class="select-address" @click="selectAddress">
              <span class="icon-uniE900"></span>
              <span class="address">地址簿</span>
            </span>
          </div>
        </div>
        <div class="row" :style="{marginTop: '47px'}">
          <div class="key">数量</div>
          <div class="val">
            <div class="transfer-box">
              <input
                type="text"
                class="enter-input"
                v-model="number"
                placeholder="0.00"
                @change="getMoney"
              />
              <div class="all-money">
                {{coinType}}
                <span class="split"></span>
                <span class="total" @click="transferAll">全部</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="input-tips">{{calcCoin}} USD</div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '27px'}">
          <div class="key">手续费</div>
          <div class="val">
            <div class="transfer-box">
              <input type="text" class="enter-input disabled" readonly v-model="fees" placeholder="手续费" />
              <div class="all-money">{{coinType}}</div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '47px'}">
          <div class="key">提现备注</div>
          <div class="val">
            <input type="text" class="enter-input" v-model="comment" placeholder="仅在“账户明细”中显示" />
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
            <div class="confirm" @click="payCheck">确认</div>
          </div>
        </div>
        <div class="tips" v-if="coin === 'USDT-ERC20'">
          温馨提示
          <p>• 最小提币数量为：2 USDT (ERC20)。</p>
          <p>• 为保障资金安全，当您账户安全策略变更、密码修改、我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
        </div>
        <div class="tips" v-if="coin === 'USDT-OMNI'">
          温馨提示
          <p>• 最小提币数量为：10 USDT (OMNI)。</p>
          <p>• 为保障资金安全，当您账户安全策略变更、密码修改、我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
        </div>
        <div class="tips" v-if="coin === 'BTC'">
          温馨提示
          <p>• 最小提币数量为：0.001 BTC。</p>
          <p>• 为保障资金安全，当您账户安全策略变更、密码修改、我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
        </div>
        <div class="tips" v-if="coin === 'ETH'">
          温馨提示
          <p>• 最小提币数量为：0.05ETH。</p>
          <p>• 请不要直接提币到ICO的众筹地址，这会导致您无法收取众筹到的数字资产。</p>
          <p>• 提币到合约地址可能会发生合约执行失败，将导致转账失败，资产将退回。我们会人工处理退回到原账户，处理时间较长，请您谅解。</p>
          <p>• 网络转账费用是不固定的，取决于转账时合约执行需要消耗的算力。当前我们为提币支付的Gas Limit为90000，用于执行转账或合约执行。如果此次交易消耗超过90000 gas，将导致转账失败，资产将退回。我们会人工处理退回到原账户，请您谅解。</p>
          <p>• 为保障资金安全，当您账户安全策略变更、密码修改、我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</p>
        </div>
      </div>

      <div class="row" v-if="chainIndex === -1">
        <div class="key"></div>
        <div class="val">
          <div class="deposit-tips">请选择链名称...</div>
        </div>
      </div>
    </div>
    <!--提示地址簿-->
    <ModalMask
      :isShowModal="isShowAddressModal"
      :isHideMask="isHideAddressMask"
      @closeModal="closeAddressModal"
      @openModal="openAddressModal"
    >
      <template v-slot:body>
        <div class="modal-head">
          <span class="modal-title">提现地址薄</span>
          <span class="icon--copy4 modal-close" @click="openAddressModal(false)"></span>
        </div>
        <div class="modal-body">
          <div class="address-list">
            <div
              class="address-item"
              v-for="item in addressList"
              :key="item.id"
              @click="getRadio(item.id, item.address)"
            >
              <img :src="item.url" alt class="withdraw-pic" />
              <span class="withdraw-type">{{item.comment}}</span>
              <span class="withdraw-code">({{item.address}})</span>
              <span class="radio" :class="index === item.id ? 'active':''"></span>
            </div>
          </div>
        </div>
      </template>
    </ModalMask>
    <CreateQrcode
      :isShowModal="isShowWithdrawModal"
      :isHideMask="isHideWithdrawMask"
      :title="createQrcodeTitle"
      :qrcodeCode="qrcodeStatus"
      @openWithdrawModal="openWithdrawModal"
      @closeWitdrawModal="closeWitdrawModal"
    >
      <template v-slot:info>
        <div class="detail-info">
          <div class="row">
            <div class="key">提现数量</div>
            <div class="val">
              <div>
                <span class="number">{{number}}</span>
                <span class="coin-addre">{{coinType}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="key">手续费</div>
            <div class="val">
              <div>
                <span class="number">{{fees}}</span>
                <span class="coin-addre">{{coinType}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="key">提现地址</div>
            <div class="val">{{withdrawAddress}}</div>
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
          <p>仅支持 {{coin}} 地址, 一旦转错资产将不可找回</p>
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
import QRCode from "qrcode";
export default {
  name: "deposit",
  components: {
    DepositQrcode,
    ModalMask,
    QRCode,
    CreateQrcode,
    ExcessVertify,
    DepositModal
  },
  data() {
    return {
      title:"提现",
      isShowForm: false, // 是否显示表单
      isShowDepositModal: false,
      isHideDepositMask: false,
      isShowCancel: true,
      lastCoinType: "",
      recordCoin: [],
      fromIcon: require("../../assets/account/wikipay_usdt_20200728.png"),
      toIcon: "",
      fromText: "WikiPay-" + this.coinType,
      toText: "",
      tips: "", // 限额提示
      isExcess: false, // 是否限额
      phoneVertifyCode: "", // 短信验证码
      isHideAddressMask: true,
      isShowAddressModal: false,
      isShowWithdrawModal: false,
      isHideWithdrawMask: true,
      createQrcodeTitle: "提现详情", //
      transId: "", // 生成二维码id
      depositIcon: require("../../assets/account/withdraw_icon_20200731.png"),
      checkCoin: "USDT", // 选中的币种
      checkChain: "", // 选中的链名称
      coin: this.coinType, // checkCoin + checkChain
      isShowChain: true, // 显示链名称
      coinIndex: 1,
      chainIndex: -1,
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
      feesDecimal: 0, // 手续费保留位数
      index: -1,
      addressList: [],
      withdrawAddress: this.formWithdrawAddress, // 提现地址
      price: 1, // 汇率
      number: this.formNumber, // 提现数量
      fees: this.formFees, // 手续费
      comment: this.formComment, // 提现备注
      statusId: 0, // 二维码id
      timer: "", // 定时器
      qrcodeStatus: -1
    };
  },
  props: {
    formWithdrawAddress: String, // 提现地址
    formNumber: Number, // 提现数量
    formFees: Number, // 手续费
    formComment: String, // 提现备注
    isShowWithdrawType: Boolean, // 是否显示充值方式
    isShowChainName: Boolean, // 是否显示链名称
    coinType: String
  },
  watch: {
    withdrawAddress(val) {
      this.$emit("enterAddress", val);
    },
    number(val) {
      this.$emit("enterNumber", +val);
    },
    fees(val) {
      this.$emit("enterFees", val);
    },
    comment(val) {
      this.$emit("enterComment", val);
    }
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapGetters(["getWallet"]),
    calcCoin() {
      return saveDecimal(+this.formNumber * this.price, 2);
    }
  },
  mounted() {
    if (this.coinType === "USDT") {
      this.coin = this.coinType + "-ERC20";
      this.toIcon = require("../../assets/account/usdt_ecr20_20200728.png");
      this.toText = this.coin;
    } else if(this.coinType === "BTC"){
      this.fromIcon = require("../../assets/account/wikipay_btc_20200728.png");
      this.toIcon = require("../../assets/person/btc_icon_20200624.png");
      this.toText = "BTC";
      this.chainIndex = 1;
      this.isShowCancel = false;
      this.openDepositModal(true);
    } else if(this.coinType === "ETH") {
      this.fromIcon = require("../../assets/account/wikipay_eth_20200728.png");
      this.toIcon = require("../../assets/person/eth_icon_20200624.png");
      this.toText = "ETH";
      this.chainIndex = 1;
      this.isShowCancel = false;
      this.openDepositModal(true);
    }
    
  },
  methods: {
    ...mapActions(["fetchWallet"]),
    know() {
      this.isShowForm = true;
      this.openDepositModal(false);
      if (this.checkCoin === "CARD") return;
      this.getCoinList();
      this.getPrice();
    },
    back() {
      this.chainIndex = -1;
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
    getMoney() {
      let money = isNumber(this.number) ? +this.number : 0;

      const { coinType } = this;

      if (coinType === "USDT") {
        if (money > this.getWallet.usdtAvail) {
          this.number = this.getWallet.usdtAvail;
        } else {
          this.number = saveDecimal(money, 2);
        }
      } else if (coinType === "BTC") {
        if (money > this.getWallet.btcAvail) {
          this.number = this.getWallet.btcAvail;
        } else {
          this.number = saveDecimal(money, 8);
        }
      } else if (coinType === "ETH") {
        if (money > this.getWallet.ethAvail) {
          this.number = this.getWallet.ethAvail;
        } else {
          this.number = saveDecimal(money, 5);
        }
      }
    },
    // 获取数字货币列表
    async getCoinList() {
      const params = {
        coin: this.coin
      };

      const res = await axios.coinList(params);
      if (res.code === 0) {
        const { withdrawalFee, withdrawalPrecision } = res.data[0];
        this.fees = saveDecimal(withdrawalFee, withdrawalPrecision);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 选择联系人
    getContact(account, name, isShow, imName) {
      //   this.form.incomeAccount = account;
      //   this.contactName = name;
      //   this.comment = imName;
      this.isShowAddressModal = false;
    },
    // 选择提现地址
    async selectAddress() {
      const params = {
        rows: 10,
        page: 1
      };
      try {
        const res = await fetchAddressList(params);
        if (res.code === 0) {
          this.addressList = res.data.map(item => {
            return {
              id: item.id,
              url: item.icon,
              coin: item.coin,
              address: item.address,
              comment: item.comment
            };
          });
          this.isShowAddressModal = true;
        } else {
          this.$Message.error("网络出错，请稍候再试!");
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
      if (!this.withdrawAddress) {
        this.$Message.error("提现地址不能为空");
        return;
      } else if (!+this.number) {
        this.$Message.error("转账金额不能为空");
        return;
      }

      const params = {
        coin: this.coin, // 提现币种
        address: this.withdrawAddress, // 提现的地址
        amount: +this.number, // 提现数量
        // usd: +this.number, // 币美元价格
        comment: this.comment, // comment 备注
        accountType: 1 // 账户类型 1.数字货币账户 2.美元账户
      };
      try {
        this.qrcodeStatus = -1;
        const res = await handleWithdraw(params);

        if (res.code === 0) {
          this.transId = res.data.transId;
          const qrcode = document.querySelector("#qrcode");
          QRCode.toCanvas(qrcode, this.transId, {
            width: 210,
            height: 210
          });
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
    // 转账所有
    transferAll() {
      const { coinType } = this;

      if (coinType === "USDT") {
        if(this.getWallet.usdtAvail < this.formFees){
          this.number = '0.00';
        } else {
          this.number = this.getWallet.usdtAvail - this.formFees;
        }
      } else if (coinType === "BTC") {
        if(this.getWallet.btcAvail < this.formFees){
          this.number = '0.00000000';
        } else {
          this.number = this.getWallet.btcAvail - this.formFees;
        }
      } else if (coinType === "ETH") {
        if(this.getWallet.ethAvail < this.formFees){
          this.number = '0.00000';
        } else {
          this.number = this.getWallet.ethAvail - this.formFees;
        }
      } else {
        this.number = 0;
      }
    },
    async getPrice() {
      const params = {
        coin: this.coinType,
        type: 2,
        side: "sell"
      };
      if (this.coinType === "ETH") {
        this.feesDecimal = 5;
      } else if (this.coinType === "BTC") {
        this.feesDecimal = 8;
      } else if (this.coinType === "USDT") {
        this.feesDecimal = 4;
      }

      const res = await axios.convertPrice(params);
      if (res.code === 0) {
        const { usd } = res.data;
        this.price = saveDecimal(usd, 2);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 选择 coin
    selectCoin(id, name) {
      this.coinIndex = id;
      this.checkCoin = name;
      this.resetForm();
      if (id > 3) return;
      if (id > 1) {
        this.coin = name;
        this.isShowChain = false;
        this.getCoinList();
      } else {
        this.coin = name + "-" + this.checkChain;
        this.isShowChain = true;
      }
    },
     // 选择 chain
    selectChain(id, name) {
      this.isShowForm = true;
      this.chainIndex = id;
      this.checkChain = name;
      this.coin = this.checkCoin + "-" + name;
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
      if (this.recordCoin.findIndex(item => item === name) > -1) {
        this.getCoinList();
      } else {
        this.recordCoin.push(name);
        this.openDepositModal(true);
      }
    },
    // 监测提现状态
    async checkTransferStatus() {
      let { transId } = this;
      this.statusId = transId.split(":")[1];
      const params = { transId: this.statusId, transType: 2 }; // transType 2、提现  3、 转账

      const res = await axios.checkTransferStatus(params);
      this.qrcodeStatus = res.code;
      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          const p = this.coinType.toLowerCase();
          this.closeWitdrawModal(true);
          this.$Message.success("提现成功！");
          this.fetchWallet();
          this.$router.push({ path: `/console/${p}` });
        }
      } else if (res.code === 1010060) {
        // 二维码过期
        clearInterval(this.timer);
      }
    },
    // 验证手机验证码
    async vertifyTelCode() {
      if (!this.phoneVertifyCode.trim())
        return this.$Message.error("请填写手机验证码！");

      const params = {
        areaCode: this.userInfo.areaCode,
        phoneNumber: this.userInfo.phone,
        smscode: this.phoneVertifyCode,
        device: 2
      };

      const res = await axios.vertifyTelCode(params);

      if (res.code === 0) {
        const { success } = res.data;
        if(!success) {
          return this.$Message.error(res.msg);
        }
        this.withdraw();
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 风控
    async payCheck() {
      if (!+this.number) return this.$Message.error("数量不能为空！");
      const params = {
        payType: 2, // 2、提现 3、转账
        amount: "" + this.number,
        coin: this.coin
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
    // 重置表单
    resetForm() {
      this.withdrawAddress = ""; // 提现地址
      this.number = 0; // 提现数量
      this.fees = 0.0; // 手续费
      this.comment = ""; // 提现备注
    },
    beforeDestory() {
      if (this.timer) clearInterval(this.timer);
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
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 26px;
  background: #f6f8ff;
  width: 480px;
  .modal-title {
    font-size: 20px;
    color: #333;
  }
  .modal-close {
    font-size: 16px;
    cursor: pointer;
  }
}
.modal-body {
  height: 335px;
  overflow-y: scroll;
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
        border-radius: 50%;
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
    .rule {
      font-size: 14px;
      color: #4eb091;
    }
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
        .deposit-tips {
          width: 604px;
          color: #666;
          font-size: 14px;
          font-weight: 400;
          padding: 70px 0;
          text-align: center;
          border: 1px dashed #bbbbbb;
          background: #f5f6fa;
          margin-top: 48px;
        }
        .input-tips {
          font-size: 12px;
          color: #666;
          margin-top: 6px;
          text-align: right;
        }
        .enter-input {
          border: 1px solid #ccc;
          padding: 10px 12px;
          width: 360px;
          border-radius: 2px;
          outline: none;
          &:focus {
            border: 1px solid #3674D7;
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
        }
        .select-address {
          margin-left: 18px;
          cursor: pointer;
          .address {
            margin-left: 7px;
            color: #3674d7;
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
  .detail-info {
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      .key {
        font-size: 14px;
        color: #999;
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
    }
  }
}
</style>