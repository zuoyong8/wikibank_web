<template>
  <div class="mine">
    <PersonalData></PersonalData>
    <div class="person-title">
      <img :src="identifyIcon" alt class="icon" />
      <span class="text">身份验证</span>
    </div>
    <div class="person-list">
      <div class="person-item">
        <div class="list-title">
          手机号码
          <span class="tips">用于登录、提币、找回密码、修改安全设置</span>
        </div>
        <div class="list-info">
          {{userInfo.areaCode}} {{getTel}}
        </div>
      </div>
      <div class="person-item">
        <div class="list-title">
          邮箱账号
          <span class="tips">用于登录、提币、找回密码、修改安全设置</span>
        </div>
        <div class="list-info">
          <span class="email">{{getEmail}}</span>
          <span :style="{marginLeft:'10px'}" class="operate" @click="openAuthModal(true)" v-if="!userInfo.emailAuthStatus">去认证</span>
        </div>
      </div>
    </div>
    <div class="person-title">
      <img :src="safeIcon" alt class="icon" />
      <span class="text">安全密码管理</span>
    </div>
    <div class="person-list">
      <div class="person-item">
        <div class="list-title">
          登录密码
          <span class="tips">用于保护账户安全</span>
        </div>
        <div class="list-info">
          <div @click="openPwdModal(true)" class="operate">修改</div>
        </div>
      </div>
      <div class="person-item">
        <div class="list-title">
          支付密码
          <span class="tips">用于保护资金安全</span>
        </div>
        <div class="list-info">
          <span @click="openPayModal(true)" class="operate">修改</span>
          <span class="divide"></span>
          <span @click="findPayHandle" class="operate">找回</span>
        </div>
      </div>
    </div>
    <div class="person-title">
      <img :src="personIcon" alt class="icon" />
      <span class="text">个人设置</span>
    </div>
    <div class="person-list">
      <div class="person-item">
        <div class="list-title">
          <span class="address-title">地址簿</span>
          <span class="tips">添加后，可以在提币时选择已添加的提现地址。</span>
        </div>
        <div class="list-info">
          <div @click="openAddressModal(true)" class="operate">添加</div>
        </div>
      </div>
    </div>
    <!-- 修改邮箱弹出层 -->
    <ModalMask
      :isShowModal="isShowAuthModal"
      :isHideMask="isHideAuthMask"
      @closeModal="closeAuthModal"
      @openModal="openAuthModal"
    >
      <template v-slot:body>
        <form class="email-mask">
          <div class="close">
            <span class="txt">邮箱认证</span>
            <span class="icon--copy4" @click="closeAuthModal(false)"></span>
          </div>
          <div class="tip-email">
            <span class="icon--1-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </span>
            <span class="tip-txt">邮箱认证后不可更换，请谨慎绑定邮箱</span>
          </div>
          <p>邮箱</p>
          <div class="update-box">
            <input v-model="newEmail" class="enter-input" placeholder="请输入邮箱号" />
            <!-- <div class="update-email" @click="updateEmail" v-if="newEmail !== userInfo.email">修改</div> :placeholder="userInfo.email" -->
          </div>
          <p>邮箱验证码</p>
          <div class="code">
            <VertifyCode
              :type="'2'"
              :vertifyContent="newEmail"
              :vertifyText="authPlacehode"
              :isVertifyExsit="isVertifyExsit"
              :value="code"
              v-model="code"
              :isClear="isClear"
            ></VertifyCode>
          </div>
          <div class="tips">验证邮件可能会被误判为垃圾邮件，请注意查收</div>
          <div class="confirm" @click="verify">确定</div>
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
    <div class="title" v-if="isAddressList">
      <div class="icon"></div>
      <div class="title-txt">地址簿</div>
    </div>
    <div class="tip" v-if="isAddressList">
      <span class="icon--1-2" style="margin-right:8px;margin-left:16px">
        <span class="path1"></span>
        <span class="path2"></span>
        <span class="path3"></span>
      </span>
      <span class="tip-txt">添加后，可以在提币时选择已添加的提现地址。</span>
    </div>
    <ul class="contact-list" v-if="isAddressList">
      <li class="contact-item" v-for="(item,index) in addressList" :key="index">
        <div class="avatar">
          <img :src="item.avatar" alt width="40px" height="40px" />
        </div>
        <div class="contact">
          <div class="name">{{item.comment}}({{item.coinType}})</div>
          <div class="transfer" @click="transfer(item.id)">提现</div>
          <div class="delete" @click="deleteAddr(item.id)">删除</div>
          <div class="phone">账户：{{item.account}}</div>
        </div>
      </li>
    </ul>
    <div class="spin-container" v-if="loading">
      <Spin fix></Spin>
    </div>

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
            <span class="txt">密码修改</span>
            <span class="icon--copy4" @click="closePwdModal(false)"></span>
          </div>
          <div class="pwd-tip">
            <span class="icon--1-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </span>
            <span class="tip-txt">为了您的资产安全，修改登录密码后24小时内禁止提币、转账、支付</span>
          </div>
          <p>原登录密码</p>
          <input type="password" placeholder="请输入原登录密码" v-model="oldPwd" />
          <p>新登录密码</p>
          <input type="password" placeholder="请输入新登录密码" v-model="newPwd" />
          <p>新登录密码</p>
          <input type="password" placeholder="请再次输入新登录密码" v-model="newPwdd" />
          <div class="confirm" @click="confirmLoginPassword">确定</div>
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
            <span class="txt">支付密码修改</span>
            <span class="icon--copy4" @click="openPayModal(false)"></span>
          </div>
          <div class="center" v-show="!yes">
            <div class="center-tip">
              <span class="icon--1-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </span>
              <span class="tip-txt">为了您的资产安全，修改支付密码后24小时内不允许提币，转账，支付</span>
            </div>
            <p>原支付密码</p>
            <input type="password" placeholder="请输入原支付密码" v-model="oldPay" class="enter-input" />
            <p>新支付密码</p>
            <input type="password" placeholder="请输入新支付密码" v-model="newPay" class="enter-input" />
            <p>新支付密码</p>
            <input type="password" placeholder="请再次输入新支付密码" v-model="newPayy" class="enter-input" />
            <div class="email-code" v-show="vertifyType === '1'">
              <p>邮箱验证码</p>
              <VertifyCode
                :type="'2'"
                :vertifyContent="userInfo.email"
                :vertifyText="placehode"
                :value="emailCode"
                v-model="emailCode"
                :isClear="isClear"
              ></VertifyCode>
            </div>
            <div class="tel-code" v-show="vertifyType === '2'">
              <p>手机验证码</p>
              <VertifyCode
                :type="'1'"
                :vertifyContent="userInfo.phone"
                :areaCode="areaCode"
                :vertifyText="placehode"
                :value="telCode"
                v-model="telCode"
                :isClear="isClear"
              ></VertifyCode>
            </div>
            <div class="switch-vertify" @click="switchVertify">{{vertifyTypeText}}</div>
            <div class="confirm" @click="confirmPay">确定</div>
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
            找回支付密码
            <span class="icon--copy4 close-btn" @click="closeFindPayModal(false)"></span>
          </div>
          <div class="safe-tips">
            <span class="icon--1-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </span>
            <span class="safe-text">为了您的资产安全，修改支付密码后24小时内禁止提币、转账、支付</span>
          </div>
          <div class="find-pay-step" v-show="stepNum === 1">
            <div class="modal-phone">手机号</div>
            <div class="select-phone disabled">
              <Dropdown
                :flagList="flagList"
                :isShow="isShowCountryList"
                :areaFlag="userInfo.areaFlag"
                :areaCode="userInfo.areaCode"
                @selectCountry="selectCountry"
                @changeFlagCode="changeFlagCode"
              ></Dropdown>
              <input
                type="text"
                placeholder="请输入手机号"
                v-model="userInfo.phone"
                class="tel-input disabled"
              />
            </div>

            <div class="vertify-code">手机验证码</div>
            <VertifyCode
              :type="'1'"
              :vertifyContent="userInfo.phone"
              :areaCode="userInfo.areaCode"
              :vertifyText="findPayTelPlacehode"
              :value="findPayTelCode"
              v-model="findPayTelCode"
              :isClear="isClear"
            ></VertifyCode>
            <a href="javascript:;" class="confirm-button" @click="vertifyTelCode">确定</a>
          </div>

          <div class="find-pay-step" v-show="stepNum === 2">
            <div class="vertify-code">邮箱</div>
            <div class>
              <input
                type="text"
                placeholder="请输入邮箱号"
                v-model="userInfo.email"
                :class="['tel-input', 'disabled']"
                :style="{width : '100%'}"
              />
            </div>

            <div class="vertify-code">邮箱验证码</div>
            <VertifyCode
              :type="'2'"
              :vertifyContent="userInfo.email"
              :vertifyText="findPayEmailPlacehode"
              :value="findPayEmailCode"
              v-model="findPayEmailCode"
            ></VertifyCode>
            <a href="javascript:;" class="confirm-button" @click="vertifyEmailCode">确定</a>
          </div>

          <div class="find-pay-step" v-show="stepNum === 3">
            <div class="vertify-code">新支付密码</div>
            <div class>
              <input
                type="password"
                placeholder="请输入新支付密码"
                v-model="newPayPassword"
                class="tel-input"
                :style="{width : '100%'}"
              />
            </div>

            <div class="vertify-code">确认新支付密码</div>
            <div class>
              <input
                type="password"
                placeholder="请再次输入新支付密码"
                v-model="confirmPayPassword"
                class="tel-input"
                :style="{width : '100%'}"
              />
            </div>
            <a href="javascript:;" class="confirm-button" @click="findPayPassword">确定</a>
          </div>
        </div>
      </template>
    </ModalMask>

    <ModalMask
      :isShowModal="isShowAddressModal"
      :isHideMask="isHideAddressMask"
      @closeModal="closeAddressModal"
      @openModal="openAddressModal"
    >
      <template v-slot:body>
        <div class="modal-content">
          <div class="modal-title">
            <div>添加地址簿</div>
            <span class="icon--copy4 close-btn" @click="closeAddressModal(false)"></span>
          </div>

          <div class="modal-label">账户</div>
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
            <div class="modal-label">链名称</div>
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

          <div class="modal-label">提币地址</div>
          <div class>
            <input type="text" placeholder="请输入提币地址（必填）" class="input-style" v-model="coinAddress" />
          </div>

          <div class="modal-label">备注</div>
          <div>
            <input type="text" placeholder="请输入备注（必填）" class="input-style" v-model="remarks" />
          </div>
          <div class="modal-confirm" @click="addAddress">确定</div>
        </div>
      </template>
    </ModalMask>
  </div>
