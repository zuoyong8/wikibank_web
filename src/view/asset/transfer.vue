<!-- 转账 -->
<template>
  <div class="transfer">
    <mineTop></mineTop>
    <div class="title">
      <div class="icon"></div>
      <div class="txt">转账</div>
    </div>
    <!-- 转账表单 -->
    <Form :model="form" label-position="left" :label-width="100" class="form" v-if="showForm">
      <div class="form-first">
        <span class="left">收款账户</span>
        <Input
          v-model="form.incomeAccount"
          placeholder="手机号或邮箱"
          class="input"
          @on-blur="getContactInfo"
        />
        <div class="contact-list" @click="getContactList">
          <span class="icon--copy3" style="margin-left:15px;margin-right:8px"></span>
          <span class="contact">联系人</span>
          <ModalMask 
            :isShowModal = "isShowContactModal"
            :isHideMask = "isHideContactMask"
            @closeModal = "closeContactModal"
            @openModal = "openContactModal"
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
                    @click.stop="getContact(item.id, item.account, item.name, item.comment, item.avatar, item.email )"
                  >
                    <img :src="item.url" alt="" class="withdraw-pic" />
                    <span class="withdraw-type">{{item.comment}} ({{item.name}})</span>
                    <span class="withdraw-code">账号：({{item.account}})</span>
                    <span class="radio" :class="index === item.id ? 'active':''"></span>
                  </div>
                </div>
              </div>
            </template>
          </ModalMask>
        </div>
      </div>
      <div class="form-first">
        <span class="left">转账金额</span>
        <Input v-model="form.transferMoney" placeholder="$0.00" class="input" @on-change="getMoney" />
        <div class="calc-price">
          ≈{{calcPrice}}
        </div>
      </div>
      <div class="form-first">
        <span class="left">付款备注</span>
        <Input v-model="form.payComment" class="input" />
      </div>
      <Button type="primary" @click="transfer" class="button">转账</Button>
    </Form>

    <div class="" v-if="showForm">
      <InfiniteLoad
        :orderList="formatAccountList"
        :isLoading="isLoading"
        :noMore="noMore"
        @loadMore="loadMore"
      ></InfiniteLoad>
    </div>
    <!--转账账单 -->
    <div class="order" v-if="showType">
      <div class="account">
        <div class="account-left">转账金额</div>
        <div class="avatar" :style="{backgroundImage:`url(${contactAvatar})`}"></div>
        <div class="account-right">-${{form.transferMoney}}</div>
        <div class="coin-type">USD</div>
        <div class="tip">已含补贴</div>
      </div>
      <div class="order-bottom">
        <div class="order-bbottom">
          <span class="left">收款账户：{{form.email}}</span>
          <span class="left">付款账户：{{email}}</span>
        </div>
        <div class="order-bbottom">
          <span class="left">订单时间：{{form.transferDate}}</span>
          <span class="left">备注：{{form.payComment}}</span>
        </div>
      </div>
    </div>
    <!--转账支付区域 -->
    <div class="pay" v-if="showType">
      <span class="pay-txt">点击“去支付”后，请打开手机端APP的首页，点击扫一扫，扫描二维码支付</span>
      <div class="button" @click="confirmTransfer">-$ {{form.transferMoney}} USD,去支付</div>
    </div>
    <!-- 转账二维码遮盖层 -->
      <ModalMask 
        :isShowModal = "isShowModal"
        :isHideMask = "isHideMask"
        @closeModal = "closeModal"
        @openModal = "openModal"
      >
        <template v-slot:body>
        <div class="mask">
          <div class="top">
            <div class="logo">
              <img src="../../assets/imgs/transfer1.svg" alt="加载中" width="128px" height="32px" />
            </div>
            <div class="txt">转账·去往{{comment}}</div>
            <div class="close-icon" @click="closeModal(false)">
              <span class="icon--copy4"></span>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <div class="left-top">
                <div class="txt">转账金额  <span class="transfer-money">-${{form.transferMoney}}</span> <span class="coin-addr">USD</span></div>
                <div class="transform-price">≈{{calcPrice}} </div>
                <div class="num-bottom">02.58</div>
              </div>
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
import { fetchBill, fetchContactList } from "../../api/request";
import InfiniteLoad from "../components/InfiniteLoad";
import ModalMask from "../components/ModalMask";
import { mapState, mapGetters } from "vuex";

