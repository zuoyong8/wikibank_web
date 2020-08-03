<template>
<div class="icons">
    <!-- <div class="left"></div> -->
    <div class='icon' >
       <div class="iconImg"></div>
    </div>
    <!-- <div class="right"></div> -->
 </div>
</template>

<script>
export default {
    name:'icon'
}

</script>
<style lang='stylus' scoped>
.icons
     height 48px
     //position relative
     width 100%
    // #left 
    //     // position: absolute; 
    //     // top: 0; 
    //     // left: 0;
    //     width: 19%;
    //     height 48px
    //     float left
    // #right 
    //     // position: absolute; 
    //     // top: 0; 
    //     // right: 0; 
    //     width: 19%;
    //     height 48px
    //     float left
    .icon
        width: 1200px;
        min-width: 1200px
        margin 0 auto
        margin-top 59px
        .iconImg
            width 194px
            height 48px
            // background-image url('../../../assets/imgs/icon.png')
            background-repeat no-repeat
            background-position 100%
</style>