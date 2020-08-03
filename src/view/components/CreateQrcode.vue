<template>
    <!-- 提现二维码遮盖层 -->
    <ModalMask
      :isShowModal = "isShowModal"
      :isHideMask = "isHideMask"
      @closeModal = "closeModal"
      @openModal = "openModal"
    >
      <template v-slot:body>
      <div class="mask">
        <div class="top">
          <div class="logo">
            <img src="../../assets/person/detail_logo_20200708.png" alt="加载中" width="130px" height="30px" />
          </div>
          <div class="txt">{{title}}</div>
          <div class="close-icon" @click="closeModal(false)">
            <span class="icon--copy4"></span>
          </div>
        </div>
        <div class="detail">
            <div class="detail-info">
                <slot name="info">
                </slot>
                
                <div class="qrcode">
                    <canvas id="qrcode"></canvas>
                    <div class="qrcode-mask" v-if="qrcodeCode === 0">
                        扫描成功
                    </div>
                     <div class="qrcode-mask" v-if="qrcodeCode === 1010060">
                        二维码已过期
                    </div>
                    <div class="qrcode-mask" v-else-if="qrcodeCode === -1">
                       <img src="../../assets/person/loading_logo.gif" alt="加载中" width="40px" height="40px"/>
                    </div>
                </div>

                <div class="scann">
                    <div class="sweep-icon"></div>
                    <div class="sweep-txt">打开手机端APP扫描二维码</div>
                </div>
                <div class="create-order">
                    <div class="finish-icon"></div>
                    <div class="finish-txt">
                        <p>{{getTel}}已创建支付订单</p>
                        <p>请在WikiPay 上完成支付</p>
                    </div>
                </div>
            </div>
            <div :class="['detail-img', isShowModal ? 'fade':'']">
                <img src="../../assets/imgs/transfer2.png" alt="">
                <img src="../../assets/account/scanning_icon_20200731.png" alt="" :class="['scann-icon', isShowModal ?'scann-animate':'']">
            </div>
        </div>
      </div>
      </template>
    </ModalMask>
</template>

<script>
import ModalMask from "./ModalMask";
import { mapGetters } from "vuex";
export default {
    name: "",
    components: {
        ModalMask
    },
    data() {
        return {
           avatar: 0,
           numAccount: 0,
           txt: 0
        }
    },
    props: {
        isShowModal: Boolean,
        isHideMask: Boolean,
        title: String,
        qrcodeCode: Number
    },
    computed: {
        ...mapGetters(["getTel"])
    },
    methods: {
        openModal(isShow) {
            this.$emit('openWithdrawModal', isShow);
        },
        closeModal(isShow) {
            this.$emit('closeWitdrawModal', isShow);
        },
    }
}
</script>

<style lang="scss" scoped>
 .mask {
    width: 939px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.2);
    border-radius: 9px;

    .top {
      height: 61px;
      border-bottom: 1px solid #f0f0f0;

      .logo {
        float: left;
        margin-left: 32px;
        margin-top: 18px;
        width: 131px;
        height: 31px;
      }

      .close-icon {
        margin-top: 25px;
        margin-left: 640px;
        width: 16px;
        height: 16px;
        float: left;
        cursor: pointer;
      }

      .txt {
        color: #1E3066;
        font-size: 18px;
        font-weight: bold;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        float: left;
        margin-top: 21px;
        margin-left: 17px;
        height: 22px;
      }
    }
    .detail {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .detail-info {
            width: 256px;
            margin-top: 44px;
            text-align: center;
            
            .qrcode {
                position: relative;
                width: 210px;
                margin: 27px auto 24px;
                #qrcode {
                    border: 1px solid #E9E9E9;
                }
                .qrcode-mask {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    color: #333;
                }
            }
            .scann {
                padding: 0 0 16px;
                font-size: 13px;
                color: #333;
                display: flex;
                justify-content: center;
                align-self: center;
                .sweep-icon {
                    background-image: url("../../assets/imgs/withdraw1.png");
                    width: 21px;
                    height: 22px;
                    margin-right: 14px;
                }
            }
            .create-order {
                padding-bottom: 47px;
                display: flex;
                justify-content: center;
                align-items: center;
                .finish-icon {
                    width: 33px;
                    height: 33px;
                    margin-left: 14px;
                    background-image: url("../../assets/imgs/withdraw2.png");
                }
                .finish-txt {
                    margin-left: 14px;
                    text-align: left;
                    p{
                        font-size: 14px;
                        color: #333;
                        font-weight: bold;
                    }
                    
                }
            }
        }
        .detail-img {
            position: relative;
            transition: all 2s ease;
            visibility: hidden;
            img {
                width: 203px;
                height: 403px;
            }
            .scann-icon {
                position: absolute;
                display: block;
                margin: 179px auto 0;
                left: 52px;
                top: 0;
                width: 110px;
                height: 162px;
                transition: all 2s ease;
                visibility: hidden;
            }
            .scann-animate {
                animation: rotated 1s ease 1;
                animation-delay: 1s;
                animation-fill-mode: forwards;
            }
            @keyframes rotated {
                from{
                    opacity: 0;
                    transform: translateY(100%) scale(0);
                }
                to {
                    opacity: 1;
                    transform:  translateY(0) scale(1);
                    visibility: visible;
                }
            }
        }
        .fade{
            animation: fade 1s linear 1;
            animation-fill-mode: forwards;
        }
        @keyframes fade {
            from {
                visibility: hidden;
                opacity: 0;
            }
            to {
                visibility: visible;
                opacity: 1;
            }
        }
    }
  }

</style>