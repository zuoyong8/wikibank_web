<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">兑换</span>
    </div>
    <div class="content">
      <div v-if="stepNum === 1">
        <div class="row">
          <div class="key">从</div>
          <div class="val">
            <div class="from">
              <input
                type="text"
                class="enter-input disabled"
                v-model="formCoin"
                placeholder="手机号或邮箱"
                :style="{paddingLeft: '42px'}"
              />
              <img :src="fromCoinAvatar" alt="" class="from-img">
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="input-tips">可兑换 {{getWallet.usdAvail}} USD</div>
          </div>
        </div>
        <div class="row">
          <div class="key">到</div>
          <div class="val">
            <div class="select-type">
              <SelectDown :isShow="isShowFromSelect" :list="moneyList" @selectList="checkFromCoin">
                <template v-slot:title>
                  <div class="coin-title" @click="selectFromCoin">
                    <div>
                      <img :src="toCoinAvatar" alt class="coin-avatar" />
                      <input type="text" v-model="toCoin" placeholder="0.0000" class="coin-input" />
                    </div>
                    <img :src="bottomArrow" alt class="arrow" />
                  </div>
                </template>
              </SelectDown>
             </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '40px'}">
          <div class="key">数量</div>
          <div class="val">
            <div>
              <div class="transfer-box">
                <img :src="fromCoinAvatar" alt="" class="from-img">
                <input
                  type="text"
                  class="enter-input"
                  v-model="number"
                  placeholder="0.00"
                  @change="getMoney"
                  :style="{paddingLeft: '42px'}"
                />
                <div class="all-money">
                  USD
                  <span class="split"></span>
                  <span class="total" @click="transferAll">全部</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="tips-box">
              <div class="input-tips">{{calcCoin}} {{toCoin}}</div>
              <div class="coin-rate">(1 USD = {{price}} {{toCoin}})</div>
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="confirm" @click="next">确认</div>
          </div>
        </div>
      </div>

      <div v-if="stepNum === 2">
        <div class="row">
          <div class="key">支付密码</div>
          <div class="val">
            <div>
              <input
                type="password"
                class="enter-input"
                v-model="payPassword"
                placeholder="请输入支付密码"
              />
            </div>
          </div>
        </div>
        <div class="row" :style="{marginTop: '0'}">
          <div class="key"></div>
          <div class="val">
            <div class="confirm" @click="exchange">确认</div>
          </div>
        </div>
      </div>
      <div class="tips">
        <p>温馨提示</p>
        <p>• 目前仅支持（USDT/USD、BTC/USD、ETH/USD）相互兑换。</p>
        <p>• 兑换后的资产将自动转入相对应的账户里。</p>
        <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../api/request";
import { saveDecimal, isNumber } from "../../filters.js";
import { mapState, mapGetters } from "vuex";
import SelectDown from "../components/SelectDown";
import { mapActions } from "vuex";
export default {
  name: "deposit",
  components: {
    SelectDown
  },
  data() {
    return {
      formCoin: "USD",
      toCoin: "BTC",
      number: "",
      price: 1,
      usd: 1,
      decimal: 0, // 保留的小数位数 
      stepNum: 1,
      payPassword: "", // 支付密码
      isShowFromSelect: false,
      fromCoinAvatar: require("../../assets/person/usd_20200628.png"),
      toCoinAvatar: require("../../assets/person/btc_icon_20200624.png"),
      bottomArrow: require("../../assets/person/bottom_icon_20200628.png"),
      depositIcon: require("../../assets/account/exchange_icon_20200731.png")
    };
  },
  computed: {
    ...mapState(["rate"]),
    ...mapGetters(["getWallet", "getAccountList"]),
    calcCoin() {
      return saveDecimal(+this.number / this.usd, this.decimal);
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
    this.getPrice();
  },
  methods: {
    ...mapActions(['fetchWallet']),
    // 显示/隐藏 弹框
    selectFromCoin() {
      if (this.isShowFromSelect) {
        this.isShowFromSelect = false;
      } else {
        this.isShowFromSelect = true;
      }
    },
    // 选择 coin
    async checkFromCoin(item) {
      this.toCoinAvatar = item.avatar;
      this.toCoin = item.name;
      if (this.isShowFromSelect) {
        this.isShowFromSelect = false;
      } else {
        this.isShowFromSelect = true;
      }

      this.getPrice();
    },
    async getPrice() {
      
      const params = {
        coin: this.toCoin,
        type: 1,
        side: "buy"
      }
      if(this.toCoin === "ETH") {
        this.decimal = 5
      } else if (this.toCoin === "BTC") {
        this.decimal = 8
      } else if(this.toCoin === "USDT") {
        this.decimal = 4
      }
      const res = await axios.convertPrice(params);

      if(res.code === 0) {
        const { usd } = res.data;
        this.usd = usd;
        this.price = saveDecimal(1/usd, this.decimal);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 金额明细
    getMoney() {
      let money = isNumber(this.number) ? this.number: 0;

      if(+this.number > +this.getWallet.usdAvail) {
        this.number = this.getWallet.usdAvail;
      } else {
        this.number = saveDecimal(money, 2);
      }
    },
    // 转账所有
    transferAll() {
      this.number = this.getWallet.usdAvail;
    },
    next() {
      if(!+this.number) return this.$Message.error("请输入数量！");
      this.stepNum++;
    },
    async exchange() {
      const paw = this.payPassword;
      if(!(paw.trim())) return this.$Message.error("请输入支付密码！");
      if(!/^\d{6}$/.test(paw)) return this.$Message.error("密码格式不正确！");

      const params = {
        bidCoin: this.formCoin,
        askCoin: this.toCoin,
        amount: +this.number,
        payPwd: paw
      };

      const res = await axios.exchange(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.success("兑换成功！");
          this.fetchWallet();
          this.$router.push({path: '/console/usd'});
        } else {
          this.$Message.error("兑换失败！");
        }
      } else {
        this.$Message.error(res.msg);
      }
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
@mixin coin-list {
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
          font-size: 14px;
        }
        .input-tips {
          font-size: 12px;
          color: #666;
          margin-top: 6px;
          text-align: right;
        }

        .transfer-box {
          position: relative;
          .from-img{
            position: absolute;
            top: 11px;
            left: 13px;
            width: 20px;
            height: 20px;
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
            top: 10px;
            left: 13px;
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
        .coin-title {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .coin-input {
            border: none;
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
      margin-left: 129px;
      margin-top: 39px;
      color: #999;
      font-size: 12px;
      line-height: 22px;
    }
  }
  .select-type {
    display: inline-block;
    width: 360px;
    @include coin-list;
  }
 
}
</style>