<template>
    <div class="center">
      <div class="center-top">
        <div class="txt">账户总资产折合</div>
        <div class="txt-r hidden-money" @click="showMoney">{{moneyText}}</div>
      </div>
      <div class="all-assets">
        1231,1231.00 <span class="coin-marks">USD</span>
      </div>
      <div class="account-list">
        <div class="available">
          可用 (USD)
          <div class="number">
            1231.00
          </div>
        </div>
        <div class="withdraw">
          提现中（USD）
          <div class="number">
            100.00 
          </div>
        </div>
        <div class="valuation">
          美元昨日收益（USD）
          <div class="number">
            0.00
          </div>
        </div>
        <div class="available">
          美元年化收益
          <div class="number">
            1.50% 
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
    name: '',
    components: {},
    data() {
        return {
            moneyText: "隐藏资产",
            isShowMoney: false,
        }
    },
    methods: {
        showMoney() {
            if (this.isShowMoney) {
                this.moneyText = "隐藏资产";
            } else {
                this.moneyText = "显示资产";
            }
            this.isShowMoney = !this.isShowMoney;
        },
    }
}    
</script>
<style lang="scss" scoped>
.center {
    margin-left: 30px;
    margin-right: 30px;
    border:1px solid #F0F0F0;
    .all-assets {
      margin-top: 40px;
      font-size: 40px;
      color: #1C2F62;
      margin-left: 64px;
      font-weight: bold;
      .coin-marks {
        font-size: 24px;
        color: #2C354C;
        font-weight: bold;
      }
    }
    .account-list {
      padding: 40px 64px;
      display: flex;
      justify-content: space-between;
      color: #1C2F62;
      font-size: 14px;
      .number {
        font-weight: bold;
        font-size: 18px;
        color: #1C2F62;
        margin-top: 14px;
      }
    }
    .center-top {
      height: 64px;
      background: rgba(245, 246, 250, 1);

      .icon {
        width: 23px;
        height: 18px;
        background: url("../../assets/imgs/userRight1.svg");
        float: left;
        margin: 23px 6px 23px 16px;
      }

      .txt {
        margin: 17px 20px 17px 64px;
        height: 30px;
        font-size: 18px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(98, 105, 127, 1);
        line-height: 30px;
        float: left;
      }

      .txt-r {
        margin: 25px 0 18px 0;
        width: 62px;
        height: 19px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(54, 116, 215, 1);
        line-height: 19px;
        float: left;
        cursor: pointer;
      }

      .button {
        cursor: pointer;
        margin: 14px 23px 13px 0;
        float: right;
        width: 272px;
        height: 37px;
        background: rgba(54, 116, 215, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        line-height: 37px;
        text-align: center;
      }
    }
  }

</style>>