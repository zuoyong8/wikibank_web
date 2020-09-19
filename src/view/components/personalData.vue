<template>
  <div class="information">
    <div class="">
      <img :src=getAvatar alt="" class="avatar">
    </div>
    <div class="person">
      <div>
        <span class="greet">Hi，{{userInfo.lastName}}</span>
        <!-- <span class="login-data">上次登录时间： {{ date }}</span> -->
      </div>
      <div class="tel">
        <!-- <span class="icon--2" style="margin-right:8px"></span> -->
            UID: {{userInfo.userId}}
      </div>
    </div>
     <!-- <div class="personal-account-r">({{userInfo.firstName}}{{userInfo.lastName}})
        <span class="icon-8" style="margin-right:8px"></span>
        邮箱账户:{{email}}:style="{backgroundImage:`url()`}"
      </div>-->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { formatTel, formatDate } from "../../filters";
export default {
  name: "personalData",
  data() {
    return {
      firstName: "",
      lastName: "",
      avatar: "", //头像
      phone: "",
      email: ""
    };
  },
  methods: {
  },
  computed: {
    ...mapState({
      userInfo: "userInfo"
    }),
    ...mapGetters(["getAvatar"]),
    date() {
      return formatDate(this.userInfo.lastLoginTime, "yyyy-MM-dd hh:mm:ss");
    },
    tel() {
      return formatTel(this.userInfo.phone);
    }
  }
};
</script>
<style scoped lang='scss'>
.information {
  display: flex;
  padding: 30px 64px;
  background: #fff;
  margin: 45px 30px 16px 30px;
  border-radius: 4px;
  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 4px;
  }
  .person {
    padding-left: 24px;
    padding-top: 8px;
    .greet {
      font-size: 18px;
      color: #333;
      font-weight: bold;
      margin-top: 5px;
    }
    .login-data {
      margin-left: 10px;
      font-size: 12px;
      color: #999;
    } 
    .tel {
      display: inline-block;
      margin-top: 15px;
      padding: 3px 14px;
      background: #F0F4FF;
      border-radius: 3px;
      font-size: 14px;
      color: #3674D7;
    }
  }
}
</style>
