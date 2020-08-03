<template>
  <div class="account">
    <div class="title">
      <img :src="depositIcon" alt class="icon" />
      <span class="text">充值</span>
    </div>
    <div class="content">
      <div class="row">
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
      <div v-if="checkCoin === 'USDT'">
        <div class="row" :style="{marginTop: '47px'}" v-show="isShowChain">
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
        <div class="row" :style="{marginTop: '47px',alignItems:'end'}" v-if="chainIndex !== -1">
          <div class="key">充值地址</div>
          <div class="val">
            <DepositQrcode :coinName="coin" :accountType="1" :address="address" :logo="logo"></DepositQrcode>
          </div>
        </div>
        <div class="tips" v-if=" checkCoin==='USDT' && checkChain === 'ERC20'">
          温馨提示
          <p>• 请勿向上述地址充值任何非 ERC20_ USDT资产，否则资产将不可找回。</p>
          <p>• 您充值至上述地址后，需要整个网络节点的确认，12次网络确认后到账，12次网络确认后可提币。</p>
          <p>• 最小充值金额：1 0 USDT，小于最小金额的充值将不会上账且无法退回。</p>
          <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
        </div>
        <div class="tips" v-if=" checkCoin==='USDT' && checkChain === 'OMNI'">
          温馨提示
          <p>• 请勿向上述地址充值任何非 OMNI_ USDT资产，否则资产将不可找回。</p>
          <p>• USDT充币仅支持simple send的方法，使用其他方法（send all）的充币暂时无法上账，请您谅解。</p>
          <p>• 您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，2次网络确认后可提币。</p>
          <p>• 最小充值金额：1 0 USDT，小于最小金额的充值将不会上账且无法退回。</p>
          <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
        </div>
      </div>
      <div v-else-if="checkCoin ==='BTC'">
        <div class="row" :style="{marginTop: '47px',alignItems:'end'}">
          <div class="key">充值地址</div>
          <div class="val">
            <DepositQrcode :coinName="coin" :accountType="1" :address="address" :logo="logo"></DepositQrcode>
          </div>
        </div>
        <div class="tips">
          温馨提示
          <p>• 请勿向上述地址充值任何非 BTC 资产，否则资产将不可找回。</p>
          <p>• 您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，2次网络确认后可提币。</p>
          <p>• 最小充值金额：0.001 BTC，小于最小金额的充值将不会上账且无法退回。</p>
          <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
        </div>
      </div>
      <div v-else-if="checkCoin === 'ETH'" >
        <div class="row" :style="{marginTop: '47px',alignItems:'end'}">
          <div class="key">充值地址</div>
          <div class="val">
            <DepositQrcode :coinName="coin" :accountType="1" :address="address" :logo="logo"></DepositQrcode>
          </div>
        </div>
        <div class="tips">
          温馨提示
          <p>• 请勿向上述地址充值任何非 ETH 资产，否则资产将不可找回。</p>
          <p>• 您充值至上述地址后，需要整个网络节点的确认，12次网络确认后到账，12次网络确认后可提币。</p>
          <p>• 最小充值金额：0.01 ETH，小于最小金额的充值将不会上账且无法退回。</p>
          <p>• 目前不支持区块奖励(Coinbase)的转账充值，区块奖励的转账将不会上账，请您谅解。</p>
          <p>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
        </div>
      </div>
      <div v-else-if="checkCoin === 'CARD'">
        <div class="row" :style="{marginTop: '47px',alignItems:'end'}">
          <div class="key">充值卡密码</div>
          <div class="val">
            <div>
              <input type="text" class="enter-input" v-model="password" placeholder="请输入充值卡密码" />
            </div>
            <div class="confirm" @click="deposit">确认</div>
          </div>
        </div>
        <div class="tips">
          充值说明
          <p>1、WikiPay A/B卡(以下称“A/B卡”)指由WikiBk Co.,Limited(“本公司”)发行的自主产品,(“自主产品”指在由WikiBk Co.,Limited明确标识为自主的商品,但出版物、虚拟产品、部分团购、预售及抢购商品、投资金银类及受国家政策影响、法律另有限制性规定涉及的商品不在此内)
          </p>
          <p>
            2、为保障资金安全,使用B卡之前必须开启支付密码,开启支付密码位置:"安全中心账户安全"中开启支付密码,开启支付密码需实名认证。
          </p>
          <p>3、A/B卡的其他使用规则以《购卡章程》及WikiBk Co.,Limited所公示的内容为准。</p>
        </div>
      </div>
      <div class="row" v-if="coinIndex === -1">
        <div class="key"></div>
        <div class="val">
          <div class="deposit-tips">
            请选择您的充值方式...
          </div>
        </div>
      </div>
      <div class="row" v-if="coinIndex === 1 && chainIndex === -1">
        <div class="key"></div>
        <div class="val">
          <div class="deposit-tips">
            请选择链名称...
          </div>
        </div>
      </div>
    </div>

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
          <p>您的 {{coin}} 将会自动兑换成美金充到您的账户里</p> 
          <p>地址为限时动态地址，请在有效时间内完成充值</p> 
        </div>
      </template>
    </DepositModal>
  </div>
