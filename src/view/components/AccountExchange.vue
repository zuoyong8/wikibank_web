<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">{{$t('home.exchange')}}</span>
    </div>
    <div class="content">
      <div v-if="stepNum === 1">
        <div class="row">
          <div class="key">{{$t('account.from')}}</div>
          <div class="val">
            <div class="from">
              <input
                type="text"
                class="enter-input disabled"
                :value="formCoin + ' ' + $t('home.account')" 
                :placeholder="$t('login.accountPlace')"
                :style="{paddingLeft: '42px'}"
              />
              <img :src="fromCoinAvatar" alt="" class="from-img">
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="input-tips">{{$t('home.availAsset')}} {{getAvail}} {{formCoin}}</div>
          </div>
        </div>
        <div class="row">
          <div class="key">{{$t('account.to')}}</div>
          <div class="val">
            <div class="select-type disabled">
              <SelectDown :isShow="isShowFromSelect" :list="moneyList" @selectList="checkFromCoin">
                <template v-slot:title>
                  <div class="coin-title" @click="selectFromCoin">
                    <div>
                      <img :src="toCoinAvatar" alt class="coin-avatar" />
                      <input type="text" :value="$t('leftMenu.usdAccount')" placeholder="0.0000" class="coin-input" />
                    </div>
                    <!-- <img :src="bottomArrow" alt class="arrow" /> -->
                  </div>
                </template>
              </SelectDown>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '24px'}">
          <div class="key">{{$t('account.amount')}}</div>
          <div class="val">
            <div>
              <div class="transfer-box">
                <img :src="fromCoinAvatar" alt="" class="from-img">
                <input
                  type="text"
                  class="enter-input"
                  v-model="mediumNumber"
                  placeholder="0.00"
                  @change="getMoney"
                  :style="{paddingLeft: '42px'}"
                />
                <div class="all-money">
                  {{formCoin}}
                  <span class="split"></span>
                  <span class="total" @click="transferAll">{{$t('home.all')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="tips-box">
              <div class="input-tips">${{calcCoin}} ({{toCoin}})</div>
              <div class="coin-rate">1 {{formCoin}} = ${{price}} ({{toCoin}})</div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="confirm" @click="next">{{$t('account.confirm')}}</div>
          </div>
        </div>
      </div>

      <div v-if="stepNum === 2">
        <div class="row">
          <div class="key">{{$t('account.payPwd')}}</div>
          <div class="val">
            <div>
              <input maxlength="6" type="password" class="enter-input" v-model="password" :placeholder="$t('customError.payPwd')" />
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="confirm" @click="exchange">{{$t('account.confirm')}}</div>
          </div>
        </div>
      </div>
      <div class="tips">
        <p>{{$t("warmPrompt.warmTips")}}</p>
        <p>• {{$t("warmPrompt.supportExchange")}}</p>
        <p>• {{$t("warmPrompt.enterAccount")}}</p>
        <p>• {{$t("warmPrompt.confirmSafe")}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../api/request";
import { saveDecimal, isNumber } from "../../filters.js";
import { mapState, mapGetters, mapActions } from "vuex";
import SelectDown from "../components/SelectDown";
export default {
  name: "account_exchange",
  components: {
    SelectDown
  },
  data() {
    return {
      decimal: 0, // 保留的小数位数
      mediumNumber: this.number,
      password: this.payPassword,
      isShowFromSelect: false,
      toCoinAvatar: require("../../assets/login/usd_icon_20200821.png"),
      bottomArrow: require("../../assets/person/bottom_icon_20200628.png"),
      depositIcon: require("../../assets/account/exchange_icon_20200731.png")
    };
  },
  props: {
    fromCoinAvatar: String,
    formCoin: String,
    toCoin: String,
    number: String,
    price: String,
    stepNum: Number,
    payPassword: String, // 支付密码
    moneyList: Array,
    isDisabled: Boolean // 是否禁止选择
  },
  watch: {
    mediumNumber(val) {
      this.$emit("input", val)
    },
    paddword(val) {
      this.$emit("enterPassword", val);
    }
  },
  computed: {
    ...mapState(["rate"]),
    ...mapGetters(["getWallet", "getAccountList"]),
    calcCoin() {
      return saveDecimal(+this.mediumNumber * this.price, this.decimal);
    },
    getAvail() {
      const { formCoin } = this;
      
      if(formCoin === "USDT") {
        return this.getWallet.usdtAvail;
      } else if(formCoin === "BTC") {
        return this.getWallet.btcAvail;
      } else if(formCoin === "ETH") {
        return this.getWallet.ethAvail;
      } else {
        return 0;
      }
    }
  },
  mounted() {
    this.getPrice();
  },
  methods: {
    ...mapActions(['fetchWallet']),
    getMoney() {
      let money = isNumber(this.mediumNumber) ? +this.mediumNumber: 0;

      if (!isNumber(money)) {
        return (this.mediumNumber = "");
      }

      const { formCoin } = this;

      if(formCoin === "USDT") {
        if(money > this.getWallet.usdtAvail) {
          this.mediumNumber = ""+this.getWallet.usdtAvail;
        } else {
          this.mediumNumber = saveDecimal(money, 2);
        }
      } else if(formCoin === "BTC") {
        if(money > this.getWallet.btcAvail) {
          this.mediumNumber = ""+this.getWallet.btcAvail;
        } else {
          this.mediumNumber = saveDecimal(money, 8);
        }
      } else if(formCoin === "ETH") {
        if(money > this.getWallet.ethAvail) {
          this.mediumNumber = ""+this.getWallet.ethAvail;
        } else {
          this.mediumNumber = saveDecimal(money, 5);
        }
      }
    },
    // 显示/隐藏 弹框
    selectFromCoin() {
      if (this.isDisabled) return;
      if (this.isShowFromSelect) {
        this.isShowFromSelect = false;
      } else {
        this.isShowFromSelect = true;
      }
    },
    // 选择 coin
    async checkFromCoin(item) {
      if (this.isDisabled) return;
      if (this.isShowFromSelect) {
        this.isShowFromSelect = false;
      } else {
        this.isShowFromSelect = true;
      }
      this.$emit("checkFromCoin", item);
      this.getPrice();
    },
    async getPrice() {
      const params = {
        coin: this.formCoin,
        type: 1,
        side: "sell"
      };
      if (this.toCoin === "ETH") {
        this.decimal = 5;
      } else if (this.toCoin === "BTC") {
        this.decimal = 8;
      } else if (this.toCoin === "USDT") {
        this.decimal = 4;
      } else { // USD
          this.decimal = 2;
      }

      const res = await axios.convertPrice(params);

      if (res.code === 0) {
        const { usd } = res.data;
        this.$emit("getPrice", usd, 4);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 转账所有
    transferAll() {
      const { formCoin } = this;

      if(formCoin === "USDT") {
        this.mediumNumber = this.getWallet.usdtAvail;
      } else if(formCoin === "BTC") {
        this.mediumNumber = this.getWallet.btcAvail;
      } else if(formCoin === "ETH") {
        this.mediumNumber = this.getWallet.ethAvail;
      } else {
        this.mediumNumber = 0;
      }
    },
    
    next() {
      if (!+this.mediumNumber.trim()) return this.$Message.error(this.$t('customError.amountTips'));
      this.$emit("next");
    },
    async exchange() {
      const paw = this.password;
      if (!paw.trim()) return this.$Message.error(this.$t('customError.payPwd'));
      if (!/^\d{6}$/.test(paw)) return this.$Message.error(this.$t('customError.pwdRuleTips'));

      const params = {
        bidCoin: this.formCoin,
        askCoin: this.toCoin,
        amount: +this.number,
        payPwd: paw
      };
      const res = await axios.exchange(params);
      if (res.code === 0) {
        const { success } = res.data;
        const p = this.formCoin.toLowerCase();
        if (success) {
          this.$Message.success(this.$t('customError.exchangeSuccess'));
          this.fetchWallet();
          setTimeout( () => {
            this.$router.push({
              path: `/${p}`,
              query: { id: 3, type: 5 }
            })
          },2000)
        } else {
          this.$Message.error(this.$t('customError.exchangeFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    
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
        width: 90px;
      }
      .val {
        width: 360px;

        .tips-box {
          display: flex;
          justify-content: space-between;
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

        .coin-rate {
          margin-top: 6px;
          color: #4eb091;
          font-size: 12px;
          background: #f4faf8;
          padding: 0 4px;
          border-radius: 2px;
        }
        .input-tips {
          font-size: 12px;
          color: #666;
          margin-top: 6px;
          text-align: right;
          line-height: 12px;
        }

        .transfer-box {
          position: relative;
          .from-img{
            position: absolute;
            top: 11px;
            left: 13px;
            width: 20px;
            height: 20px;
            border-radius: 2px;
          }
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
        .from {
          position: relative;
          .from-img {
            position: absolute;
            top: 11px;
            left: 13px;
            width: 20px;
            height: 20px;
            border-radius: 2px;
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
        .coin-title {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .coin-input {
            border:none;
            padding: 0 10px;
            outline: none;
            vertical-align: middle;
          }
          .arrow {
            width: 13px;
            height: 8px;
          }
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
  .select-type {
    display: inline-block;
    width: 360px;
    @include con-list;
  }
}
</style>