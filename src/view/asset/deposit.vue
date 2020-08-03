<template>
  <!-- 充值 -->
  <div class="recharge">
    <mineTop></mineTop>
    <div class="title">
      <div class="icon"></div>
      <div class="txt">充值</div>
    </div>
    <!-- 充值方式 -->
    <div class="methods">
      <div class="methods-top">
        <div class="methods-top-left">充值方式</div>
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
      <div class="divide" v-if="show"></div>
      <div class="methods-bottom-top" v-if="show">
        <div class="icon"></div>
        <div class="txt"></div>
      </div>
      <div class="methods-bottom-b" v-if="show">
        <div class="icon"></div>
        <div class="txt">地址为限时动态地址，请在有效时间内完成充值</div>
      </div>
      <!-- 提示 -->
      <div class="tip" v-if="showTip">
        <span class="icon--1-2">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </span>
        <span class="tip-txt">您的 USDT 将会自动兑换成美金充到您的账户里</span>
      </div>
      <div class="address" v-if="showTip">
        <div class="txt">充值地址</div>
        <div class="rate">
          <div class="rate-center">{{txt}}</div>
          <div class="rate-left">(1 {{coinName}} = {{usd}} USD)</div>
          <div class="rate-right">汇率零损失</div>
        </div>
      </div>
      <!-- 充值二维码 -->
      <div class="depositQrcode" v-if="showTip">
        <div class="delayed" @click="delayTime()">
          <span class="icon--2-copy-6" :style='rotate'></span>
          <span>延时</span>
        </div>
        <div class="txt">地址有效时间倒计时</div>
        <div class="time">{{hour}}:{{min}}:{{second}}</div>
        <canvas id="qrcode"></canvas>
        <div class="input">
          <span class="num" >{{address}}</span>
          <div class="copy copy_address" 
            @click="copyAddress"
            data-clipboard-action="copy" 
            :data-clipboard-text="address"
          ></div>
        </div>
      </div>
    </div>
    <div class="tabs" v-if="show">充值账单</div>
    <div  v-if="show">
      <InfiniteLoad :orderList="formatAccountList"
        :isLoading="isLoading"
        :noMore="noMore"
        @loadMore="loadMore"
        @enterDetail="enterDetail"
      ></InfiniteLoad>
    </div>
    <!-- <table class="asset" v-if="show">
      <tr class="header">
        <th>
          <div class="first">类别</div>
        </th>
        <th>
          <div class="sec">订单时间</div>
        </th>
        <th>
          <div class="third">名称 | 账号 | 订单号</div>
        </th>
        <th>
          <div class="forth">金额 | 明细</div>
        </th>
        <th>
          <div class="fifth">状态</div>
        </th>
        <th>
          <div class="six">备注</div>
        </th>
        <th>
          <div class="seven">操作</div>
        </th>
      </tr>
      <tr class="row" v-for="(info,index) in infos" :key="index">
        <td>
          <div class="avatar">
            <img :src="info.avatar" alt="网络问题" />
          </div>
        </td>
        <td>
          <div class="time">{{info.createAt}}</div>
        </td>
        <td>
          <div class="sec">
            <div class="time-top">{{info.info}}</div>
            <div class="time-bottom">订单号：{{info.orderId}}</div>
          </div>
        </td>
        <td>
          <div class="third">{{info.money}}</div>
        </td>
        <td>
          <div class="forth">充值成功</div>
        </td>
        <td>
          <div class="fifth">充值</div>
        </td>
        <td>
          <div class="six">详情</div>
        </td>
      </tr>
    </table> -->
    <!-- 弹出框 -->
    <div class="popup" v-if="know">
      <div class="divide-left"></div>
      <div class="divide-right"></div>
      <div class="top">
        <div class="txt">请确认充值类型</div>
        <div class="icon">
          <div class="icon-left">
            <img :src="icon" width="40px" height="40px" />
          </div>
          <div class="icon-center"></div>
          <div class="icon-right">
            <img src="../../assets/imgs/cashOut1.svg" alt width="40px" height="40px" />
          </div>
        </div>
        <div class="icon-name">
          <span class="name-left">{{name}}</span>
          <span class="name-right">USD</span>
        </div>
      </div>
      <div class="bottom-aa">仅支持{{name}}地址，地址为限时动态地址，请在有效时间内完成充值</div>
      <div class="button" @click="iKnow">我已知晓</div>
    </div>
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
import { fetchBill } from "../../api/request";
import InfiniteLoad from "../components/InfiniteLoad";
import { mapState } from "vuex";

