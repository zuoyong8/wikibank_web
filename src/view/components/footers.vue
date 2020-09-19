<template>
    <div class="footer">
       {{$t('login.copyright')}}
      </div>
</template>

<script>
export default {
    name:'footers'
}

</script>
<style scoped lang='stylus'>
    .footer
        height 50px
        width 100%
        background:rgba(4,14,42,1);
        box-shadow 0 -30px 20px rgba(4,14,42,.5)  
        font-size:12px;
        font-family:MicrosoftYaHei;
        color:rgba(204,204,204,1)
        text-align center
        margin-top -50px
        line-height 50px
        position absolute 
        bottom 0
        left 0
        min-width: 1200px;
          
</style>