<template>
    <div class="layout" >
        <headers></headers>
        <icon></icon>
        <div class="content">
          <div class="left"></div>
          <div class="center">
            <div class="image">
              <div class="person animated fadeInLeft"></div>
              <div class="oval animated bounceInUp"></div>
              <div class="phone animated fadeInRight"></div>
            </div>
            <div class="center"></div>
            <div class="download">
              <h2>WikiPay 一站式全球电子钱包</h2>
              <h5>安全，0汇损，极速到账，坐享收益</h5>
              <downloadVersion></downloadVersion>
            </div>
          </div>
          <div class="right"></div>
        </div> 
      <footers></footers>
    </div>
    
</template>
<style scoped lang='stylus'>
    .layout
       height 100%
       width 100%
       min-width: 1200px
       background-image url('../assets/imgs/Group3.png')
       background-size cover
       .content
        width 100%
        position relative
        height 555px
        margin-top 179px
        .left 
          position: absolute; 
          top: 0; 
          left: 0;
          width: 0;
          height 555px
        .right 
          position: absolute; 
          top: 0; 
          right : 0; 
          width 20%;
          height 555px
        .center
          width 80%
          position relative
          margin 0 auto
          .image
            position absolute
            top: 0; 
            left: 0;
            width 42.6%
            float left
            height 555px
            .person
              background-image url('../assets/imgs/person.png')
              width 371px
              height 410px
              position absolute
              left 0
              top 76px
              z-index 10
            .oval
              background-image url('../assets/imgs/oval.png')
              width 231px
              height 418px
              position absolute
              left 118px
              top 36px
              z-index 5
            .phone
              background-image url('../assets/imgs/phone.png')
              background-repeat no-repeat
              width 339px
              height 555px
              position absolute
              z-index 6
              top 0
              left 186px
          .center
            width 20.4%
            margin 0 auto
            height 555px
          .download
            position absolute
            top: 0; 
            right : 0;
            width 37%
            h2 
              width:444px;
              height:64px;
              font-size:32px;
              font-family:MicrosoftYaHei-Bold,MicrosoftYaHei;
              font-weight:bold;
              color:rgba(255,255,255,1);
              line-height:60px;
              margin 3px 50px 32px 0
            h5
              width:494px;
              height:40px;
              font-size:14px;
              font-family:MicrosoftYaHei;
              color:rgba(255,255,255,1);
              line-height:33px;
              margin-bottom 66px

</style>
<script>
import headers from './components/header/headers'
import icon from './components/icon/icon'
import footers from './components/footers'
import downloadVersion from './components/downloadVersion'
  export default {
        data () {
            return {
                isCollapsed: false,
                }
        },
        components:{
          headers,
          icon,
          footers,
          downloadVersion
        } 
    }
</script>