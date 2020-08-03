<template>
  <ModalMask
    :isShowModal="isShowDepositModal"
    :isHideMask="isHideDepositMask"
    @closeModal="closeDepositModal"
    @openModal="openDepositModal"
  >
    <template v-slot:body>
      <div class="deposit-widget">
        <div class="deposit-header">
          <div class="line left-line"></div>
          <div class="title">{{title}}类型</div>
          <div class="line right-line"></div>
        </div>
        <div class="deposit-body">
          <div class="direction">
            <div class="from">
              <img :src="fromIcon" alt class="coin-avatar" />
            </div>
            <img :src="arrow" alt class="icon move" />
            <div class="to">
              <img :src="toIcon" alt class="coin-avatar" />
            </div>
          </div>
          <div class="direction" :style="{padding: 0}">
            <div class="from" :style="{flex: '1', textAlign: 'center'}">
              <div class="text">{{fromText}}</div>
            </div>
            <div class="to" :style="{flex: '1', textAlign: 'center'}">
              <div class="text">{{toText}}</div>
            </div>
          </div>
          <slot name="desc">
            <div class="tips">您的 USDT-ERC20 将会自动兑换成 USDT 充值到您的账户里</div>
          </slot>
        </div>
        <div class="deposit-footer">
          <div class="cancel" v-if="isShowCancel" @click="back(false)">返回查看</div>
          <div class="confirm" @click="know(false)">我已知晓</div>
        </div>
      </div>
    </template>
  </ModalMask>
</template>

<script>
import ModalMask from "./ModalMask";
export default {
  name: "DepositModal",
  components: { ModalMask },
  data() {
    return {
      arrow: require("../../assets/account/direction_20200724.png")
    };
  },
  props: {
    isShowCancel: Boolean,
    isShowDepositModal: Boolean,
    isHideDepositMask: Boolean,
    fromIcon: String,
    toIcon: String,
    fromText: String,
    toText: String,
    title: String
  },
  methods: {
    closeDepositModal() {
      this.$emit("closeDepositModal");
    },
    openDepositModal(a) {
      this.$emit("openDepositModal", a);
    },
    back() {
      this.$emit("back");
    },
    know() {
      this.$emit("konw");
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin button {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
@mixin avatar {
  width: 40px;
  height: 40px;
}
@mixin text {
  margin-top: 5px;
  font-size: 12px;
  color: #000;
}
@keyframes move {
  0% {
    transform: translateX(-5px);
    opacity: 0;
  }
  100% {
    transform: translateX(5px);
    opacity: 1;
  }
}
.deposit-widget {
  width: 416px;
  padding: 40px 54px;
  .deposit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    .line {
      width: 80px;
      height: 1px;
      opacity: 0.2;
    }
    .left-line {
      background: linear-gradient(
        270deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(216, 216, 216, 0) 100%
      );
    }
    .right-line {
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 1) 0%,
        rgba(216, 216, 216, 0) 100%
      );
    }
    .title {
      font-size: 16px;
      color: #333;
    }
  }
  .deposit-body {
    .direction {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .from {
        text-align: center;
        .coin-avatar {
          @include avatar;
        }
        .text {
          @include text;
        }
      }
      .icon {
        width: 14px;
        height: 15px;
        animation: move 2s ease infinite;
      }
      .to {
        text-align: center;
        .coin-avatar {
          @include avatar;
        }
        .text {
          @include text;
        }
      }
    }
    .tips {
      color: #333;
      font-size: 14px;
      margin-top: 50px;
    }
  }
  .deposit-footer {
    display: flex;
    justify-content: space-evenly;
    margin-top: 64px;
    .cancel {
      @include button;
      border: 1px solid #d9d9d9;
      color: #999;
    }
    .confirm {
      @include button;
      border: 1px solid #3674d7;
      color: #fff;
      background: #3674d7;
    }
  }
}
</style>