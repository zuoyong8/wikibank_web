<template>
  <div>
    <div class="account">
      <div class="title">
        <img :src="depositIcon" alt class="icon" />
        <span class="text">转账</span>
      </div>
      <div class="content" v-if="stepNum === 1">
        <div class="row">
          <div class="key">收款账户</div>
          <div class="val">
            <div>
              <input
                type="text"
                class="enter-input"
                v-model="form.incomeAccount"
                placeholder="手机号或邮箱"
              />
              <div class="contact-list">
                <span class="icon--copy3" style="margin-left:15px;width:20px;height:20px;"></span>
                <span class="contact" @click="getContactList">联系人</span>
                <ModalMask
                  :isShowModal="isShowContactModal"
                  :isHideMask="isHideContactMask"
                  @closeModal="closeContactModal"
                  @openModal="openContactModal"
                >
                  <template v-slot:body>
                    <div class="modal-head">
                      <span class="modal-title">转账联系人</span>
                      <span class="icon--copy4 modal-close" @click.stop="openContactModal(false)"></span>
                    </div>
                    <div class="modal-body">
                      <div class="address-list">
                        <div
                          class="address-item"
                          v-for="item in contactList"
                          :key="item.id"
                          @click.stop="getContact(item.id, item.account,item.lastName, item.name, item.comment, item.avatar, item.email )"
                        >
                          <img :src="item.url" alt class="withdraw-pic" />
                          <span class="withdraw-type">{{item.lastName}} ({{item.name}})</span>
                          <span class="withdraw-code">账号：({{item.account}})</span>
                          <span class="radio" :class="index === item.id ? 'active':''"></span>
                        </div>
                      </div>
                    </div>
                  </template>
                </ModalMask>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="input-tips" @click="vertifyIncomeName">校验收款人姓名</div>
          </div>
        </div> -->
        <div class="row" :style="{marginTop: '40px'}">
          <div class="key">转账金额</div>
          <div class="val">
            <div class="transfer-box">
              <input
                type="text"
                class="enter-input"
                v-model="form.transferMoney"
                placeholder="$0.00"
                @change="getMoney"
              />
              <div class="all-money">
                USD
                <span class="split"></span>
                <span class="total" @click="transferAll">全部</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: 0}" v-if="coinAbbre !== 'USD'">
          <div class="key"></div>
          <div class="val">
            <div class="input-tips">{{calcPrice}}</div>
          </div>
        </div>
        <div class="row" :style="{marginTop: coinAbbre !== 'USD' ? '18px': '40px'}">
          <div class="key">付款备注</div>
          <div class="val">
            <div>
              <input
                type="text"
                class="enter-input"
                v-model="form.payComment"
                placeholder="仅在'账户明细'中显示"
              />
            </div>
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
            <div class="confirm" @click="transfer">确认</div>
          </div>
        </div>
      </div>
      <div v-if="stepNum === 2">
        <div class="transfer-info">
          <div class="base-info">
            <div class="pay-money">
              转账金额
              <span class="usd">-${{form.transferMoney}}</span>
              <span class="addre">USD</span>
              <!-- <span class="transform-money">≈{{calcPrice}}</span> -->
            </div>
            <div>
              <span class="field">收款人姓名：{{lastName}}({{contactName}})</span>
              <span class="field">收款账户：{{form.incomeAccount}}</span>
              <span class="field">付款账户：{{userInfo.email}}</span>
            </div>
          </div>
          <div class="order-open">
            <div class="order-button" @click="openOrder">{{orderState}}</div>
          </div>
        </div>
        <div v-show="orderDetail" class="order-detail">
          <div class="field">订单时间：{{form.transferDate}}</div>
          <div class="field">备注：{{form.payComment}}</div>
        </div>
      </div>
    </div>
    <div class="pay-section" v-if="stepNum === 2">
      <div class="pay-way" :style="{display: 'none'}">
        支付方式：
        <div class="select-type">
          <SelectDown :isShow="isShowFromSelect" :list="moneyList" @selectList="checkFromCoin">
            <template v-slot:title>
              <div class="coin-title" @click="selectFromCoin">
                <div>
                  <img :src="fromCoinAvatar" alt class="coin-avatar" />
                  <input type="text" v-model="totalNumber" placeholder="0.0000" class="enter-input" />
                </div>
                <img :src="bottomArrow" alt class="arrow" />
              </div>
            </template>
          </SelectDown>
        </div>
      </div>
      <div class="pay-tips">点击“去支付”后，请打开手机端APP的首页，点击扫一扫，扫描二维码支付</div>
      <div class="go-pay" @click="goPay">-${{form.transferMoney}} USD ,去支付</div>
    </div>
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
          <div class="row" :style="{marginBottom: '0'}">
            <div class="key">转账金额</div>
            <div class="val">
              <div>
                <span class="number">-{{form.transferMoney}}</span>
                <span class="coin-addre">USD</span>
              </div>
            </div>
          </div>
          <div class="row" :style="{marginBottom: '0'}" v-if="coinAbbre !== 'USD'">
            <div class="key"></div>
            <div class="val">{{calcPrice}}</div>
          </div>
          <div class="row" :style="{marginTop: '8px'}">
            <div class="key">收款账户</div>
            <div class="val">{{form.incomeAccount}}</div>
          </div>
        </div>
      </template>
    </CreateQrcode>
    <ModalMask
      :isShowModal="isShowSendMsgModal"
      :isHideMask="isHideSendMsgMask"
      @closeModal="closeSendMsgModal"
      @openModal="openSendMsgModal"
    >
      <template v-slot:body>
        <div class="modal-content">
          <div class="modal-title">
            限额验证
            <img :src="closeBtn" alt="" class="close-btn" @click="closeSendMsgModal(false)">
          </div>
          <div class="find-pay-step">
            <div class="vertify-code">手机验证码</div>
            <VertifyCode
              :type="'1'"
              :vertifyContent="userInfo.phone"
              :areaCode="areaCode"
              :vertifyText="sendMsgPlacehode"
              :value="sendMsgCode"
              v-model="sendMsgCode"
            ></VertifyCode>
            <a href="javascript:;" class="confirm-button" @click="vertifyTelCode">确定</a>
          </div>
        </div>
      </template>
    </ModalMask>
  </div>
