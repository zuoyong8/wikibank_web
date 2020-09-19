<template>
  <div class="mine">
    <PersonalData></PersonalData>
    <div class="person-section">
      <div class="person-title">
        <img :src="identifyIcon" alt class="icon" />
        <span class="text">{{$t('personCenter.identityVertify')}}</span>
      </div>
      <div class="person-list">
        <div class="person-item">
          <div class="list-title">
            {{$t('personCenter.phone')}}
            <span class="tips">{{$t('personCenter.phoneTips')}}</span>
          </div>
          <div class="list-info">
            {{userInfo.areaCode}} {{getTel}}
          </div>
        </div>
        <div class="person-item">
          <div class="list-title">
            {{$t('personCenter.email')}}
            <span class="tips">{{$t('personCenter.emailTips')}}</span>
          </div>
          <div class="list-info">
            <span class="email">{{getEmail}}</span>
            <span :style="{marginLeft:'10px'}" class="operate" @click="openAuthModal(true)" v-if="!userInfo.emailAuthStatus">{{$t('personCenter.authen')}}</span>
            <img :src="authIcon" alt="" class="auth-icon" v-if="userInfo.emailAuthStatus">
          </div>
        </div>
      </div>
    </div>
    <div class="person-section">
      <div class="person-title">
        <img :src="safeIcon" alt class="icon" />
        <span class="text">{{$t('personCenter.passwordManage')}}</span>
      </div>
      <div class="person-list">
        <div class="person-item">
          <div class="list-title">
            {{$t('personCenter.loginPassword')}}
            <span class="tips">{{$t('personCenter.passwordTips')}}</span>
          </div>
          <div class="list-info">
            <div @click="openPwdModal(true)" class="operate">{{$t('personCenter.update')}}</div>
          </div>
        </div>
        <div class="person-item">
          <div class="list-title">
            {{$t('personCenter.payPassword')}}
            <span class="tips">{{$t('personCenter.payTips')}}</span>
          </div>
          <div class="list-info">
            <span @click="openPayModal(true)" class="operate">{{$t('personCenter.update')}}</span>
            <span class="divide"></span>
            <span @click="findPayHandle" class="operate">{{$t('personCenter.find')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="person-section">
      <div class="person-title">
        <img :src="personIcon" alt class="icon" />
        <span class="text">{{$t('personCenter.personSet')}}</span>
      </div>
      <div class="person-list">
        <div class="person-item">
          <div class="list-title">
            <span class="address-title">{{$t('personCenter.addressBook')}}</span>
            <span class="tips">{{$t('personCenter.addressTips')}}</span>
          </div>
          <div class="list-info">
            <span @click="openAddressModal(true)" class="operate">{{$t('personCenter.add')}}</span>
            <span class="divide"></span>
            <span @click="address" class="operate">{{$t('home.detail')}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 邮箱认证出层 -->
    <ModalMask
      :isShowModal="isShowAuthModal"
      :isHideMask="isHideAuthMask"
      @closeModal="closeAuthModal"
      @openModal="openAuthModal"
    >
      <template v-slot:body>
        <form class="email-mask">
          <div class="close">
            <span class="txt">{{$t('personCenter.emailAuth')}}</span>
            <span class="close-btn" @click="closeAuthModal(false)"></span>
          </div>
          <div class="tip-email">
            <img :src="tipsIcon" alt="" class="tips-icon">
            <span class="tip-txt">{{$t('personCenter.emailAuthTips')}}</span>
          </div>
          <p>{{$t('personCenter.emailAccount')}}</p>
          <div class="update-box">
            <input v-model="newEmail" class="enter-input" :placeholder="$t('personCenter.enterEmail')" />
            <!-- <div class="update-email" @click="updateEmail" v-if="newEmail !== userInfo.email">修改</div> :placeholder="userInfo.email" -->
          </div>
          <p>{{$t('personCenter.emailVertifyCode')}}</p>
          <div class="code">
            <VertifyCode
            class="email-vertify"
              :type="'2'"
              :vertifyContent="newEmail"
              :vertifyText="$t('personCenter.enterEmailCode')"
              :isVertifyExsit="isVertifyExsit"
              :value="code"
              v-model="code"
              :isClear="isClear"
            ></VertifyCode>
          </div>
          <div class="tips">{{$t('personCenter.emailReceiveTips')}}</div>
          <div class="confirm" @click="verify">{{$t('personCenter.confirm')}}</div>
        </form>
      </template>
    </ModalMask>
    <div class="title" v-if="isContactList">
      <div class="icon"></div>
      <div class="title-txt">联系人</div>
    </div>
    <div class="tip" v-if="isContactList">
      <span class="icon--1-2" style="margin-right:8px;margin-left:16px">
        <span class="path1"></span>
        <span class="path2"></span>
        <span class="path3"></span>
      </span>
      <span class="tip-txt">添加后，可以在提币时选择已添加的提现地址。</span>
    </div>
    <!-- 联系人列表 -->
    <ul class="contact-list" v-if="isContactList">
      <li class="contact-item" v-for="(contact,index) in contactList" :key="index">
        <div class="avatar">
          <img :src="contact.avatar" alt width="40px" height="40px" />
        </div>
        <div class="contact">
          <div class="name">{{contact.imUsername}}({{contact.firstName}}{{contact.lastName}})</div>
          <div class="transfer" @click="toTransfer">转账</div>
          <div class="delete" @click="deleteContact(contact.id, contact.imUsername)">删除</div>
          <div class="phone">邮箱账户：{{contact.email}}</div>
          <div class="phone">手机账户：{{contact.phone}}</div>
        </div>
      </li>
    </ul>
    <!-- 地址簿 -->
    <ModalMask
      :isShowModal="isAddressList"
      :isHideMask="isHideAddrListMask"
      @closeModal="closeAddrListModal"
      @openModal="openAddrListModal"
    >
      <template v-slot:body>
      <div class="modal-content-1">
        <div class="modal-head">
          <span class="modal-title">{{$t('personCenter.addressBook')}}</span>
          <span class="close-btn" @click="closeAddrListModal(false)"></span>
        </div>
        <div class="modal-body transfer-body">
          <div class="transfer-list" v-if="addressList.length">
            <div
              class="transfer-item"
              v-for="item in addressList"
              :key="item.id"
            >
            <div class="withdraw-pic">
              <img :src="item.url" alt class="" />
            </div>
            <div class="withdraw-right">
              <div class="detail">
                <span class="withdraw-type">{{item.comment}} ({{item.coinType}})</span>
                <span class="withdraw-code">{{$t("personCenter.address")}}:{{item.address}}</span>
              </div>
              <div class="handle">
                <icon @click="showDeleteModal(item.id)" name="del" class="del-btn" />
              </div>
              
            </div>
            </div>
          </div>
          <div class="data" v-else>
            {{$t('login.withoutData')}}
          </div>
        </div>
      </div>
      </template>
    </ModalMask>

    <ModalMask
      :isShowModal="isDeleteAddr"
      :isHideMask="isHideDeleteMask"
      @closeModal="closeAddrModal"
      @openModal="openAddrModal"
    >
      <template>
        <div></div>
      </template>
      <template v-slot:body>
      <div class="modal-content" :style="{padding: '40px', width:'461px'}">
        <div class="modal-body">
          <div class="delete-tips">
            <icon name="warn" class="warn-icon" />
            <span class="warn-text">{{$t("personCenter.confirm")}}{{$t('home.delete')}} ?</span> 
          </div>
          <div class="button-box">
            <span class="confirm" @click="closeAddrModal">{{$t("account.cancel")}}</span>
            <span class="cancel" @click="deleteAddr(addressId)">{{$t("account.confirm")}}</span>
          </div>
        </div>
      </div>
      </template>
    </ModalMask>

    <!-- 修改密码弹出层 -->
    <ModalMask
      :isShowModal="isShowPwdModal"
      :isHideMask="isHidePwdMask"
      @closeModal="closePwdModal"
      @openModal="openPwdModal"
    >
      <template v-slot:body>
        <form class="pwd-mask">
          <div class="close">
            <span class="txt">{{$t('personCenter.updatePwd')}}</span>
            <span class="close-btn" @click="closePwdModal(false)"></span>
          </div>
          <div class="pwd-tip">
            <img :src="tipsIcon" alt="" class="tips-icon">
            <span class="tip-txt">{{$t('personCenter.updatePwdTips')}}</span>
          </div>
          <p>{{$t('personCenter.loginPwd')}}</p>
          <input type="password" :placeholder="$t('customError.loginPwd')" v-model="oldPwd" />
          <p>{{$t('personCenter.newLoginPwd')}}</p>
          <input type="password" :placeholder="$t('customError.newLoginPwd')" v-model="newPwd" />
          <p>{{$t('personCenter.confirmNewPwd')}}</p>
          <input type="password" :placeholder="$t('customError.againNewLoginPwd')" v-model="newPwdd" />
          <div class="confirm" @click="confirmLoginPassword">{{$t('personCenter.confirm')}}</div>
        </form>
      </template>
    </ModalMask>
    <!-- 支付密码弹出层 -->
    <ModalMask
      :isShowModal="isShowPayModal"
      :isHideMask="isHidePayMask"
      @closeModal="closePayModal"
      @openModal="openPayModal"
    >
      <template v-slot:body>
        <form class="pay-mask">
          <div class="close">
            <span class="txt">{{$t('personCenter.updatePayPwd')}}</span>
            <span class="close-btn" @click="openPayModal(false)"></span>
          </div>
          <div class="center" v-show="!yes">
            <div class="center-tip">
              <img :src="tipsIcon" alt="" class="tips-icon">
              <span class="tip-txt">{{$t('personCenter.payPwdTips')}}</span>
            </div>
            <p>{{$t('personCenter.payPwd')}}</p>
            <input type="password" :placeholder="$t('customError.oldPayPwd')" v-model="oldPay" class="enter-input" />
            <p>{{$t('personCenter.newPayPwd')}}</p>
            <input type="password" :placeholder="$t('customError.newPayPwd')" v-model="newPay" class="enter-input" />
            <p>{{$t('personCenter.confirmPayPwd')}}</p>
            <input type="password" :placeholder="$t('customError.againNewPayPwd')" v-model="newPayy" class="enter-input" />
            <div class="email-code" v-show="vertifyType === '1'">
              <p>{{$t('personCenter.emailVertifyCode')}}</p>
              <VertifyCode
                :type="'2'"
                :vertifyContent="userInfo.email"
                :vertifyText="$t('customError.'+placehode)"
                :value="emailCode"
                v-model="emailCode"
                :isClear="isClear"
              ></VertifyCode>
            </div>
            <div class="tel-code" v-show="vertifyType === '2'">
              <p>{{$t('personCenter.telVertifyCode')}}</p>
              <VertifyCode
                :type="'1'"
                :vertifyContent="userInfo.phone"
                :areaCode="areaCode"
                :vertifyText="$t('customError.'+placehode)"
                :value="telCode"
                v-model="telCode"
                :isClear="isClear"
              ></VertifyCode>
            </div>
            <div class="switch-vertify" @click="switchVertify">{{$t('customError.'+vertifyTypeText)}}</div>
            <div class="confirm" @click="confirmPay">{{$t('personCenter.confirm')}}</div>
          </div>
          <div class="yes" v-show="yes">
            <div class="icon">
              <img src="../../assets/imgs/yes.png" alt />
            </div>
          </div>
        </form>
      </template>
    </ModalMask>

    <ModalMask
      :isShowModal="isShowFindPayModal"
      :isHideMask="isHideFindPayMask"
      @closeModal="closeFindPayModal"
      @openModal="openFindPayModal"
    >
      <template v-slot:body>
        <div class="modal-content">
          <div class="modal-title">
            {{$t('personCenter.findPayPwd')}}
            <span class="close-btn" @click="closeFindPayModal(false)"></span>
          </div>
          <div class="safe-tips">
            <img :src="tipsIcon" alt="" class="tips-icon">
            <span class="safe-text">{{$t('personCenter.findPayPwdTips')}}</span>
          </div>
          <div class="find-pay-step" v-show="stepNum === 1">
            <div class="modal-phone">{{$t('personCenter.tel')}}</div>
            <div class="select-phone disabled">
              <!-- <Dropdown
                :flagList="flagList"
                :isShow="isShowCountryList"
                :areaFlag="userInfo.areaFlag"
                :areaCode="userInfo.areaCode"
                @selectCountry="selectCountry"
                @changeFlagCode="changeFlagCode"
              ></Dropdown> -->
              <img :src="userInfo.areaFlag" alt="" class="area-flag">
              <span class="area-code">{{userInfo.areaCode}}</span>
              <input
                type="text"
                :placeholder="$t('customError.telTips')"
                v-model="userInfo.phone"
                class="tel-input disabled"
                :style="{marginLeft: '6px'}"
              />
            </div>

            <div class="vertify-code">{{$t('personCenter.telVertifyCode')}}</div>
            <VertifyCode
              :type="'1'"
              :vertifyContent="userInfo.phone"
              :areaCode="userInfo.areaCode"
              :vertifyText="$t('customError.'+findPayTelPlacehode)"
              :value="findPayTelCode"
              v-model="findPayTelCode"
              :isClear="isClear"
            ></VertifyCode>
            <a href="javascript:;" class="confirm-button" @click="vertifyTelCode">{{$t('personCenter.confirm')}}</a>
          </div>

          <div class="find-pay-step" v-show="stepNum === 2">
            <div class="vertify-code">{{$t('personCenter.emailAccount')}}</div>
            <div class>
              <input
                type="text"
                :placeholder="$t('customError.emailTips')"
                v-model="userInfo.email"
                :class="['tel-input', 'disabled']"
                :style="{width : '100%'}"
              />
            </div>

            <div class="vertify-code">{{$t('personCenter.emailVertifyCode')}}</div>
            <VertifyCode
              :type="'2'"
              :vertifyContent="userInfo.email"
              :vertifyText="$t('customError.'+findPayEmailPlacehode)"
              :value="findPayEmailCode"
              v-model="findPayEmailCode"
            ></VertifyCode>
            <a href="javascript:;" class="confirm-button" @click="vertifyEmailCode">{{$t('personCenter.confirm')}}</a>
          </div>

          <div class="find-pay-step" v-show="stepNum === 3">
            <div class="vertify-code">{{$t('personCenter.newPayPwd')}}</div>
            <div class>
              <input
                type="password"
                :placeholder="$t('customError.newPayPwd')"
                v-model="newPayPassword"
                class="tel-input"
                :style="{width : '100%'}"
              />
            </div>

            <div class="vertify-code">{{$t('personCenter.confirmPayPwd')}}</div>
            <div class>
              <input
                type="password"
                :placeholder="$t('customError.againNewPayPwd')"
                v-model="confirmPayPassword"
                class="tel-input"
                :style="{width : '100%'}"
              />
            </div>
            <a href="javascript:;" class="confirm-button" @click="findPayPassword">{{$t('personCenter.confirm')}}</a>
          </div>
        </div>
      </template>
    </ModalMask>
    <!-- 添加地址簿 -->
    <ModalMask
      :isShowModal="isShowAddressModal"
      :isHideMask="isHideAddressMask"
      @closeModal="closeAddressModal"
      @openModal="openAddressModal"
    >
      <template v-slot:body>
        <div class="modal-content">
          <div class="modal-title">
            <div>{{$t('personCenter.addAddress')}}</div>
            <span class="close-btn" @click="closeAddressModal(false)"></span>
          </div>

          <div class="modal-label">{{$t('personCenter.coin')}}</div>
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

          <div v-show="isShowChain">
            <div class="modal-label">{{$t('personCenter.chain')}}</div>
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

          <div class="modal-label">{{$t('personCenter.coinAddress')}}({{$t('personCenter.required')}})</div>
          <div class>
            <input type="text" :placeholder="$t('personCenter.enterCoinAddress')" class="input-style" v-model.trim="withdrawAddress" @blur="vertifyAddr" />
            <div class="addr-tips">{{addressTips}}</div>
          </div>

          <div class="modal-label">{{$t('personCenter.mark')}}({{$t('personCenter.required')}})</div>
          <div>
            <input type="text" :placeholder="$t('personCenter.enterMark')" class="input-style" v-model.trim="remarks" />
          </div>
          <div class="modal-confirm" @click="addAddress">{{$t('personCenter.confirm')}}</div>
        </div>
      </template>
    </ModalMask>
  </div>
</template>

<script>
import PersonalData from "../components/PersonalData";
import '@/icons/del';
import '@/icons/warn';
import '@/icons/auth'
import {
  fetchAddressList,
  fetchContactList,
  deleteAddress,
  deleteContact
} from "../../api/request";
import axios from "../../api/request";
import ModalMask from "../components/ModalMask";
import { fetchCountry } from "../../api/request";
import Dropdown from "../components/Dropdown";
import VertifyCode from "../components/VertifyCode";
import { formatEmail }from "../../filters.js"
import { mapGetters, mapState, mapActions } from "vuex";
import { vertify } from "@/mixins/vertifyAddr.js"
export default {
  mixins: [vertify],
  data() {
    return {
      authIcon: require("@/assets/person/auth_icon_20200901.png"),
      tipsIcon: require("../../assets/login/tips_icon_20200730.png"),
      isVertifyExsit: true,
      identifyIcon: require("../../assets/person/identify_icon_20200710.png"),
      safeIcon: require("../../assets/person/safe_icon_20200710.png"),
      personIcon: require("../../assets/person/person_icon_20200710.png"),
      isShowFindPayModal: false,
      isHideFindPayMask: true,
      checkCoin: "USDT", // 选中的币种
      checkChain: "ERC20", // 选中的链名称
      coin: "USDT-ERC20", // 币种名称(checkCoin+checkChain)
      withdrawAddress: "", // 提币地址
      remarks: "", // 备注
      isShowChain: true, // 显示链名称
      coinIndex: 1,
      chainIndex: 1,
      addressTips:　"", // 验证地址提示
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
      coinAvatat: "", // 币种 icon
      isShowAddressModal: false,
      isHideAddressMask: false,
      isHideAuthMask: true,
      isShowAuthModal: false,
      email: "",
      code: "", //验证码
      newEmail: "", //修改后的邮箱
      contactList: [],
      isContactList: false, //显示联系人列表
      isShow: true,
      computeTime: 0,
      sex: "", //性别
      areaCode: "",
      addressList: [], //地址簿
      isAddressList: false,
      isHideAddrListMask: false,
      activeDisplay: "block",
      loading: false,

      isShowPwdModal: false,
      isHidePwdMask: true,
      isShowPayModal: false,
      isHidePayMask: true,

      oldPwd: "",
      newPwd: "",
      newPwdd: "",
      oldPay: "",
      newPay: "",
      newPayy: "",
      yes: false,
      tel: "",
      count: 0,
      countText: "sendVertifyCode",
      isCalc: false, // 正在倒计时
      flagList: [], // 国家国旗
      areaCode: "0086", //国家区号
      telVertifyCode: "", // 验证码
      isShowCountryList: false,
      authPlacehode: "enterEmailCode", // 验证邮箱验证码提示
      emailCode: "", // 修改支付邮箱验证码
      telCode: "", // 修改支付手机验证码
      vertifyType: "2", // 验证方式 1、邮箱 2、短信
      vertifyTypeText: "emailVertifyWay",
      findPayTel: "", // 找回支付密码手机
      findPayTelPlacehode: "telVertifyCodeTips", // 找回支付手机提示
      findPayTelCode: "", // 找回支付手机验证码
      isClear: false,
      findPayEmail: "", // 找回支付密码邮箱
      findPayEmailPlacehode: "emailVertifyCodeTips", // 找回支付邮箱提示
      findPayEmailCode: "", // 找回支付邮箱验证码
      newPayPassword: "", // 支付新密码
      confirmPayPassword: "", // 确认支付新密码
      token: "", // 找回密码token
      stepNum: 1, // 找回支付流程
      placehode: "telVertifyCodeTips",
      isShowAddressList: false,
      isHideDeleteMask: false,
      isDeleteAddr: false,
    };
  },
  components: {
    PersonalData,
    Dropdown,
    ModalMask,
    VertifyCode
  },
  computed: {
    ...mapState({
      userInfo: "userInfo"
    }),
    ...mapGetters(["getLanguage", "getTel"]),
    getEmail() {
      return formatEmail(this.userInfo.email);
    }
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    input(val) {
      this.findPayTelCode = val;
    },
    switchVertify() {
      if (this.vertifyType === "1") {
        this.placehode = 'telVertifyCodeTips';
        this.vertifyTypeText = 'emailVertifyWay';
        this.vertifyType = "2";
      } else {
        if (!this.userInfo.emailAuthStatus) {
          return this.$Message.error(this.$t('customError.completeEmailAuth'));
        }
        this.placehode = 'emailVertifyCodeTips';
        this.vertifyTypeText = 'telVertifyWay';
        this.vertifyType = "1";
      }
    },

    // 删除地址弹框
    showDeleteModal(id) {
      this.addressId = id;
      this.isDeleteAddr = true;
      this.isHideDeleteMask = false;
    },
    // 找回支付密码
    findPayHandle() {
      if(!this.userInfo.emailAuthStatus) return this.$Message.error(this.$t('customError.completeEmailAuth'));
      this.openFindPayModal(true);
    },
    // 选择 coin
    selectCoin(id, name) {
      this.coinIndex = id;
      this.checkCoin = name;
      if (id > 1) {
        this.isShowChain = false;
        this.coin = name;
      } else {
        this.isShowChain = true;
        this.chainName = 'USDT-ECR20';
        this.chainIndex = id;
        this.coin = `${name}-ECR20`;
      }
    },
    // 选择 chain
    selectChain(id, name) {
      let { checkCoin } = this;
      this.chainIndex = id;
      this.checkChain = name;
      this.coin = `${checkCoin}-${name}`;
    },
    closeAddressModal(a) {
      this.isShowAddressModal = a;
      this.isHideAddressMask = true;
      
      this.checkCoin = 'USDT';
      this.checkChain = 'ECR20';
      this.addressTips = "";
    },
    openAddressModal(a) {
      let { checkCoin, checkChain } = this;
      this.isShowAddressModal = a;
      this.isHideAddressMask = false;
      this.isShowChain = true;
      this.coinIndex = 1;
      this.chainIndex = 1;
      this.withdrawAddress = "";
      this.remarks = "";
    },

    closeAuthModal(a) {
      this.isShowAuthModal = a;
      this.isHideAuthMask = true;
      this.isClear = false;
    },
    openAuthModal(a) {
      this.isShowAuthModal = a;
      this.isHideAuthMask = false;
      this.newEmail = "";
      this.isClear = true;
    },
    //展示地址列表
    showAddressList(){
      this.isShowAddressList = true;
    },

    // 校验邮箱是否存在
    async reviseEmail() {
      if (!this.newEmail.trim()) {
        return this.$Message.error(this.$t('customError.emailTips'));
      }
      const params = {
        email: this.newEmail
      };

      const res = await axios.isExistEmail(params);

      if (res.code === 0) {
        if (!res.data.success) {
          this.$Message.error(this.$t('customError.notExistEmail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },

    // 修改邮箱
    async updateEmail() {
      if (!this.newEmail.trim()) return this.$Message.error(this.$t('customError.emailTips'));

      const params = {
        email: this.newEmail
      };

      const res = await axios.updateEmail(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.success(this.$t('customError.updateSuccess'));
        } else {
          this.$Message.error(this.$t('customError.updateFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 验证邮箱
    async verify() {
      if (!this.newEmail.trim()) {
        this.$Message.error(this.$t('customError.emailTips'));
        return;
      }
      if (!this.code.trim()) {
        this.$Message.error(this.$t('customError.telVertifyCodeTips'));
        return;
      }
      const params = {
        email: this.newEmail,
        code: this.code
      };

      const res = await axios.vertifyEmail(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.info(this.$t('customError.authSuccess'));
          this.openAuthModal(false);
          const params = {};
          this.getUserInfo();
        } else {
          this.$Message.error(this.$t('customError.authFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    //联系人
    async contact(name) {
      this.isContactList = true;
      this.isShow = false;

      const params = {};
      this.loading = true;
      const res = await fetchContactList(params);
      this.loading = false;

      if (res.code === 0) {
        this.contactList = res.data.map(item => {
          return {
            id: item.id,
            avatar: item.avatar,
            email: item.email,
            phone: item.phone,
            imUsername: item.imUsername,
            firstName: "*",
            lastName: item.lastName
          };
        });
      } else {
        this.$Message.error(res.msg);
      }
    },
    //删除联系人
    deleteContact(id, name) {
      this.$confirm({
        content: this.$t("home.delete")+name+'？',
        yesBtnText: this.$t("personCenter.confirm"),
        cancelBtnText: this.$t("personCenter.cancel")
      }).then(async () => {
          const params = { id };
          const res = await deleteContact(params);

          if (res.code === 0) {
            this.$Message.success( this.$t("home.delete") + '' + this.$t("home.success") );
          } else {
            this.$Message.error(res.msg);
          }
        });
    },
    //地址簿
    async address() {
      this.isAddressList = true;
      this.isShow = false;
      const params = {
        rows: 10,
        page: 1
      };

      this.loading = true;
      let res = await fetchAddressList(params);
      this.loading = false;

      if (res.code === 0) {
        this.addressList = res.data.map(item => {
          return {
            id: item.id,
            url: item.icon,
            address: item.address,
            coinType: item.coin,
            comment: item.comment // 备注
          };
        });
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 删除地址
    async deleteAddr(id) {
      let params = { id };
      const res = await deleteAddress(params);

      if (res.code === 0) {
        this.closeAddrModal();
        this.address();
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 转账
    toTransfer() {
      this.$router.push("/console/asset/transfer");
    },
    // 提现
    transfer() {
      this.$router.push("/console/asset/withdraw");
    },
    closeFindPayModal(show) {
      this.isShowFindPayModal = show;
      this.isHideFindPayMask = true;
      this.findPayTelCode = "";
      this.isClear = true;
    },
    openFindPayModal(show) {
      this.isShowFindPayModal = show;
      this.isHideFindPayMask = false;
      this.stepNum = 1;
      this.isShowCountryList = false;
      this.tel = "";
      this.findPayTelCode = "";
      this.findPayEmail = "";
      this.findPayEmailCode = "";
      this.newPayPassword = "";
      this.confirmPayPassword = "";
      this.isClear = false;
    },
    closePwdModal(isShow) {
      this.isShowPwdModal = isShow;
      this.isHidePwdMask = true;
    },
    openPwdModal(isShow) {
      this.isShowPwdModal = isShow;
      this.isHidePwdMask = false;
      this.newPwd = "";
      this.oldPwd = "";
      this.newPwdd = "";
    },
    closePayModal(isShow) {
      this.isShowPayModal = isShow;
      this.isHidePayMask = true;
      this.isClear = false;
    },
    openPayModal(isShow) {
      this.isShowPayModal = isShow;
      this.isHidePayMask = false;
      this.newPay = "";
      this.newPayy = "";
      this.oldPay = "";
      this.emailCode = "";
      this.telCode = "";
      this.isClear = true;
    },
    // 修改登录密码
    async confirmLoginPassword() {
      if (!this.oldPwd) {
        this.$Message.error(this.$t('customError.loginPwd'));
        return;
      }
      else if (!this.newPwd) {
        this.$Message.error(this.$t('customError.newLoginPwd'));
        return;
      }
      else if (!this.newPwdd) {
        this.$Message.error(this.$t('customError.againNewLoginPwd'));
        return;
      }
      else if( 6 > this.oldPwd.length || this.oldPwd.length > 16) {
        return this.$Message.error(this.$t('customError.pwdLength'));
      }
      else if( 6 > this.newPwd.length || this.newPwd.length > 16) {
        return this.$Message.error(this.$t('customError.pwdLength'));
      }
      else if( 6 > this.newPwdd.length || this.newPwdd.length > 16) {
        return this.$Message.error(this.$t('customError.pwdLength'));
      }
      else if (this.newPwd !== this.newPwdd) {
        this.$Message.error(this.$t('customError.pwdDiff'));
        return;
      }
      const params = {
        oldPwd: this.oldPwd,
        newPwd: this.newPwdd
      };
      
      const res = await axios.updateLoginPassword(params);

      if (res.code === 0) {
        let { success } = res.data;
        if (success) {
          this.$Message.success(this.$t('customError.updateSuccess'));
          this.openPwdModal(false);
          this.$router.push('/');
        } else {
          this.$Message.error(this.$t('customError.updateFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },

    // 找回支付密码
    async findPayPassword() {
      if (!this.newPayPassword.trim())
        return this.$Message.error(this.$t('customError.payPwd'));
      if (!this.confirmPayPassword.trim())
        return this.$Message.error(this.$t('customError.againPayPwd'));
      if (this.newPayPassword !== this.confirmPayPassword)
        return this.$Message.error(this.$t('customError.pwdDiff'));

      const params = {
        token: this.token,
        payPwd: this.newPayPassword
      };

      const res = await axios.resetPayPassword(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.openFindPayModal(false);

          this.$Message.success(this.$t('customError.findPayPwdSuccess'));
        } else {
          this.$Message.error(this.$t('customError.findPayPwdFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 修改支付密码
    async confirmPay() {
      if (this.oldPay == "") {
        this.$Message.error(this.$t('customError.oldPayPwd'));
        return;
      }
      if (this.newPay == "") {
        this.$Message.error(this.$t('customError.newPayPwd'));
        return;
      }
      if (this.newPayy == "") {
        this.$Message.error(this.$t('customError.againNewPayPwd'));
        return;
      }
      if (this.newPay !== this.newPayy) {
        this.$Message.error(this.$t('customError.payPwdDiff'));
        return;
      }
      let code = "";
      let type = +this.vertifyType;
      if (this.vertifyType === "1") {
        code = this.emailCode;
      } else {
        code = this.telCode;
      }

      const params = {
        oldPwd: this.oldPay,
        newPwd: this.newPayy,
        code: code,
        type: type
      };

      const res = await axios.updatePayPassword(params);

      if (res.code === 0) {
        let { success } = res.data;
        if (success) {
          this.$Message.success(this.$t('customError.updateSuccess'));
          this.openPayModal(false);
        } else {
          this.$Message.error(this.$t('customError.updateFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    getFlags() {
      const res = fetchCountry();

      this.flagList = res;
    },
    selectCountry(show) {
      this.isShowCountryList = false;
    },
    changeFlagCode(code, show) {
      this.areaCode = code;
      this.isShowCountryList = show;
    },
    // 发送验证码
    async sendVertifyCode() {
      if (!this.tel) {
        return this.$Message.error(this.$t('customError.telTips'));
      }
      // if (!/^1[\d]{10}$/.test(this.tel)) {
      //   return this.$Message.error(this.$t('customError.telRuleTips'));
      // }

      if (this.isCalc) return;
      this.isCalc = true;
      this.count = 60;

      const params = {
        areaCode: this.areaCode,
        phone: this.tel,
        languageCode: this.getLanguage,
        authType: "SMS_105240036",
        smsBusinessType: 3,
        device: 1
      };

      const res = await axios.sendVerifyCode(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.success(this.$t('customError.sendSuccess'));
          let timer = setInterval(() => {
            if (this.count <= 0) {
              this.countText = this.$t('customError.againSend');
              this.isCalc = false;
              clearInterval(timer);
              return;
            }
            this.countText = this.count + "s";
            this.count--;
          }, 1000);
        } else {
          this.$Message.error(this.$t('customError.sendFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 发送支付手机验证码
    sendTelCode(tel) {
      if (!tel) {
        return this.$Message.error(this.$t('customError.telTips'));
      }
      // if (!/^1[\d]{10}$/.test(tel)) {
      //   return this.$Message.error(this.$t('customError.telRuleTips'));
      // }

      if (this.isCalc) return;
      this.isCalc = true;
      this.count = 60;

      const params = {
        areaCode: this.areaCode,
        phone: tel,
        languageCode: this.getLanguage,
        authType: "SMS_105240036",
        smsBusinessType: 3,
        device: 1
      };

      const res = axios.sendVerifyCode(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.success(this.$t('customError.sendSuccess'));
          let timer = setInterval(() => {
            if (this.count <= 0) {
              this.countText = this.$t('customError.againSend');
              this.isCalc = false;
              clearInterval(timer);
              return;
            }
            this.countText = this.count + "s";
            this.count--;
          }, 1000);
        } else {
          this.$Message.error(this.$t('customError.sendFail'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 验证手机验证码
    async vertifyTelCode() {
      if (!this.userInfo.phone.trim())
        return this.$Message.error(this.$t('customError.telTips'));
      if (!this.findPayTelCode.trim())
        return this.$Message.error(this.$t('customError.telVertifyCodeTips'));

      const params = {
        areaCode: this.userInfo.areaCode,
        phone: this.userInfo.phone,
        code: this.findPayTelCode
      };

      const res = await axios.vertifyPayTel(params);

      if (res.code === 0) {
        const { token } = res.data;
        this.stepNum++;
        this.token = token;
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 验证邮箱验证码
    async vertifyEmailCode() {
      if (!this.userInfo.email.trim()) return this.$Message.error(this.$t('customError.emailTips'));
      if (!this.findPayEmailCode.trim())
        return this.$Message.error(this.$t('customError.emailVertifyCodeTips'));

      const params = {
        code: this.findPayEmailCode,
        email: this.userInfo.email,
        token: this.token
      };

      const res = await axios.vertifyPayEmail(params);

      if (res.code === 0) {
        const { token } = res.data;
        this.stepNum++;
        this.token = token;
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 添加钱包地址
    async addAddress() {
      const { checkCoin, checkChain, withdrawAddress, remarks } = this;
      let coin = "";

      if (!withdrawAddress) return this.$Message.error(this.$t('customError.coinAddressTips'));
      if (!remarks) return this.$Message.error(this.$t('customError.remarksTips'));
      if (checkCoin === "USDT") {
        coin = checkCoin + "-" + checkChain;
      } else {
        coin = checkCoin;
      }

      const params = {
        coin: coin,
        address: withdrawAddress,
        comment: remarks
      };

      const res = await axios.addWalletAddr(params);

      if (res.code === 0) {
        let { success } = res.data;
        if (success) {
          this.openAddressModal(false);
          this.getUserInfo();
          this.$Message.success(this.$t('customError.addSuccess'));
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    closeAddrModal() {
      this.isDeleteAddr = false;
      this.isHideDeleteMask = true;
    },
    openAddrModal() {
      this.isDeleteAddr = false;
      this.isHideDeleteMask = false;
    },
   
    closeAddrListModal(a) {
      this.isAddressList = a;
      this.isHideAddrListMask = true;
    },
    openAddrListModal() {
      this.isAddressList = false;
      this.isHideAddrListMask = false;
    }
  },
  mounted() {
    this.getFlags();
    this.newEmail = this.userInfo.email;
  }
};
</script>
<style scoped lang='scss'>
.tips-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  margin-top: 3px;
}
.tip-email, .pwd-tip, .center-tip, .safe-tips {
  display: flex;
}
.delete-tips {
  position: relative;
  font-size: 17px;
  color: #000;
  font-weight: 500;
  margin-top: 10px;
  .warn-icon {
    position: absolute;
    top: -2px;
    left: 0;
    width: 24px;
    height: 24px;
    fill: #FFBF00;
  }
  .warn-text {
    margin-left: 30px;
  }
}
.button-box {
  text-align: right;
  margin-top: 44px;
  .confirm {
    border: 1px solid #D9D9D9;
    color: #000;
    font-size: 14px;
    transition: all .2s ease-in;
    &:hover {
      background: #F6F6F6;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
    }
  }
  .cancel {
    border: 1px solid #3674d7;
    background: #3674d7;
    color: #fff;
    transition: all .2s ease-in;
    &:hover {
      background: #175491;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
    }
  }
  .confirm, .cancel {
    display: inline-block;
    padding: 6px 15px;
    border-radius: 4px;
    margin-left: 8px;
    cursor: pointer;
  }
}
// .mine {
//   min-height: 100vh;
//   padding-top: 20px;
//   width: 1330px;
//   margin: 0 auto;
  .tip {
    height: 40px;
    background: rgba(254, 252, 235, 1);
    line-height: 40px;
    margin: 8px 0 8px 40px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(104, 114, 146, 1);
  }
  .contact-list {
    border: 1px solid rgba(240, 240, 240, 1);
    margin: 8px 0 40px 40px;
    padding-left: 44px;

    .contact-item {
      border-bottom: 1px solid rgba(240, 240, 240, 1);
      height: 53px;

      .avatar {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        float: left;
        margin-right: 50px;
        margin-top: -14px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }

      .contact {
        margin-top: 35px;

        .name {
          float: left;
          width: 200px;
          height: 12px;
          font-size: 14px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 12px;
        }

        .transfer {
          width: 80px;
          height: 32px;
          background: rgba(243, 248, 255, 1);
          border-radius: 4px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: rgba(54, 116, 215, 1);
          cursor: pointer;
          float: right;
          margin-right: 23px;
          margin-top: -8px;
        }

        .delete {
          float: right;
          height: 16px;
          font-size: 14px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: rgba(255, 104, 89, 1);
          line-height: 16px;
          cursor: pointer;
          margin-right: 56px;
        }

        .phone {
          height: 14px;
          font-size: 14px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 14px;
          float: left;
          width: 250px;
          margin-left: 50px;
        }
      }
    }
  }

  .email-mask {
    width: 515px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
    border-radius: 4px;
    filter: blur(0px);
    padding: 24px 26px 32px 24px;

    .confirm {
      width: 100%;
      height: 48px;
      background: rgba(54, 116, 215, 1);
      border-radius: 4px;
      font-size: 17px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 48px;
      text-align: center;
      margin-top: 40px;
      cursor: pointer;
    }

    p {
      height: 16px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 16px;
      margin-top: 25px;
      margin-bottom: 8px;
    }
    .tips {
      margin-top: 8px;
      margin-bottom: 0;
      color: #aeb7c4;
      font-size: 12px;
    }

    .enter-input {
      width: 100%;
      padding: 7px 10px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      padding-left: 11px;
      &:focus {
        border: 1px solid #3674d7;
      }
      &::placeholder {
        font-size: 14px;
        color: rgba(204, 204, 204, 1);
      }
    }

    .code {
      height: 36px;

      .sms {
        width: 306px;
        float: left;
      }

      .send {
        width: 98px;
        height: 36px;
        border-radius: 2px;
        border: 1px solid rgba(54, 116, 215, 1);
        float: left;
        color: rgba(54, 116, 215, 1);
        line-height: 36px;
        text-align: center;
        margin-left: 24px;
        cursor: pointer;
      }
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);

      .icon--copy4 {
        display: none;
        cursor: pointer;
      }
    }

    .tip-email {
      padding: 12px 18px;
      margin-top: 24px;
      width: 100%;
      background: rgba(254, 252, 235, 1);
      border: 1px solid rgba(245, 219, 179, 1);

      .icon--1-2 {
        margin-left: 18px;
        margin-right: 13px;
      }

      .tip-txt {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(104, 114, 146, 1);
      }
    }
    .update-box {
      position: relative;
      .update-email {
        position: absolute;
        top: 10px;
        right: 16px;
        cursor: pointer;
        color: #3674d7;
        font-weight: 400;
      }
    }
  }
  .person-section {
    border-radius: 4px;
    margin: 0 30px 16px 30px;
  }
  .person-title {
    padding: 17px 64px;
    font-size: 18px;
    color: #62697f;
    background: #fff;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
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
  .person-list {
    background: #fff;
    border-top: 1px solid #f0f0f0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    .person-item {
      display: flex;
      justify-content: space-between;
      padding: 26px 0;
      margin-left: 64px;
      border-bottom: 1px solid #f0f0f0;
      &:last-child {
        border:0;
      }
      .list-title {
        font-size: 14px;
        color: #333;
        .tips {
          margin-left: 56px;
          font-size: 14px;
          color: #aaa;
        }
        .address-title {
          display: inline-block;
          width: 62px;
        }
      }
      .list-info {
        padding-right: 64px;
        font-size: 14px;
        color: #777;
        font-weight: 400;
        .auth-icon {
          width: 15px;
          height: 15px;
          margin-left: 5px;
          fill:#3674D7;
          vertical-align: middle;
        }
        .operate {
          color: #3674D7;
          font-size: 14px;
          cursor: pointer;
        }
        .divide {
          display: inline-block;
          width: 1px;
          height: 10px;
          background: #ccc;
          border-radius: 1px;
          opacity: 0.3;
          margin: 0 14px;
        }
        .email {
          vertical-align: middle;
        }
      }
    }
  }
  
  .pwd {
    border-top: 1px solid rgba(240, 240, 240, 1);
    margin: 0 30px 24px 30px;
    padding-left: 55px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
  }
// }
.title-icon {
  margin: 22px 10px 23px 55px;
  float: left;
  .identify-icon,
  .safe-icon,
  .person-icon {
    width: 18px;
    height: 18px;
  }
}

.modal-content {
  width: 515px;
  padding: 23px 26px 32px;
}
.modal-title {
  display: flex;
  justify-content: space-between;
  font-weight: 400;
  color: #333;
  font-size: 20px;
  .close-btn {
    cursor: pointer;
  }
}
.modal-label {
  margin-top: 32px;
  font-size: 12px;
  color: #666;
}
.addr-tips {
  margin-top: 5px;
}
.coin-list {
  justify-content: flex-start;
}
.coin-list .coin-item, .chain-list .chain-item {
  margin-top: 7px;
  border-radius: 4px;
}
// .coin-list {
//   display: flex;
//   // justify-content: space-between;
//   margin-top: 15px;
//   .coin-item {
//     display: inline-block;
//     padding: 8px 10px;
//     background: #f9f7fd;
//     border-radius: 2px;
//     text-align: center;
//     cursor: pointer;
//     margin-right: 70px;
//     &:last-child {
//       margin-right: 0;
//     }
//     .coin-avatar {
//       width: 24px;
//       height: 24px;
//     }
//     .coin-name {
//       display: inline-block;
//       vertical-align: middle;
//       color: #333;
//       font-size: 16px;
//       font-weight: bold;
//       margin-left: 8px;
//     }
//     .text-active {
//       color: #3674d7;
//     }
//   }
//   .active {
//     border: 1px solid #3674d7;
//     box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
//     background: url("../../assets/person/check_icon_20200624.png") no-repeat
//       right bottom;
//     background-size: 16px 12px;
//   }
// }
// .chain-list {
//   display: flex;
//   margin-top: 15px;
//   .chain-item {
//     display: inline-block;
//     padding: 6px 12px;
//     background: #f7f6fb;
//     color: #222;
//     font-size: 16px;
//     cursor: pointer;
//     margin-right: 48px;
//   }
//   .active {
//     border: 1px solid #3674d7;
//     box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
//     background: url("../../assets/person/check_icon_20200624.png") no-repeat
//       right bottom;
//     background-size: 16px 12px;
//   }
// }
.input-style {
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 7px;
  border: 1px solid #dfe2e7;
  padding: 7px 10px;
  font-size: 14px;
  color: #333;
  &:focus {
    border: 1px solid #3674D7;
  }
  &::placeholder {
    font-size: 14px;
    color: rgba(204, 204, 204, 1);
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

.safe-tips {
  width: 100%;
  margin-top: 26px;
  padding: 12px 18px;
  background: #fefceb;
  border: 1px solid #f5dbb3;
  color: #687292;
  font-size: 12px;
  text-align: left;
}
.modal-phone {
  color: #666;
  font-size: 12px;
  margin-left: 72px;
  margin-top: 25px;
  margin-bottom: 7px;
}
.select-phone {
  display: flex;
  align-items: center;
  .area-flag {
    width: 20px;
    height: 13px;
  }
  .area-code {
    vertical-align: middle;
    font-size: 16px;
    color: #666;
    margin-left: 6px;
  }
}
.vertify-code {
  margin-top: 25px;
  margin-bottom: 7px;
  font-size: 12px;
  color: #666;
}
.vertify-code-input,
.tel-input {
  outline: none;
  flex: 1;
  border: 1px solid #dfe2e7;
  border-radius: 2px;
  font-size: 14px;
  color: #333;
  padding: 7px 10px;
  &:focus {
    border: 1px solid #3674d7;
  }
  &::placeholder {
    font-size: 14px;
    color: rgba(204, 204, 204, 1);
  }
}

.send-code {
  width: 100px;
  display: inline-block;
  padding: 7px 10px;
  text-align: center;
  color: #3674d7;
  font-size: 14px;
  border: 1px solid #3674d7;
  border-radius: 2px;
  margin-left: 22px;
  &:hover {
    text-decoration: none !important;
    color: #3674d7;
    border: 1px solid #3674d7;
  }
}
.disabled {
  pointer-events: none;
  cursor: not-allowed;
}
.confirm-button {
  display: block;
  margin-top: 40px;
  padding: 11px 0;
  text-align: center;
  color: #fff;
  font-size: 17px;
  background: #3674d7;
  border-radius: 4px;
  transition: all 0.2s ease-in;
  &:hover {
    color: #fff;
    text-decoration: none !important;
  }
}

.mine {
  .pay-mask {
    width: 515px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
    border-radius: 4px;
    filter: blur(0px);
    padding: 24px 26px 32px 24px;

    .switch-vertify {
      display: inline-block;
      color: #3674d7;
      font-size: 12px;
      cursor: pointer;
      line-height: 12px;
      margin-top: 8px;
    }

    .confirm {
      width: 100%;
      height: 48px;
      background: rgba(54, 116, 215, 1);
      border-radius: 4px;
      font-size: 17px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 48px;
      text-align: center;
      margin-top: 40px;
      cursor: pointer;
    }

    p {
      height: 16px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 16px;
      margin-top: 25px;
      margin-bottom: 8px;
    }

    .enter-input {
      width:100%;
      padding: 7px 10px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      padding-left: 11px;
      &:focus {
        border: 1px solid #3674d7;
      }
      &::placeholder {
        font-size: 14px;
        color: rgba(204, 204, 204, 1);
      }
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);
    }

    .center-tip {
      padding: 12px 18px;
      margin-top: 24px;
      width: 100%;
      background: rgba(254, 252, 235, 1);
      border: 1px solid rgba(245, 219, 179, 1);

      .tip-txt {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(104, 114, 146, 1);
      }
    }
  }

  .pwd-mask {
    width: 515px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
    border-radius: 4px;
    filter: blur(0px);
    padding: 24px 26px 32px 24px;

    .yes {
      .icon {
        width: 52px;
        height: 52px;
        background: rgba(61, 189, 125, 1);
        border-radius: 50%;
      }
    }

    .confirm {
      width: 100%;
      height: 48px;
      background: rgba(54, 116, 215, 1);
      border-radius: 4px;
      font-size: 17px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 48px;
      text-align: center;
      margin-top: 40px;
      cursor: pointer;
    }

    p {
      height: 16px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 16px;
      margin-top: 25px;
      margin-bottom: 7px;
    }

    input {
      width: 100%;
      padding: 7px 10px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      padding-left: 11px;
      &:focus {
        border: 1px solid #3674d7;
      }
      &::placeholder {
        font-size: 14px;
        color: rgba(204, 204, 204, 1);
      }
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);

    
      .icon--copy4 {
        cursor: pointer;
      }
    }

    .pwd-tip {
      padding: 12px 18px;
      margin-top: 24px;
      width: 100%;
      background: rgba(254, 252, 235, 1);
      border: 1px solid rgba(245, 219, 179, 1);

      .icon--1-2 {
        margin-left: 18px;
        margin-right: 13px;
      }

      .tip-txt {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(104, 114, 146, 1);
      }
    }
  }

}
</style>