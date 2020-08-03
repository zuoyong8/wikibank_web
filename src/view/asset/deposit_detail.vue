<template>
    <div class="detail">
        <div class="order-title">
            <img :src="orderIcon" alt="" class="order-icon"> 订单信息
        </div>
        <div class="order-info">
            <div>
                <img :src="stateIcon" alt="" class="state-icon">
                <span class="order-state">
                    提现失败
                </span>
                <span class="order-rechange">
                    (1USDT = 0.9999USD)
                </span>
                <span class="subsidy">已含补贴</span>
            </div>
            <div class="order-id">
                <span class="order-text">订单号</span>
                <span class="order-num">20207878787878878017</span>
            </div>
            <div class="withdraw-num">
                <span class="withdraw-text">提现数量</span>
                <span class="usdt">-2333.45 <span class="addr">USDT</span></span>
                <span class="usd">=$33333.00 USD</span>
            </div>
            <div class="tips">
                <div class="tips-text"><span class="radius"></span> 温馨提示</div>
                <div class="progess">进度查询请前往 WikiPay 查看</div>
            </div>
        </div>
        <div class="order-detail">
            <div class="">
                <img :src="moneyIcon" alt="" class="money-icon"> <span class="money-name">USDT-ERC20</span>
            </div>
            <div class="order-row">
                <div class="col">
                    账单时间
                    <div class="weight">2019-11-18 12:23:11</div>
                </div>
                 <div class="col">
                    手续费
                    <div class="weight">-$0.56 USD </div>
                </div>
                 <div class="col">
                    提现补贴
                    <div class="subsidy">+1.00 USDT </div>
                </div>
            </div>
            <div class="order-row">
                <div class="col">
                    提现金额
                    <div class="weight">2019-11-18 12:23:11</div>
                </div>
                 <div class="col">
                    变动金额
                    <div class="weight">-$0.56 USD </div>
                </div>
                 <div class="col">
                    <div>提现地址</div>
                    <div class="show-addr" @click="showWithDraw">{{WithDrawAddr}}</div>
                </div>
            </div>
            <div class="order-row">
                <div class="col">
                    备注
                    <div class="weight">生活费</div>
                </div>
                 <div class="col">
                    <div>付款地址</div>
                    <div class="show-addr" @click="showPayMoney">{{payMoneyAddr}}</div>
                </div>
                 <div class="col">
                    <div>交易哈希</div>
                    <div class="show-addr" @click="showTradeHash">{{tradeHash}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchWithdrawDepositDetail } from "../../api/request";
    export default {
        name: "detail",
        components: {

        },
        data() {
            return {
                WithDrawAddr: "显示地址", // 提现地址
                payMoneyAddr: "显示地址", // 付款地址
                tradeHash: "显示地址", // 交易哈希
                orderIcon: require("../../assets/imgs/withdraw_svg_20200525.svg"),
                stateIcon: require("../../assets/imgs/withdraw_svg_20200525.svg"),
                moneyIcon: "http://3.0.181.15/avatar/d273d73d-9a10-4dcc-bae5-9b3de704fd4f.jpg"
            }
        },
        methods: {
            showWithDraw(addr) {
                this.WithDrawAddr = addr;
            },
            showPayMoney(addr) {
                this.showPayMoney = addr;
            },
            showTradeHash(hash) {
                this.showTradeHash = hash;
            }
        },
        async mounted() {
            const { id } = this.$route.params;
            const params = {
                orderId: Number(id)
            }
            const res = await fetchWithdrawDepositDetail(params);
            console.log(res);
        }
    }
</script>

<style lang="scss" scoped>
.detail {
    min-width: 1200px;
    margin-left: 308px;
    margin-top: 48px;
    .order-title {
        padding: 17px 16px;
        background: #F5F6FA;
        font-size: 18px;
        color: #62697F;
        font-weight: bold;
        .order-icon {
            width: 24px;
            height: 18px;
            vertical-align: bottom;
            margin-right: 8px;
        }
    }
    .order-info {
        margin-top: 8px;
        padding: 32px 48px;
        border:1px solid rgba(240,240,240,1);
        .state-icon {
            width: 37px;
            height: 30px;
            vertical-align: bottom;
            margin-bottom: 2px;
        }
        .order-state {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-left: 10px;
        }
        .order-rechange {
            color: #1D316D;
            font-size: 14px;
            margin-left: 10px;
        }
        .subsidy {
            display: inline-block;
            color: #FF733A;
            border:1px solid rgba(255,115,58,1);
            border-radius: 2px;
            color: #FF733A;
            font-size: 10px;
            vertical-align: top;
        }
        .order-id {
            margin-top: 43px;
            font-size: 14px;
            color: #333;
            .order-text {
                font-size: 16px;
                color: #999;
                margin-right: 23px;
                width: 65px;
            }
            .order-num {
                font-size: 14px;
                color: #333;
            }
        }
        .withdraw-num {
            margin-top: 27px;
            margin-bottom: 34px;
            .withdraw-text {
                color: #999;
                font-size: 16px;
                margin-right: 23px;
            }
            .usdt {
                font-size: 28px;
                color: #3674D7;
                font-weight: bold;
                .addr {
                    font-size: 12px;
                    color: #3674D7;
                }
            }
            .usd {
                font-size: 14px;
                color: #888;
                font-weight: 500;
            }
        }
        .tips {
            border-top: 1px solid #f0f0f0;
            .tips-text {
                margin-top: 32px;
                color: #FF733A;
                font-size: 16px;
                .radius {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background: #FF733A;
                    border-radius: 50%;
                    margin-bottom: 2px;
                }
            }
            .progess {
                margin-top: 10px;
                color: #666;
                font-size: 13px;
                margin-left:10px;
            }
        }
    }
    .order-detail {
        margin-top: 8px;
        border: 1px solid #F0F0F0;
        padding: 32px 52px;
        .money-icon {
            width: 25px;
            height: 25px;
            border-radius: 50%;
        }
        .money-name {
            vertical-align: middle;
            margin-top: 3px;
            margin-left: 14px;
            display: inline-block;
            color: #333;
            font-size: 18px;
            font-weight: bold;
        }
        .order-row {
            display: flex;
            justify-content: flex-start;
            margin-top: 32px;
            .col {
                flex: 1;
                font-size: 15px;
                color: #999;
                
                .weight {
                    color: #000;
                    margin-top: 8px;
                }
                .subsidy {
                    color: #FF733A;
                    margin-top: 8px;
                    
                }
                .show-addr {
                    display: inline-block;
                    padding: 2px 0;
                    color: #3674D7;
                    font-size: 15px;
                    margin-top: 8px;
                    border-bottom: 1px solid #3674D7;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>