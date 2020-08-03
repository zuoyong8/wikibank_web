<template>
  <!-- 提现页面 -->
  <div class="cash-out">
    <mineTop ref="mine"></mineTop>
    <div class="title">
      <div class="icon"></div>
      <div class="txt">提现</div>
      <div class="type" v-if="showType">
        <div class="circle"></div>
        <div class="type-txt">{{txt}}</div>
        <div class="rate">
          <div class="rate-left">(1 USD = {{convert}} {{txt}})</div>
          <div class="rate-right">汇率零损失</div>
        </div>
      </div>
    </div>
    <div class="methods" v-if="showMethod">
      <div class="methods-top">
        <div class="methods-top-left">提现方式</div>
        <div class="methods-top-right">
          <div
            class="OMNI"
            v-for="(item,key) in coins"
            :key="item.code"
            @click="changeCoin(key)"
            :class="{'active':isActive==key}"
          >
            <div class="icon" :style="{backgroundImage:`url(${item.icon})`}"></div>
            <div class="txt">{{item.name}}</div>
            <div class="active-icon"></div>
          </div>
        </div>
      </div>
      <Form :model="formLeft" label-position="left" :label-width="100" class="form" v-if="showForm">
        <div style="margin-top:40px" class="first">
          <span style="margin-right:80px">提现地址</span>
          <Input
            v-model="formLeft.input1"
            class="input"
            placeholder="粘贴地址或从地址薄选择"
            type="text"
            @on-blur="leave"
          />
          <span class="txt" @click="selectAddress">
            <span class="icon-uniE900"></span>
            <span>地址簿</span>
          </span>
        </div>
        <div class="rate">
          <div class="rate-left" v-if="numShow">(1 {{txt}} = {{usd}} USD)</div>
          <div class="rate-left" v-if="!numShow">( 1 USD = {{convert}} {{txt}})</div>
          <div class="rate-right">汇率零损失</div>
        </div>

        <div class="second">
          <span style="margin-right:80px" v-if="numShow">提现数量</span>
          <Input
            v-model="formLeft.input2"
            @on-keydown="changeNum()"
            placeholder="输入提现数量"
            class="input"
            v-if="numShow"
          />
          <div class="num" v-if="numShow">
            <div class="num-left">= ${{numAccount}} USD</div>
            <div class="num-right" @click="numClick">按USD金额提现</div>
          </div>

          <span style="margin-right:80px" v-if="!numShow">提现金额</span>
          <Input
            v-model="formLeft.input6"
            placeholder="输入提现金额"
            @on-change="changeWithdrawNum"
            class="input"
            v-if="!numShow"
            required="required"
          />
          <div class="num" v-if="!numShow">
            <div class="num-left">={{amountConvert}}{{txt}}</div>
            <div class="num-right" @click="numClick">按{{txt}}数量提现</div>
          </div>
        </div>

        <div style="margin-top:40px" class="third">
          <span style="margin-right:43px">手续费(矿工费)</span>
          <Input readonly v-model="formLeft.input3" placeholder="$0.0" class="input" />
        </div>
        <div style="margin-top:40px" class="forth">
          <!-- <span style="margin-right:80px">提现补贴</span> -->
          <Input readonly v-model="formLeft.input4" class="input" style="backgroundColor:white" />
        </div>
        <div style="margin-top:40px">
          <span style="margin-right:80px">提现备注</span>
          <Input v-model="formLeft.input5" class="input" placeholder="仅在“账户明细”中显示" />
        </div>
        <FormItem>
          <Button type="primary" class="button" @click="widthdraw" :style="{opacity:opacity}">提现</Button>
        </FormItem>
      </Form>
      <div class="divide" v-if="aa"></div>
      <div class="methods-bottom-b">
        <div class="icon"></div>
        <div class="txt">请选择您的提现方式</div>
      </div>
      <div class="methods-bottom-b" v-if="aa">
        <div class="icon"></div>
        <div class="txt">一旦转错资产将不可找回</div>
      </div>
    </div>
    <div class="tabs" v-if="show">提现账单</div>
    <div v-if="show">
      <InfiniteLoad
        :orderList="formatAccountList"
        :isLoading="isLoading"
        :noMore="noMore"
        @loadMore="loadMore"
      ></InfiniteLoad>
    </div>

    <!-- 弹出框 -->
    <div class="popup" v-if="know">
      <div class="divide-left"></div>
      <div class="divide-right"></div>
      <div class="top">
        <div class="txt">请确认提现类型</div>
        <div class="icon">
          <div class="icon-left">
            <img src="../../assets/imgs/cashOut1.svg" alt width="40px" height="40px" />USD
          </div>
          <div class="icon-center"></div>
          <div class="icon-right">
            <img :src="icon" width="40px" height="40px" />
            {{txt}}
          </div>
        </div>
      </div>
      <div class="popup-bottom">仅支持{{txt}}地址，一旦转错资产将不可找回</div>
      <div class="popup-bottom-b">您的美元资产将会自动兑换成{{txt}}，</div>
        <!-- 并额外补贴提现总额的1%</div> -->
      <div class="popup-button" @click="iKnow">我已知晓</div>
    </div>
    <!--提示地址簿-->
      <ModalMask
        :isShowModal = "isShowAddressModal"
        :isHideMask = "isHideAddressMask"
        @closeModal = "closeAddressModal"
        @openModal = "openAddressModal"
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
                <span class="withdraw-type">{{item.coin}}</span>
                <span class="withdraw-code">({{item.address}})</span>
                <span class="radio" :class="index === item.id ? 'active':''"></span>
              </div>
            </div>
          </div>
        </template>
      </ModalMask>
      
    <!-- </div> -->
    <!--提现账单 -->
    <div class="order" v-if="showType">
      <div class="account">
        <div class="account-left">提现数量</div>
        <div class="avatar" :style="{backgroundImage:`url(${avatar})`}"></div>
        <div class="account-right">${{numAccount}}</div>
        <div class="coin-type">{{txt}}</div>
        <!-- <div class="tip">已含补贴</div> -->
      </div>
      <div class="order-bottom">
        <div class="order-btop">
          <span class="left">提现地址: 
            <span @click="isShowAddr">{{address}}</span>
          </span>
          <span class="left">提现金额：-$ {{formLeft.input3}} USD</span>
          <!-- <span class="left">提现补贴：+ {{formLeft.input4}}</span> -->
        </div>
        <div class="order-btop">
          <span class="left">变动金额：-$ {{numAccount}} USD</span>
          <span class="left">手续费(矿工费）：-$ {{withdrawalFee}} USD</span>
        </div>
      </div>
    </div>
    <!--提现支付区域 -->
    <div class="pay" v-if="showType">
      <span class="pay-txt">点击“去支付”后，请打开手机端APP的首页，点击扫一扫，扫描二维码支付</span>
      <div class="button" @click="confirmWithdraw">-$ {{numAccount}} USD,去支付</div>
    </div>
    <!-- 提现二维码遮盖层 -->
    <ModalMask
      :isShowModal = "isShowWithdrawModal"
      :isHideMask = "isHideWithdrawMask"
      @closeModal = "closeWitdrawModal"
      @openModal = "openWithdrawModal"
    >
      <template v-slot:body>
      <div class="mask">
        <div class="top">
          <div class="logo">
            <img src="../../assets/imgs/transfer1.svg" alt="加载中" width="128px" height="32px" />
          </div>
          <div class="txt">提现·USDT-ERC20</div>
          <div class="close-icon" @click="closeWitdrawModal(false)">
            <span class="icon--copy4"></span>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="left-top">
              <div class="account">
                <div class="account-left">提现数量</div>
                <div class="avatar" :style="{backgroundImage:`url(${avatar})`}"></div>
                <div class="account-right"></div>
                <div class="coin-type">{{txt}}</div>
                <!-- <div class="tip">已含补贴</div> -->
              </div>
            </div>
            <div class="money">变动金额：-${{numAccount}} USD</div>
            <canvas id="qrcode"></canvas>
            <div class="sweep">
              <div class="sweep-icon"></div>
              <div class="sweep-txt">打开手机端APP扫描二维码</div>
            </div>
            <div class="finish">
              <div class="finish-icon"></div>
              <div class="finish-txt">
                <p>187****4784已创建支付订单</p>
                <p>请在WikiPay 上完成支付</p>
              </div>
            </div>
          </div>
          <div class="right">
            <img src="../../assets/imgs/transfer2.png" alt />
          </div>
        </div>
      </div>
      </template>
    </ModalMask>
  </div>
</template>

<script>
import mineTop from "../components/mineTop";
import QRCode from "qrcode";
import {
  formatDate,
  getStatus,
  getDate,
  getTime,
  formatNumberFloor
} from "../../filters.js";
import { fetchBill, fetchAddressList, handleWithdraw } from "../../api/request";
import InfiniteLoad from "../components/InfiniteLoad";
import ModalMask from "../components/ModalMask";
import { mapState, mapGetters } from "vuex";

export default {
  name: "cash-out",
  components: {
    mineTop,
    QRCode,
    InfiniteLoad,
    ModalMask
  },
  data() {
    return {
      isHideAddressMask: true,
      isShowAddressModal: false,
      isShowWithdrawModal: false,
      isHideWithdrawMask: true,
      coins: [],
      item: {},
      aa: true,
      formLeft: {
        input1: "", // 提现地址
        input2: "", // 提现数量
        input3: "", // 提现手续费(矿工费)
        input4: "", // 提现补贴
        input5: "", // 提现备注
        input6: "" // 提醒按金额
      },
      showType: false,
      know: false,
      show: true,
      showForm: false,
      txt: "", //弹出框的文字变化
      transId: "", //二维码
      showMethod: true, //提现方式

      usd: 0, // 币种汇率
      numShow: true,
      convert: 0, //换算
      amountConvert: "", //金额换算
      payPrecision: "", // 显示精度
      activityFee: "", // 奖励比率
      withdrawalFee: "", //提现手续率
      //num:0,
      numAccount: 0,
      avatar: "",
      isActive: 10,
      icon: "",
      infos: [],
      opacity: 0.49,
      statusKey: 2,
      rows: 10,
      page: 0,
      orderList: [],
      isLoading: true,
      noMore: false,
      index: -1,
      addressList: [],
      address: "显示地址", // 地址
      originCoinType: "" // 币种类型
    };
  },
  mounted() {
    this.getCoin();
    this.getInformation();
    this.loadMore();
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre"]),
    ...mapGetters(["getAvail"]),
   
    formatAccountList() {
      let { rate, coinSymbol, coinAbbre, orderList } = this;

      return orderList.map(item => {
        let comment = item.comment ? item.comment : "";
        let type, state, usd, orderId;
        let order = item.orderId + "";
        let orderStart = order.substring(0, 4);
        let orderEnd = order.substring(order.length - 3, order.length);
        let orderDateTime = formatDate(item.createAt, "yyyy-MM-dd hh:ss");
        let usdt = formatNumberFloor(item.amount, item.showPrecision);
        let statusStr = item.status === 1 ? "成功" : "失败";
        let sex = item.sex === 1 ? "先生" : "女士";
        let coin = item.type === 3 ? "USD" : item.coin;

        orderId = orderStart + "......" + orderEnd;

        if (item.type == 1) {
          type = "充值";
        } else if (item.type === 2) {
          type = "提现";
        } else if (item.type === 3) {
          type = "转账 ";
        } else if (item.type === 6) {
          type = "VISA转入";
        } else if (item.type === 8) {
          type = "商家";
        } else if (item.type === 9) {
          type = "AB卡充值";
        }

        // 根据usd计算对应的货币价格
        if (item.coin == "AB" || item.coin == "USD") {
          usd =
            coinSymbol +
            formatNumberFloor(item.money * rate, item.showPrecision) +
            coinAbbre;
        } else {
          usd =
            coinSymbol +
            formatNumberFloor(item.usd * rate, item.showPrecision) +
            coinAbbre;
        }

        return {
          id: item.orderId,
          avator: item.icon,
          createTime: orderDateTime,
          date: getDate(orderDateTime),
          time: getTime(orderDateTime),
          name: item.firstName + sex,
          account: "USDT-ERC20",
          orderId: item.orderId,
          ellipsisOrderId: orderId,
          usdt: item.money + coin, // 数字货币
          usd: usd, // 转换后对应的货币
          showPrecision: item.showPrecision, // 保留的小数位数
          state: statusStr, // 账单状态
          type: "提现", // 账单类型
          marks: comment
        };
      });
    }
  },
  methods: {
    isShowAddr() {
      this.address = this.formLeft.input1;
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
    },
    // 选择联系人
    getContact(account, name, isShow, imName) {
      this.form.incomeAccount = account;
      this.contactName = name;
      this.comment = imName;
      this.isShowAddressModal = false;
    },
    // 选择提现地址
    async selectAddress() {
      this.isShowAddressModal = true;
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
              address: item.address
            };
          });

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
      this.formLeft.input1 = address;
      this.openAddressModal(false);
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

    // 获取虚拟币币种
    getCoin() {
      this.$getCoin({ type: 2 }, res => {
        this.coins = res.data;
      });
    },
    //头像
    getInformation() {
      this.$getInformation("", res => {
        this.avatar = res.data.avatar;
      });
    },
    changeCoin(key) {
      this.originCoinType = this.coins[key].name;
      this.isActive = key;
      this.icon = this.coins[key].icon;
      this.aa = false;
      this.know = true;
      this.show = false;
      this.showForm = true;
      this.txt = this.coins[key].name;
      this.activityFee = this.coins[key].activityFee;
      this.payPrecision = this.coins[key].payPrecision;
      this.withdrawalFee = this.coins[key].withdrawalFee;
      let coinName = "";
      if (this.txt.indexOf("USDT") >= 0) {
        coinName = "usdt";
        this.txt = "USDT";
      } else {
        coinName = this.txt.toLowerCase();
      }
      this.$getUsd({ coin: coinName }, res => {
        this.usd = res.data.usd;
        if (this.usd == 0) {
          return;
        } else {
          this.convert = 1 / this.usd;
        }
      });
      this.formLeft.input1 = "";
      this.formLeft.input2 = "";
      this.formLeft.input3 = "";
      this.formLeft.input4 = "";
      this.formLeft.input5 = "";
      this.formLeft.input6 = "";
      this.amountConvert = "";
    },
    // 点击我已经知晓
    iKnow() {
      this.know = false;
      this.showForm = true;
    },
    numClick() {
      this.numShow = !this.numShow;
      this.formLeft.input2 = "";
      this.formLeft.input3 = "";
      this.formLeft.input4 = "";
      this.formLeft.input5 = "";
    },
    //提现数量校验
    // 输入其他类型货币的数量计算出等价的 USD
    changeNum() {
      let transferNum = this.getAvail / this.usd;
      if (this.formLeft.input2 > transferNum) {
        this.formLeft.input2 = transferNum;
      }
      let numAccount = this.usd * this.formLeft.input2;
      let input3 = this.withdrawalFee * this.usd;
      let input4 = this.activityFee * this.numAccount;
      this.numAccount = this.formatNumberCeil(numAccount, this.payPrecision);
      this.formLeft.input3 = this.formatNumberCeil(input3, this.payPrecision);
      this.formLeft.input4 = this.formatNumberCeil(input4, this.payPrecision);
    },
    // 根据输入金额（USD）的计算 等价其他类型货币
    changeWithdrawNum() {
      if (this.formLeft.input6 > this.getAvail) {
        this.formLeft.input6 = this.getAvail;
      }
      let amountConvert = this.formLeft.input6 * this.convert;
      this.amountConvert = this.formatNumberCeil(
        amountConvert,
        this.payPrecision
      );
      let input3 = this.withdrawalFee * this.usd;
      let input4 = this.activityFee * this.amountConvert;
      this.formLeft.input3 = this.formatNumberCeil(input3, this.payPrecision);
      this.formLeft.input4 = this.formatNumberCeil(input4, this.payPrecision);
    },
    //提现地址提现
    leave() {
      if (this.formLeft.input1 == "") {
        this.$Message.error("提现地址不能为空");
        return;
      }
    },
    //提现数量

    //校验提现
    widthdraw() {
      let reg = /[^\d.]/g;
      if (this.formLeft.input1 == "") {
        this.$Message.error("提现地址不能为空");
        return;
      } else if (this.formLeft.input2 == "") {
        this.$Message.error("提现数量不能为空");
        return;
      } else if (
        this.formLeft.input2 &&
        new RegExp(reg).test(this.formLeft.input2)
      ) {
        this.$Message.error("请输入数字");
        return;
      } else {
        this.opacity = 1;
      }
      this.showType = true;
      this.showForm = false;
      this.showMethod = false;
    },
    // 确认提现
    async confirmWithdraw() {
      this.openWithdrawModal(true);
      const params = {
        coin: this.originCoinType, // 提现币种
        address: this.formLeft.input1,  // 提现的地址
        amount: parseFloat(this.formLeft.input2), // 提现数量
        usd: parseFloat(this.usd),  //币种汇率
        comment: this.formLeft.input5 // comment 备注
      };
      try {
        const res = await handleWithdraw(params);

        if( res.code === 0 ) {
          this.transId = res.data.transId;
          const qrcode = document.querySelector("#qrcode");
          QRCode.toCanvas(qrcode, this.transId, {
            width: 223,
            height: 211
          });
        } else {
          this.$Message.error(res.msg);
        }
      } catch (error) {
        this.$message.error(error);
      }

    }
    
  }
};
</script>
<style lang='scss' scoped>
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
.cash-out {
  padding-left: 308px;
  height: 100%;
  padding-top: 88px;
  min-width: 1200px;
  position: relative;

  .mask {
    width: 939px;
    height: 580px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
    border-radius: 9px;

    .top {
      height: 61px;
      border-bottom: 1px solid #f0f0f0;

      .logo {
        float: left;
        margin-left: 32px;
        margin-top: 18px;
        width: 131px;
        height: 31px;
      }

      .close-icon {
        margin-top: 25px;
        margin-left: 570px;
        width: 16px;
        height: 16px;
        float: left;
        cursor: pointer;
      }

      .txt {
        font-size: 17px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        float: left;
        margin-top: 21px;
        margin-left: 17px;
        height: 22px;
      }
    }

    .bottom {
      margin-left: 114px;
      margin-right: 130px;

      .left {
        float: left;
        width: 243px;
        margin-right: 240px;
        margin-top: 37px;
      }

      .finish {
        height: 33px;
        margin-top: 28px;
        margin-left: 12px;

        .finish-icon {
          height: 33px;
          width: 33px;
          background-image: url("../../assets/imgs/withdraw2.png");
          float: left;
          margin-right: 14px;
        }

        .finish-txt {
          float: left;
          height: 40px;
          font-size: 14px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
      }

      .sweep {
        height: 22px;
        font-size: 13px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        margin-top: 7px;
        margin-left: 25px;

        .sweep-icon {
          background-image: url("../../assets/imgs/withdraw1.png");
          width: 21px;
          height: 22px;
          float: left;
          margin-right: 14px;
        }

        .sweep-txt {
          float: left;
        }
      }

      .money {
        height: 16px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(125, 145, 169, 1);
        line-height: 16px;
        margin-top: 12px;
        margin-left: 41px;
      }

      .left-top {
        height: 31px;

        .account {
          height: 31px;

          .coin-type {
            height: 19px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: rgba(255, 115, 58, 1);
            line-height: 19px;
            float: left;
            margin-top: 4px;
          }

          .tip {
            padding: 0 3px;
            height: 17px;
            line-height: 17px;
            border-radius: 2px;
            border: 1px solid rgba(255, 115, 58, 1);
            font-size: 10px;
            font-family: PingFang-SC-Regular, PingFang-SC;
            font-weight: 400;
            color: rgba(255, 115, 58, 1);
            text-align: center;
            float: left;
            margin-top: -14px;
          }

          .account-right {
            float: left;
            font-size: 24px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: rgba(255, 115, 58, 1);
            margin-right: 6px;
            margin-top: 10px;
          }

          .account-left {
            float: left;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: rgba(51, 51, 51, 1);
            margin-right: 7px;
            margin-top: 7px;
          }

          .avatar {
            float: left;
            width: 23px;
            height: 23px;
            border-radius: 50%;
            margin-right: 8px;
            background-size: 100%;
            margin-top: 8px;
          }
        }
      }

      #qrcode {
        width: 243px;
        height: 228px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(233, 233, 233, 1);
        // margin-top 11px
      }

      .right {
        float: left;
        margin-top: 55px;
        // width 480px
        // height 457px
        // background:linear-gradient(90deg,rgba(251,253,255,0) 0%,rgba(245,249,254,1) 19%,rgba(245,249,254,1) 87%,rgba(245,249,254,0) 100%);
      }
    }
  }

  .order {
    height: 169px;
    border: 1px solid rgba(240, 240, 240, 1);
    margin-top: 8px;

    .account {
      height: 31px;
      margin-top: 35px;
      margin-left: 24px;

      .coin-type {
        height: 19px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 115, 58, 1);
        line-height: 19px;
        margin-top: 13px;
        float: left;
      }

      .tip {
        width: 56px;
        line-height: 14px;
        height: 16px;
        border-radius: 2px;
        border: 1px solid rgba(255, 115, 58, 1);
        font-size: 10px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: rgba(255, 115, 58, 1);
        text-align: center;
        float: left;
        margin-top: -7px;
      }

      .account-left {
        float: left;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        margin-right: 17px;
        margin-top: 10px;
      }

      .avatar {
        margin-top: 8px;
        float: left;
        width: 23px;
        height: 23px;
        border-radius: 50%;
        margin-right: 9px;
        background-size: 100%;
      }

      .account-right {
        float: left;
        font-size: 24px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(255, 115, 58, 1);
        margin-right: 2px;
        margin-top: 10px;
      }
    }

    .order-bottom {
      margin-left: 97px;
      margin-top: 16px;
      height: 48px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(125, 145, 169, 1);

      .order-btop {
        margin-bottom: 16px;

        .left {
          width: 330px;
          display: inline-block;
        }
      }

    }
  }

  .address {
    width: 480px;
    height: 427px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -196px;
    margin-top: -100px;

    .address-top {
      width: 480px;
      height: 75px;
      background: rgba(246, 248, 255, 1);
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);
      line-height: 75px;
      font-size: 20px;
      padding: 0 26px;
    }
    .modal-head {
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
  }

  .pay {
    height: 161px;
    background: rgba(245, 248, 253, 1);
    text-align: center;
    padding-top: 34px;
    margin-top: 27px;

    .pay-txt {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);
    }

    .button {
      width: 360px;
      height: 48px;
      background: rgba(54, 116, 215, 1);
      border-radius: 4px;
      font-size: 17px;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
      line-height: 48px;
      text-align: center;
      margin: 0 auto;
      margin-top: 28px;
      cursor: pointer;
    }
  }

  .popup {
    width: 416px;
    height: 329px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;

    .divide-left,
    .divide-right {
      width: 61px;
      height: 1px;
      opacity: 0.2;
      position: absolute;
      top: 46px;
    }

    .divide-left {
      left: 71px;
      background: linear-gradient(
        270deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(216, 216, 216, 0) 100%
      );
    }

    .divide-right {
      right: 82px;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(216, 216, 216, 0) 100%
      );
    }

    .top {
      height: 156px;
      background: rgba(246, 248, 255, 1);
      padding-top: 39px;
      margin-bottom: 28px;

      .txt {
        height: 16px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 1);
        line-height: 16px;
        margin: 0 153px;
      }

      .icon {
        margin: 20px 123px;

        .icon-left,
        .icon-center,
        .icon-right {
          float: left;
          text-align: center;
        }

        .icon-left,
        .icon-right {
          width: 40px;
          height: 40px;

          img {
            margin-bottom: 6px;
          }
        }

        .icon-center {
          background: url("../../assets/imgs/cashOut2.svg");
          width: 18px;
          height: 6px;
          margin: 15px 20px 19px 28px;
        }
      }
    }

    .popup-bottom,
    .popup-bottom-b {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(0, 0, 0, 0.65);
      text-align: center;
      height: 12px;
    }

    .popup-bottom-b {
      margin-top: 8px;
    }

    .popup-button {
      width: 140px;
      height: 32px;
      background: rgba(54, 116, 215, 1);
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      border-radius: 4px;
      margin: 40px 138px 0 138px;
      line-height: 32px;
      cursor: pointer;
    }
  }

  .title {
    margin-top: 16px;
    height: 64px;
    background: rgba(245, 246, 250, 1);
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(98, 105, 127, 1);

    .icon {
      width: 24px;
      height: 18px;
      mask: url("../../assets/imgs/mine9.svg") no-repeat;
      margin: 25px 0 23px 16px;
      float: left;
      background: rgba(98, 105, 127, 1);
    }

    .txt {
      margin: 17px 0;
      float: left;
      height: 30px;
      line-height: 30px;
    }

    .type {
      float: left;
      height: 30px;

      .circle {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(98, 105, 127, 1);
        float: left;
        margin: 31px 3px;
      }

      .type-txt {
        float: left;
        margin: 23px 0;
        height: 30px;
      }

      .rate {
        height: 14px;
        float: left;
        margin-top: 25px;

        .rate-left {
          float: left;
          font-size: 14px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: rgba(78, 176, 145, 1);
        }

        .rate-right {
          float: left;
          font-size: 10px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: rgba(63, 157, 127, 1);
          margin: 1px 9px;
          background: rgba(238, 249, 245, 1);
          border-radius: 2px;
          min-width: 59px;
        }
      }
    }
  }

  .methods {
    height: 170px;
    margin-bottom: 73px;

    .methods-top {
      margin-top: 27px;
      height: 32px;

      .methods-top-left {
        height: 17px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
        line-height: 14px;
        float: left;
        margin: 8px 80px 8px 16px;
      }

      .methods-top-right {
        height: 32px;
        float: left;

        .OMNI {
          float: left;
          margin-right: 24px;
          height: 32px;
          background: rgba(247, 246, 251, 1);
          min-width: 52px;
          cursor: pointer;

          .icon {
            float: left;
            margin: 7px 4px 7px 12px;
            width: 18px;
            height: 18px;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
          }

          .txt {
            margin: 10px 12px 10px 0;
            height: 13px;
            font-size: 16px;
            font-family: MicrosoftYaHei;
            color: rgba(34, 34, 34, 1);
            line-height: 12px;
            float: left;
          }
        }

        .active {
          box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
          border: 1px solid rgba(54, 116, 215, 1);
          position: relative;

          .active-icon {
            background: url("../../assets/imgs/deposit1.png");
            position: absolute;
            right: 0;
            bottom: 0;
            width: 16px;
            height: 12px;
          }
        }
      }
    }

    .divide {
      height: 1px;
      background: rgba(235, 235, 235, 1);
      margin-left: 155px;
      margin-top: 43px;
    }

    .methods-bottom-top {
      height: 14px;
      margin-top: 25px;
      margin-left: 195px;

      .icon {
        width: 4px;
        height: 4px;
        background: rgba(216, 216, 216, 1);
        border-radius: 50%;
        float: left;
        margin: 7px 7px 5px 0;
      }

      .txt {
        width: 342px;
        height: 14px;
        background-image: url("../../assets/imgs/recharge7.png");
        background-repeat: no-repeat;
        float: left;
      }
    }

    .methods-bottom-b {
      height: 14px;
      margin-left: 155px;
      margin-top: 14px;

      .icon {
        margin: 5px 7px 5px 0;
        width: 4px;
        height: 4px;
        background: rgba(216, 216, 216, 1);
        border-radius: 50%;
        float: left;
      }

      .txt {
        width: 342px;
        height: 14px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(153, 153, 153, 1);
        line-height: 14px;
        float: left;
      }
    }

    .form {
      margin-top: 24px;
      margin-left: 15px;

      .first {
        .txt {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(54, 116, 215, 1);
          margin-left: 19px;
          cursor: pointer;

          span {
            margin-right: 4px;
          }
        }
      }

      .second {
        .num {
          margin-left: 150px;
          margin-top: 8px;

          .num-left {
            float: left;
            margin-right: 235px;
          }

          .num-right {
            float: left;
            font-size: 12px;
            font-family: PingFang-SC-Regular, PingFang-SC;
            font-weight: 400;
            color: rgba(54, 116, 215, 1);
            cursor: pointer;
          }
        }
      }

      .rate {
        height: 14px;
        margin: 19px 0 9px 137px;

        .rate-left {
          float: left;
          font-size: 14px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: rgba(78, 176, 145, 1);
        }

        .rate-right {
          float: left;
          font-size: 10px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: rgba(63, 157, 127, 1);
          margin: 1px 9px;
          background: rgba(238, 249, 245, 1);
          border-radius: 2px;
          min-width: 59px;
        }
      }

      .input {
        width: 360px;
        height: 36px;
        background: rgba(255, 255, 255, 1);
      }

      .button {
        width: 360px;
        height: 48px;
        background: rgba(54, 116, 215, 1);
        border-radius: 4px;
        font-size: 17px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 34px;
        text-align: center;
        margin-top: 39px;
        margin-left: 33px;
        opacity: 0.49;
      }
    }
  }

  .tabs {
    height: 64px;
    line-height: 64px;
    background: rgba(245, 246, 250, 1);
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: rgba(102, 102, 102, 1);
    padding-left: 16px;
  }

  .asset {
    margin-left: 40px;

    .header {
      height: 65px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(183, 183, 183, 1);

      th {
        height: 19px;

        & > div {
          margin-top: 26px;
        }

        .first {
          margin-right: 50px;
          width: 29px;
          margin-left: 16px;
        }

        .sec {
          margin-right: 192px;
          width: 57px;
        }

        .third {
          margin-right: 430px;
          width: 140px;
        }

        .forth {
          margin-right: 163px;
          width: 77px;
        }

        .fifth {
          margin-right: 190px;
          width: 29px;
        }

        .six {
          margin-right: 132px;
          width: 29px;
        }

        .seven {
          width: 29px;
        }
      }
    }
  }

  .row {
    height: 81px;
    border-top: 1px solid #f6f6f6;

    td {
      .avatar {
        margin-right: 50px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-top: 26px;
        margin-left: 16px;
      }

      .time {
        width: 84px;
      }

      .sec {
        margin-right: 430px;
        width: 140px;

        .time-top {
          width: 132px;
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          font-family: MicrosoftYaHei;
        }

        .time-bottom {
          width: 132px;
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: MicrosoftYaHei;
        }
      }

      .third {
        margin-right: 163px;
        width: 104px;
        font-size: 14px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      .forth {
        margin-right: 190px;
        width: 58px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
        font-family: MicrosoftYaHei;
      }

      .fifth {
        margin-right: 132px;
        width: 29px;
      }

      .six {
        width: 29px;
      }
    }
  }
}
</style>