export default {
  data() {
    return {
      coins: [], //币种
      off: true,
      coinName: "",
      address: "",
      know: false,
      show: true,
      showTip: false, //黄色提示框
      txt: "", //弹出框的文字变化
      usd: 0,
      icon: "",
      isActive: 10,
      infos: [],
      curEndTime: "",
      hour: "00",
      min: "00",
      second: "00",
      statusKey: 1,
      rows: 10,
      page: 0,
      orderList: [],
      isLoading: true,
      noMore: false,
      isRotate: false,
      rotate: {
        transitionDuration: "0",
        transform:"rotate(0)",
      }
    };
  },
  components: {
    mineTop,
    QRCode,
    InfiniteLoad
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre"]),
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
        let statusStr = item.status === 1 ? "成功":"失败";
        let sex = item.sex === 1 ? "先生":"女士";
        let coin = item.type === 3 ? "USD": item.coin;

        orderId = orderStart + "......" + orderEnd;

        if (item.type == 1) {
          type = "充值";
        } else if (item.type === 2) {
          type = "提现";
        } else if (item.type === 3) {
          type = "转账 ";
        } else if(item.type === 6) {
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
          name: item.coin,
          account: "USDT-ERC20",
          orderId: item.orderId,
          ellipsisOrderId: orderId,
          usdt: item.money + coin, // 数字货币
          usd: usd, // 转换后对应的货币
          showPrecision: item.showPrecision, // 保留的小数位数
          state: statusStr, // 账单状态
          type: "充值", // 账单类型
          marks: comment
        };
      });
    }
  },
  mounted() {
    this.getCoin();
    // this.getDeposit();
    this.loadMore();
  },
  methods: {
    // 详情
    enterDetail(id) {
      this.$router.push(`/console/asset/deposit/${id}`);
    },
    copyAddress() {
      let self = this;
      // 防止重复出现多次弹框
      if(clipboard) {
          clipboard.destroy();
      }
      let clipboard = new this.clipboard(".copy_address");

      clipboard.on('success', function () {
          self.$Message.success("复制成功！");
          if(clipboard) {
              clipboard.destroy();
          }
      })

      clipboard.on('error', function () {
          self.$Message.error("复制失败！");
      })
    },
    loadMore() {
      if (!this.isLoading) return;
      if (this.noMore) return;

      this.page = this.page + 1;

      this.fetchDate();
    },

    // getDeposit() {
    //   this.$getBill({ type: 1 }, res => {
    //     this.infos = res.data.infos;
    //     console.log(this.infos);
    //   });
    // },
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
    // 倒计时
    countDowntTime() {
      // 获取当前时间
      let date = new Date();
      let now = date.getTime();
      // 设置截止时间
      let endDate = new Date(this.curEndTime);
      let end = endDate.getTime();
      // 时间差
      let leftTime = end - now;
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // 时
        let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        this.hour = h < 10 ? "0" + h : h;
        // 分
        let m = Math.floor((leftTime / 1000 / 60) % 60);
        this.min = m < 10 ? "0" + m : m;
        // 秒
        let s = Math.floor((leftTime / 1000) % 60);
        this.second = s < 10 ? "0" + s : s;
      } else {
        this.hour = "00";
        this.min = "00";
        this.second = "00";
      }
      if (
        Number(this.hour) === 0 &&
        Number(this.day) === 0 &&
        Number(this.min) === 0 &&
        Number(this.second) === 0
      ) {
        return;
      } else {
        setTimeout(this.countDowntTime, 1000);
      }
    },
    delayTime() {
      this.getEndTime();
      this.countDowntTime();
      this.rotate = {
        transitionDuration: "0.3s",
        transform:"rotate(360deg)",
      }

      setTimeout(() => {
         this.rotate = {
          transitionDuration: "0s",
          transform:"rotate(0deg)",
        }
      }, 1000)
    },
    changeStatus(index) {
      if (index == 0) {
        this.$getBill({ type: 1 }, res => {
          this.infos = res.data.infos;
        });
        console.log(infosods);
      } else if (index == 1) {
        this.$getBill({ type: 1, status: 3 }, res => {
          this.infos = res.data.infos;
        });
        console.log(this.infos);
      } else if (index == 2) {
        this.$getBill({ type: 1, status: 4 }, res => {
          this.infos = res.data.infos;
        });
        console.log(index);
      } else {
        this.$getBill({ type: 1, status: 5 }, res => {
          this.infos = res.data.infos;
        });
      }
    },
    iKnow() {
      this.showTip = true;
      this.know = false;
    },
    // 获取虚拟币币种
    getCoin() {
      this.$getCoin({ type: 1 }, res => {
        this.coins = res.data;
      });
    },
    showQrcode(coinName) {
      this.$getAddress({ coin: coinName }, res => {
        this.address = res.data.address;
        let qrcode = document.querySelector("#qrcode");
        QRCode.toCanvas(qrcode, this.address, {
          width: 185,
          height: 185
        });
      });
    },
    getEndTime() {
      this.curEndTime = new Date();
      var ts = this.curEndTime.getTime();
      this.curEndTime.setTime(ts + 1000 * 60 * 60 * 3);
      console.log(this.curEndTime);
    },
    //点击选择充值方式
    changeCoin(key) {
      this.isActive = key;
      this.showQrcode(this.coins[key].name);
      this.know = true;
      this.show = false;
      this.showTip = true;
      this.txt = this.coins[key].name;
      this.name = this.coins[key].name;
      this.coinName = this.coins[key].name;
      this.icon = this.coins[key].icon;
      this.getEndTime();
      this.countDowntTime();
      let coinName = "";
      if (this.coinName.indexOf("USDT") >= 0) {
        coinName = "usdt";
        this.coinName = "USDT";
      } else {
        coinName = this.coinName.toLowerCase();
      }
      this.$getUsd({ coin: coinName }, res => {
        this.usd = res.data.usd;
      });
    }
  }
};
</script>
<style lang='stylus' scoped>
.recharge {
  padding-left: 308px;
  height: 100%;
  padding-top: 88px;
  min-width: 1200px;
  position: relative;

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

    .divide-left, .divide-right {
      width: 61px;
      height: 1px;
      opacity: 0.2;
      position: absolute;
      top: 46px;
    }

    .divide-left {
      left: 82px;
      background: linear-gradient(270deg, rgba(0, 0, 0, 1) 0%, rgba(216, 216, 216, 0) 100%);
    }

    .divide-right {
      right: 82px;
      background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(216, 216, 216, 0) 100%);
    }

    .top {
      height: 156px;
      background: rgba(246, 248, 255, 1);
      padding-top: 39px;

      .txt {
        width: 110px;
        height: 16px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 1);
        line-height: 16px;
        margin: 0 153px;
      }

      .icon {
        margin: 20px 123px 0 123px;
        height: 40px;
        font-size: 12px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);

        .icon-left, .icon-center, .icon-right {
          float: left;
        }

        .icon-center {
          background: url('../../assets/imgs/cashOut2.svg');
          width: 18px;
          height: 6px;
          margin: 15px 20px 19px 28px;
        }
      }

      .icon-name {
        height: 16px;
        font-size: 12px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 16px;
        position: relative;
        margin-top: 2px;

        .name-left {
          position: absolute;
          top: 0;
          left: 108px;
        }

        .name-right {
          position: absolute;
          top: 0;
          right: 151px;
        }
      }
    }

    .bottom-aa {
      width: 344px;
      height: 62px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(0, 0, 0, 0.65);
      margin: 28px 31px 11px 41px;
    }

    .button {
      width: 140px;
      height: 32px;
      background: rgba(54, 116, 215, 1);
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      border-radius: 4px;
      margin: 31px 138px 0 138px;
      line-height: 32px;
      cursor: pointer;
    }
  }

  .title {
    margin-top: 16px;
    height: 64px;
    background: rgba(245, 246, 250, 1);

    .icon {
      width: 24px;
      height: 18px;
      mask: url('../../assets/imgs/mine8.svg') no-repeat;
      margin: 25px 0px 23px 16px;
      float: left;
      background: rgba(98, 105, 127, 1);
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

  .methods {
    height: 243px;

    .methods-top {
      margin-top: 27px;
      height: 32px;

      .methods-top-left {
        width: 59px;
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
            background: url('../../assets/imgs/deposit1.png');
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
        background-image: url('../../assets/imgs/recharge7.png');
        background-repeat: no-repeat;
        float: left;
      }
    }

    .methods-bottom-b {
      height: 14px;
      margin-left: 195px;
      margin-top: 14px;

      .icon {
        margin: 7px 7px 5px 0;
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

    .tip {
      width: 313px;
      height: 32px;
      background: rgba(254, 252, 235, 1);
      line-height: 32px;
      text-align: center;
      margin-left: 156px;
      margin-top: 15px;

      .tip-txt {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(104, 114, 146, 1);
      }
    }

    .address {
      margin-left: 16px;
      margin-top: 40px;
      height: 17px;

      .txt {
        float: left;
        margin-right: 81px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
      }

      .rate {
        float: left;
        height: 14px;

        .rate-center {
          float: left;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(51, 51, 51, 1);
          margin-right: 6px;
        }

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

    .depositQrcode {
      width: 534px;
      height: 398px;
      background: rgba(249, 249, 249, 1);
      border: 1px dashed rgba(204, 204, 204, 1);
      margin-left: 160px;
      margin-top: 32px;

      .delayed {
        width: 64px;
        height: 33px;
        line-height: 33px;
        background: rgba(240, 244, 255, 1);
        border-radius: 0px 0px 0px 12px;
        margin-left: 470px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: rgba(54, 116, 215, 1);
        cursor: pointer;

        .icon--2-copy-6 {
          display: inline-block;
          margin-left: 6px;
          margin-right: 4px;
          transform: rotate(0deg);
          transition: all .3s ease-in-out;
        }
        .rotate {
          transform: rotate(360deg);
        }
      }

      .txt {
        height: 17px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        line-height: 14px;
        margin: 10px 0 10px 194px;
      }

      .time {
        width: 90px;
        height: 17px;
        font-size: 18px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(255, 115, 58, 1);
        line-height: 14px;
        margin: 0 222px;
      }

      #qrcode {
        margin: 6px 179px 40px 179px;
      }

      .input {
        width: 458px;
        height: 57px;
        background: rgba(248, 250, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(152, 191, 255, 1);
        margin-left: 37px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        line-height: 57px;

        .copy {
          display: inline-block;
          mask-image: url('../../assets/imgs/deposit2.svg');
          width: 18px;
          height: 18px;
          back-color: #3674D7;
          mask-position: 100%;
          mask-repeat: no-repeat;
          background: #3674D7;
          margin-left: 30px;
          vertical-align: middle;
          cursor:pointer;
          opacity: 0.5;
          transition: all .2s ease-out;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }

  .tabs {
    height: 64px;
    background: rgba(245, 246, 250, 1);
    padding-left: 16px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    line-height: 64px;
    color: rgba(102, 102, 102, 1);
  }

  .asset {
    margin-left: 40px;
  }

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

  .row {
    height: 81px;
    border-top: 1px solid #F6F6F6;

    td {
      .avatar {
        margin-right: 50px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
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
              
                




                
            
                            
               
          
                        
        
</style>