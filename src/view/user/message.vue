<template>
    <div class="mine">
       <PersonalData></PersonalData>
       <div class='title'>
            <div class="icon"></div> 
            <div class="txt">最新消息</div>
       </div>
       <ul class="message">
           <li class="message-item">
               <div class="head">
                   <div class="head-icon"></div>
                   <div class="head-txt"></div>
               </div>
               <div class="content"></div>
               <div class="time"></div>
           </li>
       </ul>
    </div>

</template>

<script>
import PersonalData from '../components/PersonalData'
export default {
   data () {
            return {
               
            }
        },
    components:{
        PersonalData
    }
}

</script>
<style style lang='stylus'>
.mine
    .title    
        height:64px;
        margin-left 40px
        background:rgba(245,246,250,1);
        margin-bottom 8px
        .icon
            width:20px;
            height:15px;
            mask url('../../assets/imgs/mine7.svg')
            background #62697F 
            margin 25px 8px 23px 16px
            float left
            -webkit-mask-position: 100%;
            -webkit-mask-repeat: no-repeat;
        .txt
            margin 17px 0
            float left
            height:30px;
            font-size:18px;
            font-family:MicrosoftYaHei-Bold,MicrosoftYaHei;
            font-weight:bold;
            color:rgba(98,105,127,1);
            line-height:30px;          
    .message
        border:1px solid rgba(240,240,240,1);
        margin-left 40px
        padding-left 44px
        .message-item 
            height 118px
            borser-bottom 2px
              

       

</style>