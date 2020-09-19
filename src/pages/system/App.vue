<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: "app",
 
};
</script>
<style lang='scss'>

.app {
  height: 100vh;
  font-family: "Microsoft YaHei" !important;
}
ul li {
  list-style: none;
}
input {
  outline: none;
}
input:focus {
  border: 1px solid #3674d7;
}
.disabled {
  pointer-events: none;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  border-radius: 6px;
}
html {
  overflow-y: scroll;
}

:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
}
</style>