export default {
  name: "transfer",
  components: {
    mineTop,
    QRCode,
    InfiniteLoad,
    ModalMask
  },
  data() {
    return {
      index: -1,
      isHideMask: true,
      isShowContactModal: false,
      isHideContactMask: true,
      isShowModal: false,
      contactList: [],
      contactName: "", // 收款人姓名
      comment: "", // 备注
      form: {
        incomeAccount: '', // 收款账户
        transferMoney: 0, // 转账金额
        payComment: '', // 付款备注
        transferDate: '', // 转账时间
        email: "",// 收款人邮箱
      },
      formLeft: {
        input1: "",
        input2: "",
        input3: ""
      },
      transId: "", //二维码
      showType: false, //转账支付区域
      showForm: true, //转账表单
      email: "",
      avatar: "",
      contactAvatar: "", // 联系人头像
      infos: [],
      statusKey: 3,
      rows: 10,
      page: 0,
      orderList: [],
      isLoading: true,
      noMore: false
    };
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
          avator: item.avatar,
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
          type: type, // 账单类型
          marks: comment
        };
      });
    },
    calcPrice() {
      const { rate, coinSymbol, coinAbbre } = this;

      return coinSymbol + formatNumberFloor(rate * this.form.transferMoney, 2) + coinAbbre;
    }
  },
  methods: {
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
    // 选择联系人
    getContact(id, account, name, comment, avatar, email) {
      this.index = id;
      this.form.incomeAccount = account;
      this.form.email = email;
      this.contactName = name;
      this.comment = comment;
      this.contactAvatar = avatar;
      this.openContactModal(false);
    },

    // 获取联系人列表
    async getContactList() {
      this.isShowContactModal = true;
      const params = {}

      try {
        const res = await fetchContactList(params);
        
        if(res.code === 0) {
          this.contactList = res.data.map( item => {
            return {
              id: item.id,
              url: item.avatar,
              comment: item.comment,
              name: "*" + item.lastName,
              account: item.phone,
              avatar: item.avatar,
              email: item.email
            }
          });
        } else {  
          this.$Message.error("网络出错，请稍后再试！");
        }
        
      } catch (error) {
        this.$Message.error(error);
      }
      
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
   
    // 查找联系人信息
    getContactInfo() {
      let params = {
        info: this.form.incomeAccount
      };
      this.$getContactInfo(params, res => {
        if (res.code != 0) {
          this.$Message.error(res.msg);
        }
      });
    },
    //个人信息
    getInformation() {
      this.$getInformation("", res => {
        this.email = res.data.email;
        this.avatar = res.data.avatar;
      });
    },
    // 金额明细
    getMoney() {
      if (this.form.transferMoney > this.getAvail) {
        this.form.transferMoney = this.getAvail;
      }
    },
    // 转账
    transfer() {
      let reg = /[^\d.]/g;
      if (this.form.incomeAccount == "") {
        this.$Message.error("收款账户不能为空");
        return;
      } else if (this.form.transferMoney == "") {
        this.$Message.error("转账金额不能为空");
        return;
      } else if (
        this.form.transferMoney &&
        new RegExp(reg).test(this.form.transferMoney)
      ) {
        this.$Message.error("请输入数字");
        return;
      }
      this.form.transferDate = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
      this.showType = true;
      this.showForm = false;
      
    },
    // 支付
    confirmTransfer() {
      this.openModal(true);
      let params = {
        info: this.form.incomeAccount + "",
        money: parseFloat(this.form.transferMoney)
      };
      this.$transfer(params, res => {
        this.transId = res.data.transId;
        const qrcode = document.querySelector("#qrcode");
        QRCode.toCanvas(qrcode, this.transId, {
          width: 243,
          height: 228
        });
      });
    }
  },
  mounted() {
    this.getInformation();
    this.loadMore();
  }
};
</script>
<style scoped lang='scss'>
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
.transfer {
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
      border-bottom: 1px solid #F0F0F0;

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
        margin-top: 26px;
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
        margin-top: 34px;

        .left-top {
          height: 31px;

          .txt {
            margin-right: 7px;
            height: 19px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: rgba(51, 51, 51, 1);
            line-height: 19px;
            text-align: center;
            .transfer-money {
              color: #FF733A;
              font-size: 24px;
              font-weight: bold;
            }
            .coin-addr {
              font-size: 14px;
            }
          }

          .transform-price {
            font-size: 14px;
            color: #7D91A9;
            margin: 16px 0 20px;
            text-align: center;
          }
          .num-bottom {
            text-align: center;
            color: #FF733A;
            font-weight: bold;
            font-size: 17px;
          }
        }
      }

      #qrcode {
        width: 243px;
        height: 228px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(233, 233, 233, 1);
        margin-top: 70px;
      }

      .finish {
        height: 33px;
        margin-top: 25px;
        margin-left: 12px;

        .finish-icon {
          height: 33px;
          width: 33px;
          background-image: url('../../assets/imgs/withdraw2.png');
          float: left;
          margin-right: 14px;
          margin-top: 4px;
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
          background-image: url('../../assets/imgs/withdraw1.png');
          width: 21px;
          height: 22px;
          float: left;
          margin-right: 14px;
        }

        .sweep-txt {
          float: left;
        }
      }

      .right {
        float: left;
        margin-top: 55px;
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
        margin-right: 26px;
        margin-top: 10px;
      }

      .avatar {
        margin-top: 3px;
        float: left;
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background-size: 100%;
        margin-right: 9px;
        margin-top: 9px;
      }

      .account-right {
        float: left;
        font-size: 24px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(255, 115, 58, 1);
        margin-right: 2px;
        margin-top: 11px;
      }
    }

    .order-bottom {
      margin-left: 97px;
      margin-top: 28px;
      height: 48px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(125, 145, 169, 1);

      .order-btop {
        margin-bottom: 16px;

        .left {
          margin-right: 263px;
        }
      }

      .order-bbottom {
        .left {
          display: inline-block;
          width: 330px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .title {
    margin-top: 16px;
    height: 64px;
    background: rgba(245, 246, 250, 1);

    .icon {
      width: 20px;
      height: 15px;
      mask: url('../../assets/imgs/mine10.svg');
      background: #62697F;
      margin: 25px 8px 23px 16px;
      float: left;
    }

    .txt {
      margin: 17px 0;
      float: left;
      width: 38px;
      height: 30px;
      font-size: 18px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(98, 105, 127, 1);
      line-height: 30px;
    }
  }

  .tabs {
    height: 64px;
    background: rgba(245, 246, 250, 1);
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: rgba(102, 102, 102, 1);
    padding-left: 16px;
    line-height: 64px;
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

        &>div {
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
    border-top: 1px solid #F6F6F6;

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

  .form {
    margin-top: 24px;
    margin-left: 15px;
    height: 350px;

    .form-first {
      margin-top: 40px;
      height: 36px;

      .contact-list {
        position: relative;
        display: inline-block;
        cursor: pointer;
      }
      .calc-price {
        margin-left: 137px;
      }


      .left {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
        margin-right: 80px;
      }

      .contact {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(54, 116, 215, 1);
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
      margin-left: 140px;
    }
  }
}
</style>