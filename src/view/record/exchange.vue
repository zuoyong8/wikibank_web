<template>
  <div class="exchange">
    <Exchange></Exchange>
    <div class="exchange-list">
      <div class="title">兑换</div>
      <div class="type-list">
        <div class="type-title">类型</div>
        <div
          class="type-item"
          v-for="(item, key) in coinList"
          :key="key"
          @click="selectCoin(item.id)"
        >
          <img :src="item.avatar" alt class="coin-avatar" />
          <span class="name">{{item.name}}</span>
        </div>
      </div>
      <div class="tips">
        <div>温馨提示</div>
        <div>• 请选择您的充值方式。</div>
        <div>• 充值地址为限时动态地址，请在有效时间内完成充值。</div>
        <div>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</div>
      </div>
    </div>
    <ModalMask
      :isShowModal="isShowExchangeModal"
      :isHideMask="isHideExchangeMask"
      @closeModal="closeExchangeModal"
      @openModal="openExchangeModal"
    >
      <template v-slot:body>
        <div class="modal-content">
          <div class="modal-title">
            兑换
            <span class="icon--copy4 close-btn" @click="closeExchangeModal(false)"></span>
          </div>
          <div class="modal-label">从</div>
          <div class="from-coin">
            <SelectDown :isShow="isShowFromSelect" :list="moneyList" @selectList="checkFromCoin">
              <template v-slot:title>
                <div class="coin-title" @click="checkFromCoin">
                  <div>
                    <img :src="fromCoinAvatar" alt class="coin-avatar" />
                    <input
                      type="text"
                      v-model="totalNumber"
                      placeholder="0.0000"
                      class="enter-input"
                    />
                  </div>
                  <img :src="bottomArrow" alt class="arrow" />
                </div>
              </template>
            </SelectDown>
          </div>
          <div class="transform-coin">(3,0766.0000 USDT)</div>
          <div class="modal-label">转至</div>
          <div class="to-coin">
            <SelectDown :isShow="isShowSelect" :list="moneyList" @selectList="checkCoin">
              <template v-slot:title>
                <div class="coin-title" @click="checkCoin">
                  <div>
                    <img :src="coinAvatar" alt class="coin-avatar" />
                    <input
                      type="text"
                      v-model="totalNumber"
                      placeholder="0.0000"
                      class="enter-input"
                    />
                  </div>
                  <img :src="bottomArrow" alt class="arrow" />
                </div>
              </template>
            </SelectDown>
          </div>
          <div class="transform-coin">(3,0766.0000 USD)</div>
          <div class="modal-label">数量</div>
          <div class="number-coin">
            <div>
              <img :src="coinAvatar" alt class="coin-avatar" />
              <input type="text" v-model="totalNumber" placeholder="0.0000" class="enter-input" />
            </div>
            <div>
              <span class="usdt">USDT</span>
              <span class="split"></span>
              <span class="all">全部</span>
            </div>
          </div>
          <div class="total-coin">
            <div class="all-usd">≈0.00 USD</div>
            <div class="exchange-rules">(1 USDT = 0.9876 USD)</div>
          </div>
          <div class="modal-confirm">确定</div>
        </div>
      </template>
    </ModalMask>
  </div>
</template>

