<template>
  <div class="top">
    <div class="top-left">
      <div class="top-top">
        <div class="icon"></div>
        <div class="txt">账户资产</div>
      </div>
      <div class="top-bottom">
        <div class="left">
          <div class="top">${{formatNumberCeil(getAvail,2)}}</div>
          <div class="bottom">≈{{coinSymbol}} {{formatNumberCeil(calc, 2)}} {{coinAbbre}}</div>
        </div>
        <div class="top-bottom-right">USD</div>
      </div>
    </div>
    <div class="top-right">
      <div class="recharge" @click="$router.push('/console/asset/deposit')">
        <div class="icon-deposit"></div>
        <div class="txt">充值</div>
      </div>
      <div class="cash-out" @click="$router.push('/console/asset/transfer')">
        <div class="icon-transfer"></div>
        <div class="txt">转账</div>
      </div>
      <div class="transfer" @click="$router.push('/console/asset/withdraw')">
        <div class="icon-withdraw"></div>
        <div class="txt">提现</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import formatNumberCeil from "../../filters";

export default {
  name: "mineTop",
  data() {
    return {};
  },
  computed: {
    ...mapState(["rate", "coinSymbol", "coinAbbre"]),
    ...mapGetters(["getRate", "getAvail"]),

    calc() {
      return this.getAvail * this.getRate;
    },
  },
  methods: {
  }
};
</script>
<style scoped lang='stylus'>
.top {
  height: 170px;
  background: rgba(245, 246, 250, 1);

  .top-left {
    float: left;

    .top-top {
      height: 18px;
      margin: 30px 0 29px 16px;

      .icon {
        float: left;
        width: 15px;
        height: 15px;
        mask: url('../../assets/imgs/user3.svg');
        background-color: rgba(98, 105, 127, 1);
        margin-right: 8px;
      }

      .txt {
        float: left;
        width: 60px;
        height: 18px;
        font-size: 14px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(98, 105, 127, 1);
        line-height: 16px;
      }
    }

    .top-bottom {
      margin-left: 16px;
      float: left;
      color: rgba(28, 47, 98, 1);

      .left {
        float: left;

        .top {
          height: 37px;
          font-size: 34px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          line-height: 35px;
          margin-bottom: 13px;
        }

        .bottom {
          font-size: 16px;
          font-family: MicrosoftYaHei;
        }
      }

      .top-bottom-right {
        float: left;
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        margin-top: 15px;
      }
    }
  }

  .top-right {
    float: right;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: rgba(54, 116, 215, 1);
    height: 38px;
    margin-top: 66px;

    .recharge, .transfer, .cash-out {
      cursor: pointer;
      width: 94px;
      height: 38px;
      margin-right: 23px;
      border-radius: 4px;
      float: left;
      border: 1px solid rgba(54, 116, 215, 0.5);

      &:hover {
        background: rgba(54, 116, 215, 1);
        box-shadow: 0px 2px 12px 0px rgba(54, 116, 215, 0.5);
        color: white;

        .icon-deposit, .icon-withdraw, .icon-transfer {
          background-color: white;
        }
      }

      .txt {
        float: left;
        margin-top: 7px;
        margin-left: 10px;
      }

      .icon-deposit, .icon-withdraw, .icon-transfer {
        margin-top: 11px;
        margin-left: 14px;
        width: 21px;
        height: 16px;
        background-color: #3674D7;
        float: left;
        mask-repeat: no-repeat;
      }

      .icon-deposit {
        mask-image: url('../../assets/imgs/mine8.svg');
      }

      .icon-withdraw {
        mask-image: url('../../assets/imgs/mine9.svg');
      }

      .icon-transfer {
        mask-image: url('../../assets/imgs/mine10.svg');
      }
    }
  }
}
</style>