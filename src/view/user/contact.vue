<template>
  <div class="person">
     <PersonalData></PersonalData>      
  </div>
</template>

<script>
import PersonalData from '../components/PersonalData'
export default {
     data () {
            return {
                isEmail:false,//邮箱修改弹出框
                email:'',
                code:'',//验证码
                newEmail:'',//修改后的邮箱
                contactList:[],
                isContactList:false,//显示联系人列表
                isShow:true,
                computeTime:0,
                sex:'',//性别
                areaCode: "",
                addressList:[],//地址簿
                isAddressList:false
            }
        },
        components:{
            PersonalData
        }
}

</script>
<style lang='stylus' scoped>
.person
    .title       
        height:64px;
        margin-left 40px
        background:rgba(245,246,250,1);
        .icon
            width:23px;
            height:18px;
            background:rgba(98,105,127,1);
            mask url('../../assets/imgs/mine7.svg')
            margin 23px 8px 23px 16px
            float left
            -webkit-mask-position: 100%;
            -webkit-mask-repeat: no-repeat;
        .title-txt
            margin 17px 0
            float left
            height:30px;
            font-size:18px;
            font-family:MicrosoftYaHei-Bold,MicrosoftYaHei;
            font-weight:bold;
            color:rgba(98,105,127,1);
            line-height:30px; 
    .personal,.account
        height 293px
        border:1px solid rgba(240,240,240,1)
        margin 8px 0 40px 40px
        padding-left 44px 
        &>li 
            height 72px
            border-bottom 1px solid rgba(240,240,240,1)   
            line-height 72px
            cursor pointer
            .left 
                font-size:14px;
                font-family:MicrosoftYaHei;
                color:rgba(51,51,51,1);
                line-height:19px; 
                margin 26px 51px 26px 0
                float left
            .left1
                margin-right 79px
            .center
                font-size:14px;
                font-family:MicrosoftYaHei;
                color:rgba(170,170,170,1); 
                margin-left 62px 
                float left
            .icon 
                float left
            .right 
                color:rgba(119,119,119,1);
                float right 
                margin-right 24px
                .identify
                    color:rgba(54,116,215,1);
                    margin-left 26px
                    cursor pointer
        .last 
            border-bottom none
</style>