<script>
import Exchange from "../components/Assets";
import ModalMask from "../components/ModalMask";
import SelectDown from "../components/SelectDown";
export default {
  name: "",
  components: {
    Exchange,
    ModalMask,
    SelectDown
  },
  data() {
    return {
      bottomArrow: require("../../assets/person/bottom_icon_20200628.png"),
      isShowSelect: false,
      isShowFromSelect: false,
      coinAvatar: require("../../assets/person/usdt_icon_20200624.png"),
      fromCoinAvatar: require("../../assets/person/usdt_icon_20200624.png"),
      totalNumber: "",
      isShowExchangeModal: false,
      isHideExchangeMask: false,
      moneyList: [
        {
          id: 0,
          avatar: require("../../assets/person/usdt_icon_20200624.png"),
          name: "USDT",
          count: "123.0000",
          type: "USDT"
        },
        {
          id: 1,
          avatar: require("../../assets/person/btc_icon_20200624.png"),
          name: "BTC",
          count: "123.0000",
          type: "USD"
        },
        {
          id: 2,
          avatar: require("../../assets/person/eth_icon_20200624.png"),
          name: "ETH",
          count: "123.0000",
          type: "ETH"
        },
        {
          id: 3,
          avatar: require("../../assets/person/usd_20200628.png"),
          name: "USD",
          count: "123.0000",
          type: "USD"
        }
      ],
      coinList: [
        {
          id: 0,
          avatar: require("../../assets/person/usd_20200628.png"),
          name: "USD"
        },
        {
          id: 2,
          avatar: require("../../assets/person/usdt_icon_20200624.png"),
          name: "USDT"
        },
        {
          id: 3,
          avatar: require("../../assets/person/btc_icon_20200624.png"),
          name: "BTC"
        },
        {
          id: 4,
          avatar: require("../../assets/person/eth_icon_20200624.png"),
          name: "ETH"
        }
      ]
    };
  },
  methods: {
    checkCoin(item) {
      this.coinAvatar = item.avatar;
      if (this.isShowSelect) {
        this.isShowSelect = false;
      } else {
        this.isShowSelect = true;
      }
    },
    checkFromCoin(item) {
      this.fromCoinAvatar = item.avatar;
      if (this.isShowFromSelect) {
        this.isShowFromSelect = false;
      } else {
        this.isShowFromSelect = true;
      }
    },
    selectCoin(id) {
      this.openExchangeModal(true);
    },
    openExchangeModal(show) {
      this.isShowExchangeModal = show;
    },
    closeExchangeModal(show) {
      this.isShowExchangeModal = show;
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin con-list {
  .coin-avatar {
    width: 20px;
    height: 20px;
    border-radius: 2px;
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
.exchange {
  padding-left: 268px;
  height: 100%;
  padding-top: 90px;
  min-width: 1200px;
  .exchange-list {
    margin: 25px 30px;
    border: 1px solid #f0f0f0;
    .title {
      padding: 15px 64px;
      color: #62697f;
      font-size: 18px;
      background: #f5f6fa;
      font-weight: bold;
    }
    .type-list {
      display: flex;
      align-items: center;
      margin-top: 48px;
      .type-title {
        color: #666;
        font-size: 14px;
        margin-left: 64px;
        margin-right: 103px;
      }
      .type-item {
        background: #f9f7fd;
        padding: 8px 12px;
        color: #333;
        font-size: 20px;
        border-radius: 2px;
        font-weight: bold;
        margin-right: 80px;
        cursor: pointer;
        .coin-avatar {
          width: 40px;
          height: 40px;
          vertical-align: middle;
          margin-right: 8px;
          border-radius: 2px;
        }
        .name {
          vertical-align: middle;
          font-weight: bold;
        }
      }
    }
    .tips {
      color: #999;
      font-size: 12px;
      line-height: 20px;
      margin: 50px 0 65px 195px;
    }
  }

  .modal-content {
    width: 480px;
    padding: 23px 26px 32px;
    .modal-title {
      display: flex;
      justify-content: space-between;
      font-weight: 400;
      color: #333;
      font-size: 20px;
    }
    .close-btn {
      cursor: pointer;
    }
    .modal-label {
      margin-top: 32px;
      font-size: 12px;
      color: #666;
    }
    .from-coin,.to-coin {
      
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
      @include con-list;
    }
    .transform-coin {
      text-align: right;
      color: #acb5c2;
      font-size: 12px;
    }
    .number-coin {
      border: 1px solid #dfe2e7;
      padding: 8px 12px;
      margin: 7px 0 4px;
      display: flex;
      justify-content: space-between;
      border-radius: 4px;
      @include con-list;
    }
    .total-coin {
      display: flex;
      justify-content: space-between;
      .all-usd {
        font-size: 13px;
        color: #666;
      }
      .exchange-rules {
        color: #4eb091;
        font-size: 14px;
      }
    }

    .modal-confirm {
      margin-top: 32px;
      width: 100%;
      padding: 15px 0;
      border-radius: 4px;
      background: #3674d7;
      color: #fff;
      font-size: 17px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>