</template>

<script>
import axios from "../../api/request";
import VueQr from 'vue-qr';
import DepositQrcode from "../components/DepositQrcode";
import DepositModal from "../components/DepositModal";
import { mapActions } from "vuex";
export default {
  name: "deposit",
  components: {
    DepositQrcode,
    DepositModal,
    VueQr
  },
  data() {
    return {
      title:"充值",
      isShowDepositModal: false,
      isHideDepositMask: false,
      isShowCancel: true,
      lastCoinType: "",
      recordCoin:[],
      fromIcon: "",
      toIcon: require("../../assets/account/usd_logo_20200728.png"),
      fromText: "",
      toText: "USD",
      depositIcon: require("../../assets/account/deposit_icon_20200703.png"),
      checkCoin: "", // 选中的币种
      checkChain: "", // 选中的链名称
      coin: "", // checkCoin + checkChain
      isShowChain: true, // 显示链名称
      coinIndex: -1,
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
      address: "",
      logo: require("../../assets/account/usdt_erc20_20200727.png")
    };
  },
  mounted() {
  },
  methods: {
    ...mapActions(['fetchWallet']),
    know() {
      this.openDepositModal(false);
      if(this.checkCoin === "CARD") return;
      this.showQrcode();
    },
    back() {
      this.coinIndex = -1;
      this.chainIndex = -1;
      this.checkCoin = "";
      this.checkChain = "";
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
    // 选择 coin
    selectCoin(id, name) {
      this.coinIndex = id;
      this.coin = name;
      if (id > 1) {
        this.isShowChain = false;
        this.checkChain = "";
        this.checkCoin = name;
        this.fromText = name;
        if(this.coin === "BTC") {
          this.logo = require("../../assets/account/btc_logo_20200727.png")
          this.fromIcon = require("../../assets/person/btc_icon_20200624.png")
        } else if(this.coin === "ETH") {
          this.logo = require("../../assets/account/eth_logo_20200727.png")
          this.fromIcon = require("../../assets/person/eth_icon_20200624.png")
        }
        if(name === "CARD") return;
        this.isShowModel(name);
      } else if(id === 1){
        this.checkCoin = name;
        this.coin = name + "-" + this.checkChain
        this.chainIndex = -1;
        this.isShowChain = true;
      }
    },
    // 选择 chain
    selectChain(id, name) {
      this.chainIndex = id;
      this.checkChain = name;
      this.coin = this.checkCoin + "-" + name;
      this.isShowModel(this.coin)
      if(this.coin === "USDT-ERC20") {
        this.logo = require("../../assets/account/usdt_erc20_20200727.png")
        this.fromIcon = require("../../assets/account/usdt_ecr20_20200728.png")
      } else {
        this.logo = require("../../assets/account/usdt_omni_20200727.png")
        this.fromIcon = require("../../assets/account/usdt_omni_20200728.png")
      }
      this.fromText = this.coin;
    },
    isShowModel(name) {
      if(this.recordCoin.findIndex( item => item === name) > -1) {
        this.showQrcode();
      } else {
        this.recordCoin.push(name);
        this.openDepositModal(true);
      }
    },
    // 显示二维码
    async showQrcode() {
      const params = {
        coin: this.coin,
        accountType: 2
      };

      const res = await axios.coinAddress(params);

      if (res.code === 0) {
        const { address } = res.data;
        this.address = address;

      } else {
        this.$Message.error(res.msg);
      }
    },
    // AB 卡充值
    async deposit() {
      if (!this.password.trim()) return this.$Message.error("请输入充值密码！");

      const params = {
        cardNo: this.password // 充值卡密码
      };
      const res = await axios.abDeposit(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.success("充值成功！");
          this.fetchWallet();
          this.$router.push({path: '/console/usd'});
        } else {
          this.$Message.error("充值失败！");
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
.account {
  margin: 0 30px;
  background: #fff;
  .title {
    @include title;
  }
  .model-tips {
    font-size: 14px;
    color: #333;
    margin-top: 48px;
    line-height: 21px;
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
          border: 1px dashed #BBBBBB;
          background: #F5F6FA;
          margin-top: 48px;
        }
        .enter-input {
          border: 1px solid #ccc;
          padding: 10px 12px;
          width: 360px;
          border-radius: 2px;
          outline: none;
          &::placeholder {
            color: #ccc;
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
      margin-right: 40px;
      .coin-avatar {
        width: 24px;
        height: 24px;
      }
      .coin-name {
        display: inline-block;
        color: #333;
        font-size: 16px;
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
}
</style>