</template>

<script>
import PersonalData from "../components/PersonalData";
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
export default {
  data() {
    return {
      isVertifyExsit: true,
      identifyIcon: require("../../assets/person/identify_icon_20200710.png"),
      safeIcon: require("../../assets/person/safe_icon_20200710.png"),
      personIcon: require("../../assets/person/person_icon_20200710.png"),
      isShowFindPayModal: false,
      isHideFindPayMask: true,
      checkCoin: "USDT", // 选中的币种
      checkChain: "ERC20", // 选中的链名称
      coinAddress: "", // 提币地址
      remarks: "", // 备注
      isShowChain: true, // 显示链名称
      coinIndex: 1,
      chainIndex: 1,
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
      countText: "发送验证码",
      isCalc: false, // 正在倒计时
      flagList: [], // 国家国旗
      areaCode: "0086", //国家区号
      telVertifyCode: "", // 验证码
      isShowCountryList: false,
      authPlacehode: "请输入邮箱验证码", // 验证邮箱验证码提示
      emailCode: "", // 修改支付邮箱验证码
      telCode: "", // 修改支付手机验证码
      vertifyType: "2", // 验证方式 1、邮箱 2、短信
      vertifyTypeText: "邮箱验证方式",
      findPayTel: "", // 找回支付密码手机
      findPayTelPlacehode: "请输入手机验证码", // 找回支付手机提示
      findPayTelCode: "", // 找回支付手机验证码
      isClear: false,
      findPayEmail: "", // 找回支付密码邮箱
      findPayEmailPlacehode: "请输入邮箱验证码", // 找回支付邮箱提示
      findPayEmailCode: "", // 找回支付邮箱验证码
      newPayPassword: "", // 支付新密码
      confirmPayPassword: "", // 确认支付新密码
      token: "", // 找回密码token
      stepNum: 1, // 找回支付流程
      placehode: "请输入手机验证码"
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
        this.placehode = "请输入手机验证码";
        this.vertifyTypeText = "邮箱验证方式";
        this.vertifyType = "2";
      } else {
        if (!this.userInfo.emailAuthStatus) {
          return this.$Message.error("请先完成邮箱认证！");
        }
        this.placehode = "请输入邮箱验证码";
        this.vertifyTypeText = "手机短信验证方式";
        this.vertifyType = "1";
      }
    },
    // 找回支付密码
    findPayHandle() {
      if(!this.userInfo.emailAuthStatus) return this.$Message.error('请先完成邮箱认证！');
      this.openFindPayModal(true);
    },
    // 选择 coin
    selectCoin(id, name) {
      this.coinIndex = id;
      this.checkCoin = name;
      if (id > 1) {
        this.isShowChain = false;
      } else {
        this.isShowChain = true;
      }
    },
    // 选择 chain
    selectChain(id, name) {
      this.chainIndex = id;
      this.checkChain = name;
    },
    closeAddressModal(a) {
      this.isShowAddressModal = a;
      this.isHideAddressMask = true;
    },
    openAddressModal(a) {
      this.isShowAddressModal = a;
      this.isHideAddressMask = false;
      this.isShowChain = true;
      this.coinIndex = 1;
      this.chainIndex = 1;
      this.coinAddress = "";
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

    // 校验邮箱是否存在
    async reviseEmail() {
      if (!this.newEmail.trim()) {
        return this.$Message.error("邮箱地址不能为空");
      }
      const params = {
        email: this.newEmail
      };

      const res = await axios.isExistEmail(params);

      if (res.code === 0) {
        if (!res.data.success) {
          this.$Message.error("邮箱不存在");
        }
      } else {
        this.$Message.error(res.msg);
      }
    },

    // 修改邮箱
    async updateEmail() {
      if (!this.newEmail.trim()) return this.$Message.error("请输入邮箱！");

      const params = {
        email: this.newEmail
      };

      const res = await axios.updateEmail(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.$Message.info("修改成功！");
        } else {
          this.$Message.error("修改失败！");
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 验证邮箱
    async verify() {
      if (!this.newEmail.trim()) {
        this.$Message.error("邮箱地址不能为空");
        return;
      }
      if (!this.code.trim()) {
        this.$Message.error("请输入短信验证码");
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
          this.$Message.info("验证成功！");
          this.openAuthModal(false);
          const params = {};
          this.getUserInfo();
        } else {
          this.$Message.error("验证失败！");
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
      this.$Modal.confirm({
        title: "提示",
        content: `确定要删除${name}吗？`,
        onOk: async () => {
          const params = { id };
          const res = await deleteContact(params);

          if (res.code === 0) {
            this.$Message.info("删除成功！");
          } else {
            this.$Message.error(res.msg);
          }
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
            avatar: item.icon,
            account: item.address,
            coinType: item.coin,
            comment: item.comment // 备注
          };
        });
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 删除地址
    deleteAddr(id) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定要删除吗？",
        onOk: async () => {
          let params = {
            id
          };
          const res = await deleteAddress(params);

          if (res.code === 0) {
            this.$Message.info("删除成功！");
          } else {
            this.$Message.error(res.msg);
          }
        }
      });
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
    async confirmLoginPassword() {
      if (!this.oldPwd) {
        this.$Message.error("请输入原登录密码");
        return;
      }
      else if (!this.newPwd) {
        this.$Message.error("请输入新登录密码");
        return;
      }
      else if (!this.newPwdd) {
        this.$Message.error("请输入确认登录密码");
        return;
      }
      else if( 6 > this.oldPwd.length || this.oldPwd.length > 16) {
        return this.$Message.error("请输入6-16长度密码！");
      }
      else if( 6 > this.newPwd.length || this.newPwd.length > 16) {
        return this.$Message.error("请输入6-16长度密码！");
      }
      else if( 6 > this.newPwdd.length || this.newPwdd.length > 16) {
        return this.$Message.error("请输入6-16长度密码！");
      }
      else if (this.newPwd !== this.newPwdd) {
        this.$Message.error("输入的两次密码不一致");
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
          this.$Message.info("修改成功！");
          this.openPwdModal(false);
        } else {
          this.$Message.error("修改失败");
        }
      } else {
        this.$Message.error(res.msg);
      }
    },

    // 找回支付密码
    async findPayPassword() {
      if (!this.newPayPassword.trim())
        return this.$Message.error("请输入支付密码！");
      if (!this.confirmPayPassword.trim())
        return this.$Message.error("请输入确认支付密码！");
      if (this.newPayPassword !== this.confirmPayPassword)
        return this.$Message.error("两次支付密码不一致！");

      const params = {
        token: this.token,
        payPwd: this.newPayPassword
      };

      const res = await axios.resetPayPassword(params);

      if (res.code === 0) {
        const { success } = res.data;
        if (success) {
          this.openFindPayModal(false);

          this.$Message.info("支付密码找回成功！");
        } else {
          this.$Message.error("支付密码找回失败！");
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 修改支付密码
    async confirmPay() {
      if (this.oldPay == "") {
        this.$Message.error("请输入原支付密码");
        return;
      }
      if (this.newPay == "") {
        this.$Message.error("请输入新支付密码");
        return;
      }
      if (this.newPayy == "") {
        this.$Message.error("请输入确认支付密码");
        return;
      }
      if (this.newPay !== this.newPayy) {
        this.$Message.error("输入支付密码不一致！");
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
          this.$Message.info("修改成功！");
          this.openPayModal(false);
        } else {
          this.$Message.error("修改失败！");
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
        return this.$Message.error("请输入手机号！");
      }
      if (!/^1[\d]{10}$/.test(this.tel)) {
        return this.$Message.error("请输入正确的手机号");
      }

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
          this.$Message.info("发送成功！");
          let timer = setInterval(() => {
            if (this.count <= 0) {
              this.countText = "重新发送";
              this.isCalc = false;
              clearInterval(timer);
              return;
            }
            this.countText = this.count + "s";
            this.count--;
          }, 1000);
        } else {
          this.$Message.error("发送失败！");
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 发送支付手机验证码
    sendTelCode(tel) {
      if (!tel) {
        return this.$Message.error("请输入手机号！");
      }
      if (!/^1[\d]{10}$/.test(tel)) {
        return this.$Message.error("请输入正确的手机号");
      }

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
          this.$Message.info("发送成功！");
          let timer = setInterval(() => {
            if (this.count <= 0) {
              this.countText = "重新发送";
              this.isCalc = false;
              clearInterval(timer);
              return;
            }
            this.countText = this.count + "s";
            this.count--;
          }, 1000);
        } else {
          this.$Message.error("发送失败！");
        }
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 验证手机验证码
    async vertifyTelCode() {
      if (!this.userInfo.phone.trim())
        return this.$Message.error("请填写手机号！");
      if (!this.findPayTelCode.trim())
        return this.$Message.error("请填写手机验证码！");

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
      if (!this.userInfo.email.trim()) return this.$Message.error("请填写邮箱！");
      if (!this.findPayEmailCode.trim())
        return this.$Message.error("请填写邮箱验证码！");

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
      const { checkCoin, checkChain, coinAddress, remarks } = this;
      let coin = "";

      if (!coinAddress.trim()) return this.$Message.error("请填写提币地址！");
      if (!remarks.trim()) return this.$Message.error("请填写备注！");
      if (checkCoin === "USDT") {
        coin = checkCoin + "-" + checkChain;
      } else {
        coin = checkCoin;
      }

      const params = {
        coin: coin,
        address: coinAddress,
        comment: remarks
      };

      const res = await axios.addWalletAddr(params);

      if (res.code === 0) {
        let { success } = res.data;
        if (success) {
          this.openAddressModal(false);
          this.getUserInfo();
          this.$Message.info("添加成功");
        }
      } else {
        this.$Message.error(res.msg);
      }
    }
  },
  mounted() {
    this.getFlags();
    this.newEmail = this.userInfo.email;
  }
};
</script>
<style scoped lang='scss'>
.mine {
  min-height: 100vh;
  padding-top: 20px;
  width: 1330px;
  margin: 0 auto;
  .tip {
    height: 40px;
    background: rgba(254, 252, 235, 1);
    line-height: 40px;
    margin: 8px 0 8px 40px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(104, 114, 146, 1);
  }
  .spin-container {
    position: relative;
    text-align: center;
    padding: 100px 0;
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
    width: 480px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 12px 0px rgba(13, 30, 82, 0.15);
    border-radius: 4px;
    filter: blur(0px);
    padding: 24px 26px 32px 24px;

    .confirm {
      width: 428px;
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
    .tips {
      margin-top: 8px;
      margin-bottom: 0;
      color: #aeb7c4;
      font-size: 12px;
    }

    .enter-input {
      width: 428px;
      height: 36px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      line-height: 36px;
      padding-left: 11px;
      &:focus {
        border: 1px solid #3674d7;
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

    input::input-placeholder {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(204, 204, 204, 1);
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);

      .txt {
        margin-right: 328px;
      }

      .icon--copy4 {
        cursor: pointer;
      }
    }

    .tip-email {
      line-height: 40px;
      margin-top: 15px;
      width: 428px;
      height: 40px;
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

  .person-title {
    margin: 0 30px;
    padding: 17px 64px;
    font-size: 18px;
    color: #62697f;
    background: #fff;
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
    margin: 0 30px 16px 30px;
    border-top: 1px solid #f0f0f0;
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
}
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
  width: 480px;
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
.coin-list {
  display: flex;
  // justify-content: space-between;
  margin-top: 15px;
  .coin-item {
    display: inline-block;
    padding: 8px 10px;
    background: #f9f7fd;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    margin-right: 70px;
    &:last-child {
      margin-right: 0;
    }
    .coin-avatar {
      width: 24px;
      height: 24px;
    }
    .coin-name {
      display: inline-block;
      vertical-align: middle;
      color: #333;
      font-size: 16px;
      font-weight: bold;
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
  margin-top: 15px;
  .chain-item {
    display: inline-block;
    padding: 6px 12px;
    background: #f7f6fb;
    color: #222;
    font-size: 16px;
    cursor: pointer;
    margin-right: 48px;
  }
  .active {
    border: 1px solid #3674d7;
    box-shadow: 0px 0px 6px 0px rgba(13, 30, 82, 0.15);
    background: url("../../assets/person/check_icon_20200624.png") no-repeat
      right bottom;
    background-size: 16px 12px;
  }
}
.input-style {
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 7px;
  border: 1px solid #dfe2e7;
  padding: 10px;
  font-size: 14px;
  color: #333;
  &:focus {
    border: 1px solid #3674D7;
  }
  &::placeholder {
    color: #ccc;
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
  margin-top: 26px;
  padding: 12px 18px;
  background: #fefceb;
  border: 1px solid #f5dbb3;
  color: #687292;
  font-size: 12px;
  text-align: left;
  .safe-text {
    margin-left: 7px;
  }
}
.modal-phone {
  color: #666;
  font-size: 12px;
  margin-left: 104px;
  margin-top: 25px;
  margin-bottom: 7px;
}
.select-phone {
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
  width: 306px;
  border: 1px solid #dfe2e7;
  border-radius: 2px;
  font-size: 14px;
  color: #333;
  padding: 7px 10px;
  &:focus {
    border: 1px solid #3674d7;
  }
}
.tel-input {
  width: 324px;
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
    width: 480px;
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
    }

    .confirm {
      width: 428px;
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

    .enter-input {
      width: 428px;
      height: 36px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      line-height: 36px;
      padding-left: 11px;
      &:focus {
        border: 1px solid #3674d7;
      }
    }

    input::input-placeholder {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(204, 204, 204, 1);
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);

      .txt {
        margin-right: 287px;
      }

      .icon--copy4 {
        cursor: pointer;
      }
    }

    .center-tip {
      line-height: 40px;
      margin-top: 15px;
      width: 428px;
      height: 40px;
      background: rgba(254, 252, 235, 1);
      border: 1px solid rgba(245, 219, 179, 1);

      .icon--1-2 {
        margin-left: 18px;
        margin-right: 7px;
        vertical-align: middle;
      }

      .tip-txt {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(104, 114, 146, 1);
      }
    }
  }

  .pwd-mask {
    width: 480px;
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
      width: 428px;
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
      width: 428px;
      height: 36px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(223, 226, 231, 1);
      line-height: 36px;
      padding-left: 11px;
      &:focus {
        border: 1px solid #3674d7;
      }
    }

    input::input-placeholder {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(204, 204, 204, 1);
    }

    .close {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);

      .txt {
        margin-right: 329px;
      }

      .icon--copy4 {
        cursor: pointer;
      }
    }

    .pwd-tip {
      line-height: 40px;
      margin-top: 15px;
      width: 428px;
      height: 40px;
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