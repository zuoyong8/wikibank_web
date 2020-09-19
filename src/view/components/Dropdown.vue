<template>
  <div class="select-dropdown" ref="dropdown">
    <div class="select-checked" @click="selectCountry" :style="{width:`${valWidth}px`}">
      <img :src="areaFlag" alt class="flag-icon" />
      <span class="area-code">{{areaCode}}</span> 
      <img :src="downIcon" alt :class="['down-icon', isShow ? 'rotate':'']" />
    </div>
    <div class="dropdown-list" :class="isShow ? 'active': ''" :style="{width:`${width}px`}">
      <div class="search-box">
        <img :src="searchIcon" alt="" class="search-icon">
        <input type="text" :placeholder="$t('login.searchPlace')" v-model="search" class="search-input">
      </div>
      <div class="check-item">
        <div class="">
          <img :src="areaFlag" alt class="flag-icon" />
          <span class="name">{{areaName}}</span>
        </div>
        <div>
          <span class="code">{{areaCode}}</span>
        </div>
      </div>
      <ul>
        <li v-for="(item, key) in flagList" :key="key" @click.stop="changeFlagCode(item)" :class=" item.code === areaCode ? 'check':'' ">
          <div>
            <img :src="item.flag" alt class="flag-icon" />
            <span class="name">{{item.name}}</span>
          </div>
          <div>
            <span class="code">{{item.code}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "dropdown",
  components: {},
  props: {
      isShow: Boolean,
      width: Number,
      valWidth: Number
  },
  watch: {
    search(){
      this.searchCountry()
    }
  },
  data() {
    return {
        search: "",
        searchIcon: require("../../assets/login/search_icon_20200729.png"),
        downIcon: require("../../assets/imgs/down_icon_20200525.png")
    };
  },
  mounted() {
    this.getFlags();
    this.changeAreaName({
      flag: this.areaFlag, 
      code: this.areaCode, 
      countryCode: this.countryCode
    });
  },
  computed: {
    ...mapState(["areaCode", "areaFlag", "areaName", "flagList", "countryCode"])
  },
  methods: {
    ...mapMutations(["getFlags", "changeAreaName"]),
    // 打开弹框
    selectCountry() {
      this.search = "";
      this.$emit('changeFlagCode', this.isShow);
      document.addEventListener("click", this.handle, false);
    },
    // 国家区号代码选择
    changeFlagCode(item) {
      this.$emit('changeFlagCode', this.isShow);
      this.changeAreaName(item);
      document.removeEventListener('click', this.handle, false);
    },
    handle(e) {
      const d = this.$refs.dropdown;
      if(d.contains(e.target)) return;
      this.$emit('changeFlagCode', true);
    },
    searchCountry() {
      let key = this.search;
      this.getFlags();
      let filterList = this.flagList.filter( item => {
        return item.code.includes(key) || item.name.includes(key)
      })
      this.getFlags(filterList);
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handle, false);
  }
};
</script>

<style lang="scss" scoped>
@mixin check {
  background: #E8F0FC;
  .name {
    color: #3674d7;
  }
}
@mixin item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px 10px 17px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease-out;
  &:hover {
    background:rgba(232,240,252, 0.3);
  }
  &:last-child {
    border-radius: 2px;
  }
  .name {
    color: #333;
    margin-left: 10px;
    vertical-align: middle;
  }
  .code {
    color: #818B99;
  }
}
.select-dropdown {
  position: relative;
  display: inline-block;
  width: 88px;
  .flag-icon {
    width: 20px;
    height: 13px;
  }
  .area-code {
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    width: 60px;
    padding: 0 6px 0 4px;
  }
  .down-icon {
    width: 8px;
    height: 4px;
    transition: all .2s ease;
    transform: rotate(0);
  }
  .rotate{
    transform:rotate(180deg);
  }
  .select-checked {
    width: 88px;
    font-size: 14px;
    color: #333;
    border-radius: 4px;
    padding: 8px 0;
    cursor: pointer;
  }
  .dropdown-list {
    width: 304px;
    height: 265px;
    position: absolute;
    top: 42px;
    left: 0;
    background: #fff;
    box-shadow: 0px 5px 10px 0px rgba(162, 177, 202, 0.5);
    border: solid 1px #ebedf0;
    border-radius: 2px;
    transform-origin: center top;
    transform: translateY(0);
    transition: all 0.3s ease-out;
    visibility: hidden;
    opacity: 0;
    z-index: 1;
    overflow: hidden;
    .search-box {
      border: 1px solid #E7E9ED;
      border-radius: 2px;
      padding: 10px 12px;
      margin: 5px 12px;
      text-align: left;
      .search-icon {
        width: 16px;
        height: 16px;
      }
      .search-input {
        border: none;
        vertical-align: middle;
        width: 211px;
        margin-left: 8px;
        font-size: 14px;
        &::placeholder {
          color: #CCCCCC;
        }
      }
    }
    .check-item {
      @include item;
      .name,.code {
        color: #3674d7;
      }
      &:hover {
        background:none;
      }
    }
  
    ul {
      list-style: none;
      margin: 0;
      padding:0;
      height: 215px;
      padding-bottom: 10px;
      overflow: auto;
      li {
        @include item;
      }
      .check {
        @include check;
      }
    }
  }
  .active {
    visibility: visible;
    transform: translateY(10px);
    opacity: 1;
  }
}
</style>