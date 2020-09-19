<template>
  <div class="console" ref='console'>
      <div class="layout">
        <Navbar></Navbar>
        <Menu></Menu>
        <div class="content-wrapper">
          <div class="usd-list">
            <router-view></router-view>
            <router-view name='list'></router-view>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

import Menu from '@/view/components/Menu'
import Navbar from "@/view/components/Navbar"
export default {
  components: {
    Menu,
    Navbar
  },
  // 点击导航让页面返回顶部
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$refs.console.scrollTop = 0;
    });
  }
}

</script>
<style lang='scss' scoped>
.console {
  height: 100%;
  overflow-y: scroll;
  background: #f5f6fa;  
  .layout {
    background:#f5f6fa;
    .content-wrapper {
      margin-left: 268px;
      width: calc(100% - 268px);
      .usd-list {
        min-height: 100vh;
        padding-top: 20px;
        width: 1330px;
        margin: 0 auto;
        padding-bottom: 16px;
      }
    }
  }
}

</style>