</template>

<script>
import { fetchBill, fetchContactList } from "../../api/request";
import axios from "../../api/request";
import ModalMask from "../components/ModalMask";
import SelectDown from "../components/SelectDown";
import CreateQrcode from "../components/CreateQrcode";
import VertifyCode from "../components/VertifyCode";
import ExcessVertify from "../components/ExcessVertify";
import QRCode from "qrcode";
import { saveDecimal, formatDate, isNumber } from "../../filters.js";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "deposit",
  components: {
    ModalMask,
    SelectDown,
    CreateQrcode,
    VertifyCode,
    QRCode,
    ExcessVertify
  },
  data() {
    return {
      tipsIcon: require("../../assets/login/tips_icon_20200730.png"),
      tips: "", // 限额提示
      isExcess: false, // 是否限额
      phoneVertifyCode: "", // 短信验证码
      isShowSendMsgModal: false, /// 验证码弹框
      isHideSendMsgMask: false, //
      tel: "",
      areaCode: "0086",
      sendMsgPlacehode: "请输入手机验证码",
      sendMsgCode: "",
      closeBtn: require("../../assets/person/close_20200722.png"),
      isShowWithdrawModal: false,
      isHideWithdrawMask: true,
      createQrcodeTitle: "转账详情",
      transId: "", // 转账id
      lastName: "",
      totalNumber: "",
      fromCoinAvatar: require("../../assets/person/usdt_icon_20200624.png"),
      bottomArrow: require("../../assets/person/bottom_icon_20200628.png"),
      isShowFromSelect: false,
      orderDetail: false, // 是否显示订单详情
      index: -1,
      contactList: [],
      contactName: "", // 收款人姓名
      comment: "", // 备注
      form: {
        incomeAccount: "", // 收款账户
        transferMoney: "", // 转账金额
        payComment: "", // 付款备注
        transferDate: "", // 转账时间
        email: "" // 收款人邮箱
      },
      isShowContactModal: false,
      isHideContactMask: true,
      depositIcon: require("../../assets/imgs/transfer_icon_20200525.png"),
      qrcode: "",
      checkCoin: "USDT", // 选中的币种
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
      password: "",
      stepNum: 1,
      orderState: "订单展开",
      timer: "",
      statusId: 0, // 状态id
      qrcodeStatus: -1, // 二维码状态
    };
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre", "userInfo"]),
    ...mapGetters(["getWallet", "getAccountList"]),
    calcPrice() {
      const { rate, coinSymbol, coinAbbre } = this;

      return (
        coinSymbol + saveDecimal(rate * +this.form.transferMoney, 2) + coinAbbre
      );
    },
    moneyList() {
      return this.getAccountList
        .filter(item => item.coinName !== "USD")
        .map(item => {
          return {
            avatar: item.coinAvatar,
            name: item.coinName,
            count: item.available,
            type: item.coinName
          };
        });
    }
  },
  mounted() {
    this.selectCoin(1, "USDT");
  },
  methods: {
    ...mapActions(['fetchWallet']),
    openSendMsgModal(show) {
      this.isShowSendMsgModal = show; // 验证码弹框
      this.isHideSendMsgMask = false;
    },
    closeSendMsgModal(show) {
      this.isShowSendMsgModal = show; /// 验证码弹框
      this.isHideSendMsgMask = true;
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
    // 选择 coin
    selectFromCoin() {
      if (this.isShowFromSelect) {
        this.isShowFromSelect = false;
      } else {
        this.isShowFromSelect = true;
      }
    },
    checkFromCoin(item) {
      this.fromCoinAvatar = item.avatar;
      this.totalNumber = item.count;
      if (this.isShowFromSelect) {
        this.isShowFromSelect = false;
      } else {
        this.isShowFromSelect = true;
      }
    },
    // 金额明细
    getMoney() {
      let money = this.form.transferMoney;
      if (!isNumber(money)) {
        return (this.form.transferMoney = "");
      }
      if (+this.form.transferMoney > +this.getWallet.usdAvail) {
        this.form.transferMoney = this.getWallet.usdAvail;
      } else {
        this.form.transferMoney = saveDecimal(money, 2);
      }
    },
    // 转账所有
    transferAll() {
      this.form.transferMoney = this.getWallet.usdAvail;
    },
    // 转账
    transfer() {
      if (this.form.incomeAccount == "") {
        this.$Message.error("收款账户不能为空");
        return;
      } else if (this.form.transferMoney == "") {
        this.$Message.error("转账金额不能为空");
        return;
      } else if (
        this.form.transferMoney &&
        !isNumber(this.form.transferMoney)
      ) {
        this.$Message.error("请输入数字");
        return;
      } else if(this.isExcess) {
        if(!this.phoneVertifyCode) {
          return this.$Message.error('请输入验证码！');
        }
      }
      this.form.transferDate = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      this.vertifyIncomeName();
    },
    // 支付
    async goPay() {
      const params = {
        info: this.form.incomeAccount + "",
        money: +this.form.transferMoney,
        coin: "USD",
        comment: this.form.payComment
      };
      this.qrcodeStatus = -1;
      const res = await axios.createTransferOrder(params);

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
    },
    openOrder() {
      if (this.orderDetail) {
        this.orderState = "订单展开";
      } else {
        this.orderState = "订单收起";
      }
      this.orderDetail = !this.orderDetail;
    },
    openContactModal(show) {
      this.isShowContactModal = show;
      this.isHideContactMask = true;
    },
    closeContactModal(show) {
      this.isShowContactModal = show;
      this.isHideContactMask = true;
    },
    closeModal(isShow) {
      this.isShowModal = isShow;
      this.isHideMask = true;
    },
    openModal(isShow) {
      this.isShowModal = isShow;
      this.isHideMask = false;
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
    // 选择 chain
    selectChain(id, name) {
      this.chainIndex = id;
      this.checkChain = name;
      this.coin = this.checkCoin + "-" + name;
    },
    // 选择联系人
    getContact(id, account, lastName, name, comment, avatar, email) {
      this.index = id;
      this.form.incomeAccount = account;
      this.form.email = email;
      this.lastName = lastName;
      this.contactName = name;
      this.comment = comment;
      this.contactAvatar = avatar;
      this.openContactModal(false);
    },
    // 获取联系人列表
    async getContactList() {
      const params = {};

      try {
        const res = await fetchContactList(params);

        if (res.code === 0) {
          this.contactList = res.data.map(item => {
            return {
              id: item.id,
              url: item.avatar
                ? item.avatar
                : item.sex === 1
                ? require("../../assets/account/man_avatar_20200710.png")
                : require("../../assets/account/woman_avatar_20200710.png"),
              lastName: item.lastName,
              comment: item.comment,
              name: "*" + item.lastName,
              account: item.phone,
              avatar: item.avatar
                ? item.avatar
                : item.sex === 1
                ? require("../../assets/account/man_avatar_20200710.png")
                : require("../../assets/account/woman_avatar_20200710.png"),
              email: item.email
            };
          });
          this.isShowContactModal = true;
        } else {
          this.$Message.error(res.msg);
        }
      } catch (error) {
        this.$Message.error(error);
      }
    },
    // 监测转账状态
    async checkTransferStatus() {
      let { transId } = this;
      this.statusId = transId.split(":")[1];
      const params = { transId: this.statusId, transType: 3 }; // transType 2、提现 3、 转账

      const res = await axios.checkTransferStatus(params);
      this.qrcodeStatus = res.code;
      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
            this.closeWitdrawModal(true);
            this.$Message.success("转账成功！");
            this.fetchWallet();
            this.$router.push({ path: "/console/usd" });
        }
      } else if(res.code === 1010060) {// 二维码过期
        clearInterval(this.timer);
      }
    },
    // 校验收款人姓名
    async vertifyIncomeName() {
      const params = {
        info: this.form.incomeAccount
      };
      const res = await axios.vertifyIncomeName(params);
      if (res.code === 0) {
        const { lastName, userId } = res.data.contacts[0];
        this.lastName = lastName;
        this.contactName = "*" + lastName;
        if(userId === this.userInfo.userId) return this.$Message.error("不能转账给自己！");
        this.payCheck();
      } else {
        this.$Message.error(res.msg);
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
        this.stepNum++;
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 风控
    async payCheck() {
      const params = {
        payType: 3, // 2、提现 3、转账
        amount: this.form.transferMoney,
        coin: ""
      };
      const res = await axios.limitPayCheck(params);
      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.stepNum++;
        } else {
          this.$Message.error(res.msg);
        }
      } else if (res.code === 1010043) {
        this.tips = res.msg;
        if(this.isExcess) {
          this.vertifyTelCode();
        } else {
          this.isExcess = true;
        }
      } else if(res.code === 1010042) {
        this.tips = res.msg;
        if(this.isExcess) {
          this.vertifyTelCode();
        } else {
          this.isExcess = true;
        }
      } 
      else {
        this.$Message.error(res.msg);
      }
    },
    beforeDestory() {
      if(this.timer) clearInterval(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-content {
  width: 480px;
  padding: 23px 26px 32px;
}
.modal-title {
  display: flex;
  justify-content: space-between;
  font-weight: 400;
  color: #333;
  font-size: 20px;
  .close-btn {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
.vertify-code {
  margin-top: 25px;
  margin-bottom: 7px;
  font-size: 12px;
  color: #666;
}
.confirm-button {
    display: block;
    margin-top: 40px;
    padding: 11px 0;
    text-align: center;
    color: #fff;
    font-size: 17px;
    background: #3674D7;
    border-radius: 4px;
    transition: all .2s ease-in;
    &:hover {
        color: #fff;
        text-decoration: none !important;
    }
}
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
@mixin field {
  display: inline-block;
  width: 312px;
  color: #7d91a9;
  font-size: 14px;
}
.modal-head {
  width: 480px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 26px;
  background: #f6f8ff;
  .modal-title {
    font-size: 20px;
    color: #333;
  }
  .modal-close {
    font-size: 16px;
    cursor: pointer;
  }
}
@mixin con-list {
  .coin-avatar {
    width: 20px;
    height: 20px;
  }
  .enter-input {
    vertical-align: middle;
    margin-left: 8px;
    width: 200px;
    &:focus {
      border: none;
      outline: none;
    }
    &::placeholder {
      font-size: 14px;
      color: #ccc;
    }
  }
  .usdt {
    font-size: 14px;
    color: #666;
    vertical-align: middle;
  }
  .split {
    display: inline-block;
    width: 1px;
    height: 10px;
    background: rgba(204, 204, 204, 1);
    opacity: 0.3;
    margin: 0 10px;
    vertical-align: middle;
  }
  .all {
    font-size: 14px;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    vertical-align: middle;
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
  }
  .content {
    padding: 42px 64px;
    .row {
      display: flex;
      align-items: center;
      margin-top: 18px;
      &:first-child {
        margin-top: 0;
      }
      .key {
        color: #666;
        font-size: 14px;
        width: 130px;
      }
      .val {
        .account-tips {
          display: inline-block;
          padding: 4px 16px;
          border: 1px solid #e7c560;
          background: #ffffb8;
          margin-top: 8px;
          color: #687292;
          font-size: 12px;
          .tips-icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
          .tips-text {
            vertical-align: middle;
          }
        }
        .get-code {
          cursor: pointer;
          color: #3674D7;
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
        .input-tips {
          font-size: 12px;
          color: #666;
          margin-top: 6px;
          cursor: pointer;
        }
        .contact {
          margin-left: 8px;
          color: #3674d7;
          font-size: 14px;
          cursor: pointer;
        }
        .contact-list {
          position: relative;
          display: inline-block;
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
  }
  .transfer-info {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 62px;
    .base-info {
      padding-top: 18px;
      border-right: 1px dashed #cccccc;
      .pay-money {
        margin-bottom: 30px;
        font-size: 14px;
        color: #333;
      }
      .usd {
        color: #ff733a;
        font-size: 24px;
        margin-left: 17px;
      }
      .addre {
        color: #ff733a;
        font-size: 14px;
        margin: 0 24px 0 4px;
      }
      .transform-money {
        color: #7d91a9;
        font-size: 14px;
      }
      .field {
        @include field;
      }
    }

    .order-open {
      .order-button {
        color: #3674d7;
        border: 1px solid #3674d7;
        padding: 8px 12px;
        border-radius: 2px;
        cursor: pointer;
        margin-left: 46px;
      }
    }
  }
  .order-detail {
    padding: 16px 62px;
    .field {
      @include field;
    }
  }
}
.pay-section {
  margin: 22px 30px;
  padding: 32px 0 40px;
  background: #fff;
  text-align: center;
  .pay-way {
    font-size: 14px;
    color: #333;
    margin-right: 8px;
    font-weight: bold;
  }
  .pay-tips {
    // margin: 40px 0 16px;
    margin-bottom: 16px;
    color: #333;
    font-size: 14px;
  }
  .go-pay {
    display: inline-block;
    width: 360px;
    padding: 12px 0;
    text-align: center;
    background: #3674d7;
    color: #fff;
    font-size: 17px;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    font-size: 17px;
  }
  .coin-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .arrow {
      width: 13px;
      height: 8px;
    }
  }
  .select-type {
    display: inline-block;
    width: 428px;
  }
  @include con-list;
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
</style>