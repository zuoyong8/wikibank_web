<template>
  <div class="infinite-list">
    <div class="bill-title">
      <div class="title type">{{$t('home.category')}}</div>
      <div class="title date">{{$t('home.orderTime')}}</div>
      <div class="title name">
        {{$t('home.name')}}
        <span class="line"></span>
        {{$t('home.orderId')}}
      </div>
      <div class="title money">
        {{$t('home.money')}}
        <!-- <span class="line"></span>明细 -->
      </div>
      <!-- <div class="title state">
            状态
        </div> -->
        <div class="title marks">{{$t('home.marks')}}
        </div>
        <div class="title operate">{{$t('home.operate')}}
        </div>
    </div>
    <div class="infinite-load" @scroll="infiniteLoad">
      <ul class="bill-list" ref="billList">
        <li class="bill-item" v-for="item in orderList" :key="item.id">
          <div class="content type">
            <img :src="item.avator" alt class="type-image" />
          </div>
          <div class="content date">
            <div class="day">{{item.date}}</div>
            <div class="time">{{item.time}}</div>
          </div>
          <div class="content name">
            <div class="infos">{{item.infos}}</div>
            <div class="account">
              <!-- <div class="account-tips">
                            <div class="select-widget" :style="{background:'none'}">
                                <div class="select-val">账号：{{item.account}}
                                </div>
                                <div class="select-triangle"></div>
                                <div class="select-list">
                                    <div class="order-detail">
                                        <div class="text-background">
                                            {{item.account}}
                                        </div>
                                        <div class="copy-order copy_account"
                                        @click="copyAccount"
                                        data-clipboard-action="copy" data-clipboard-text="item.account">
                                            <img :src="copyIcon" alt="" class="copyIcon">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
              <span class="line"></span>-->
              <div class="order-tips">
                <div class="select-widget" :style="{'background':'none'}">
                  <div class="select-val">{{$t('home.orderId')}}：{{item.ellipsisOrderId}}</div>
                  <div class="select-triangle"></div>
                  <div class="select-list">
                    <div class="order-detail">
                      <div class="text-background">{{item.orderId}}</div>
                      <div
                        class="copy-order copy_order"
                        @click="copyOrderid"
                        data-clipboard-action="copy"
                        :data-clipboard-text="item.orderId"
                      >
                        <!-- <icon name="copy" class="copyIcon"/> -->
                        <img :src="copyIcon" class="copyIcon" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content money">
            <div class="money-box">
              <div class="money-num">
                <div class="usdt">{{item.usdt}}</div>
                <div class="usd">{{item.usd}}</div>
              </div>
              <!-- <div class="money-tips">
                            <div class="select-widget">
                                <div class="select-val">
                                    <div class="money-detail">明细</div>
                                </div>
                                <div class="select-triangle"></div>
                                <div class="select-list">
                                    <div class="order-detail">
                                        <div class="usdt">+2333.45</div>USTD
                                        <div class="usd">$111,333.00 USD</div>
                                    </div>
                                    <div class="order-detail order-box">
                                        <div class="order-list">
                                            <div>提现金额</div>
                                            <div>-$200.00 USD</div>
                                        </div>
                                        <div class="order-list">
                                            <div>提现补贴</div>
                                            <div>+1.00 USDT</div>
                                        </div>
                                        <div class="order-list">
                                            <div>手续费(矿工费）</div>
                                            <div>-$0.56 USD</div>
                                        </div>
                                        <div class="order-list">
                                            <div>变动金额</div>
                                            <div>-$200.56 USD</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
              -->
            </div>
          </div>
          <!-- <div class="content state">
                    <div class="text-center">{{item.state}}</div>
          </div>-->
          <div class="content marks">
            <div class="text-center">{{item.marks}}</div>
          </div>
          <div class="content operate">
            <div class="operate-tips" @click="enterDetail(item.id, item.originType)">
              {{$t('home.detail')}}
              <!-- <div class="select-val">
                            <div class="account-detail" @click="enterDetail(item.id, item.originType)"></div> 
              </div>-->
              <!-- <div class="select-widget">
                            
                            <div class="select-triangle"></div>
                            <div class="select-list">
                                <div class="order-detail">
                                    <div class="usdt">+2333.45</div>USTD
                                    <div class="usd">$111,333.00 USD</div>
                                </div>
                                <div class="order-detail order-box">
                                    <div class="order-list">
                                        <div class="key">订单时间</div>
                                        <div class="val">2020-04-07  12:23</div>
                                    </div>
                                    <div class="order-list">
                                        <div class="key">收款姓名</div>
                                        <div class="val">陈女士(陈**)</div>
                                    </div>
                                    <div class="order-list">
                                        <div class="key">收款账户</div>
                                        <div class="val">yosuihjdhghgyosuihjdhghgdgdg@qq.com</div>
                                        <img :src="copyIcon" alt="" class="copyIcon put_account"  @click="copyPutAccount"
                                        data-clipboard-action="copy" data-clipboard-text="yosuihjdhghgyosuihjdhghgdgdg@qq.com">
                                    </div>
                                    <div class="order-list">
                                        <div class="key">付款账户</div>
                                        <div class="val">
                                        292888888@qq.com</div>
                                        <img :src="copyIcon" alt="" class="copyIcon pay_account"  @click="copyPayAccount"
                                        data-clipboard-action="copy" 
                                        data-clipboard-text="292888888@qq.com">
                                    </div>
                                </div>
                            </div>
              </div>-->
            </div>
          </div>
        </li>
      </ul>
      <div class="loading-tips" v-if="noMore">{{$t('home.noData')}}</div>
    </div>
    <div class="loading-tips" v-if="!isLoading">{{$t('home.loading')}}</div>
  </div>
</template>
<script>
export default {
  name: "InfiniteLoad",
  components: {},
  data() {
    return {
      copyIcon: require("@/assets/imgs/copy.svg")
    };
  },
  props: {
    orderList: Array,
    isLoading: Boolean,
    noMore: Boolean,
  },
  methods: {
    // 复制
    copyOrderid() {
      this.copy(".copy_order");
    },

    copy(className) {
      let self = this;
      // 防止重复出现多次弹框
      if (clipboard) {
        clipboard.destroy();
      }
      let clipboard = new this.clipboard(className);
      clipboard.on("success", function () {
        self.$Message.success(self.$t('home.copySuccess'));
        if (clipboard) {
          clipboard.destroy();
        }
      });
      clipboard.on("error", function () {
        self.$Message.error(self.$t('home.copyFail'));
      });
    },

    // 加载更多
    infiniteLoad(evt) {
      const top = evt.target.scrollTop;
      const boxHeight = evt.target.clientHeight;
      const listHieght = this.$refs.billList.clientHeight;

      if (top + boxHeight >= listHieght) {
        this.$emit("loadMore");
      }
    },

    // 详情
    enterDetail(id, type) {
      this.$emit("enterDetail", id, type);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/tooltips.scss";
@mixin bill-item {
  .type {
    position: relative;
    width: 11%;
    padding-right: 16px;
  }
  .date {
    width: 16%;
  }
  .name {
    width: 23%;
    box-sizing: border-box;
  }
  .money {
    width: 12%;
    text-align: right;
    // padding-right: 140px;
  }
  .marks {
    position: relative;
    padding: 0 10px;
    width: 25%;
    padding-left: 14%;
    // text-align: right;
    margin-left: 5px;
    box-sizing: border-box;
    .text-center {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    // padding-left: 170px;
  }
  .state,
  .operate {
    position: relative;
    width: 12%;
    text-align: right;
  }
}
@mixin line {
  display: inline-block;
  margin: 0 10px;
  width: 1px;
  height: 10px;
  border-radius: 1px;
  background: #e5e5e5;
}
@mixin title {
  font-size: 14px;
  color: #333;
}
@mixin subtitle {
  font-size: 12px;
  color: #999;
}
.infinite-list {
  .bill-title {
    color: #b7b7b7;
    border-top: 1px solid #f6f6f6;
    font-size: 14px;
    .title {
      display: inline-block;
      padding: 16px 0;
      .line {
        @include line;
      }
    }
    @include bill-item();
  }
  .infinite-load {
    overflow-y: auto;
    overflow-x: hidden;
    // max-height: 728px;
    height: 728px;
    &::-webkit-scrollbar{
      display: none;
      width: 0;
    }
    .bill-list {
      border-bottom: 1px solid #f6f6f6;
    }
  }
  .loading-tips {
    padding: 56px 0;
    text-align: center;
  }
  .bill-item {
    display: flex;
    align-items: center;
    border-top: 1px solid #f6f6f6;
    padding: 16px 0;
    transition: all 0.2s ease-out;
    @include bill-item();
    .content {
      display: inline-block;
      @include bill-item();
      .infos {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &:last-child{
      .select-triangle{
        top: auto!important;
        bottom: 9px!important;
        border-color: #3674d7 transparent transparent transparent!important;
      }
      .select-list{
        bottom: 20px!important;
        top:auto!important;
        transform-origin:0 100%;
      }
    }
    
    .type-image {
      width: 29px;
      height: 29px;
      border-radius: 4px;
    }
    .day {
      @include title;
    }
    .time {
      @include subtitle;
    }
    .name {
      @include title;
    }
    .account {
      @include subtitle;
      .line {
        @include line;
      }
      .account-tips,
      .order-tips {
        display: inline-block;
        transition: all 0.2s ease-out;
        &:hover {
          color: #3674d7;
          background: none;
        }
        .select-widget {
          &:hover {
            background: none;
          }
          @include select-widget();

          .select-val {
            @include select-val();
          }

          .select-triangle {
            @include select-triangle();
            top: 9px;
            border-bottom-color: #3674d7;
          }

          .select-list {
            top: 20px;
            padding: 0;
            width: auto;
            height: auto;
            overflow: visible;
            
            .order-detail {
              font-size: 14px;
              color: #fff;
              white-space: nowrap;
              // text-align: center;
              box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
              .text-background {
                display: inline-block;
                padding: 8px 14px;
                background: #3674d7;
              }
              .copy-order {
                display: inline-block;
                padding: 8px 10px;
                width: 36px;
                background: #f4f7fa;
                transition: all 0.2s ease-out;
                .copyIcon {
                  width: 14px;
                  height: 14px;
                  vertical-align: middle;
                  opacity: 0.5;
                  &:hover {
                    opacity: 1;
                  }
                }
              }
            }
          }
        }
      }
    }

    .money-box {
      .money-num {
        display: inline-block;
        text-align: right;
        margin-left: -121px;
        .usdt {
          @include title;
          font-weight: bold;
        }
        .usd {
          @include subtitle;
        }
      }
      .money-tips {
        position: relative;
        display: inline-block;
        transition: all 0.2s ease-out;
        .money-detail {
          display: inline-block;
          margin-left: 18px;
          position: absolute;
          top: -11px;
          width: 40px;
          height: 32px;
        }

        &:hover {
          color: #3674d7;
          background: none;
        }
        .select-widget {
          @include select-widget();
          &:hover {
            z-index: 5;
          }
          .select-val {
            @include select-val();
          }

          .select-triangle {
            @include select-triangle();
            top: 9px;
            left: 32px;
            border-bottom-color: #3674d7;
          }

          .select-list {
            @include select-list(276px, auto, 0);
            top: 19px;
            left: -90px;
            .order-detail {
              font-size: 14px;
              padding: 16px 0;
              background: #3674d7;
              color: #fff;
              text-align: center;
              box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
              border-bottom: 1px solid rgba(255, 255, 255, 0.5);

              .usdt {
                display: inline-block;
                font-size: 22px;
                font-weight: bold;
              }
              .order-list {
                display: flex;
                justify-content: space-between;
                opacity: 0.79;
                margin-bottom: 30px;
                padding: 0 25px;
                &:last-child {
                  margin: 0;
                }
              }
            }
            .order-box {
              padding: 24px 0;
            }
          }
        }
      }
    }
    .text-center {
      // position: absolute;
      // top: -26px;
      // left: 30px;
      font-size: 14px;
      color: #333;
    }
    .account-detail {
      width: 40px;
      position: absolute;
      top: -11px;
      color: #3674d7;
      cursor: pointer;
    }
    .operate-tips {
      position: relative;
      display: inline-block;
      transition: all 0.2s ease-out;
      cursor: pointer;
      color: #3674d7;
      left: -1px;
      &:hover {
        font-weight: bold;
      }
      .account-detail {
        width: 72px;
        height: 32px;
        position: absolute;
        top: -20px;
        left: -40px;
        color: #3674d7;
        cursor: pointer;
        text-align: center;
        background: #f3f8ff;
        border-radius: 4px;
        padding: 6px 10px 10px;
        &:hover {
          background: #f7f8fb;
        }
      }

      &:hover {
        color: #3674d7;
        background: none;
      }
      .select-widget {
        @include select-widget();
        &:hover {
          z-index: 5;
        }
        .select-val {
          @include select-val();
        }

        .select-triangle {
          @include select-triangle();
          top: 9px;
          left: 10px;
          border-bottom-color: #3674d7;
        }

        .select-list {
          @include select-list(330px, auto, 0);
          top: 19px;
          left: -291px;
          .order-detail {
            font-size: 14px;
            padding: 16px 0;
            background: #3674d7;
            color: #fff;
            text-align: center;
            box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
            border-bottom: 1px solid rgba(255, 255, 255, 0.5);

            .usdt {
              display: inline-block;
              font-size: 22px;
              font-weight: bold;
            }
            .order-list {
              display: flex;
              justify-content: space-between;
              align-items: center;
              opacity: 0.79;
              margin-bottom: 30px;
              padding: 0 25px;
              &:last-child {
                margin: 0;
              }
              .val {
                text-align: right;
                width: 180px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .copyIcon {
                width: 13px;
                height: 14px;
              }
            }
          }
          .order-box {
            padding: 24px 0;
          }
        }
      }
    }
  }
}
</style>