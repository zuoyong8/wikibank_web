<template>
  <div class="select-dropdown" ref="dropdown">
    <div class="select-checked" @click="selectCountry">
      <img :src="areaFlag" alt class="flag-icon" />
      <span class="area-code">{{areaCode}}</span> 
      <img :src="downIcon" alt class="down-icon" />
    </div>
    <div class="dropdown-list" :class="isShow ? 'active': ''">
      <div class="search-box">
        <img :src="searchIcon" alt="" class="search-icon">
        <input type="text" placeholder="搜索" v-model="search" class="search-input">
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
import { fetchCountry } from "../../api/request";
export default {
  name: "dropdown",
  components: {},
  props: {
      isShow: Boolean,
      flagList: Array,
      areaCode: String,
      areaFlag: String,
      
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
        downIcon: require("../../assets/imgs/down_icon_20200525.png"),
        handleLable: null
    };
  },
  methods: {
    // 打开弹框
    selectCountry() {
      this.search = "";
      this.$emit('changeFlagCode', this.areaCode, this.areaFlag, this.isShow);
      document.addEventListener("click", this.handle, false);
    },
    // 国家区号代码选择
    changeFlagCode(item) {
      this.$emit('changeFlagCode', item.code, item.flag, this.isShow);
      document.removeEventListener('click', this.handle, false);
    },
    handle(e) {
      const d = this.$refs.dropdown;
      if(d.contains(e.target)) return;
      this.$emit('changeFlagCode', this.areaCode, this.areaFlag, true);
    },
    searchCountry() {
      let key = this.search;

      let filterList = fetchCountry().filter( item => {
        return item.code.includes(key) || item.name.includes(key)
      })

      this.$emit("changeList", filterList);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-dropdown {
  position: relative;
  display: inline-block;
  width: 98px;
  .flag-icon {
    width: 30px;
    height: 20px;
  }
  .area-code {
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    width: 60px;
  }
  .down-icon {
    width: 8px;
    height: 4px;
  }
  .select-checked {
    width: 120px;
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
    ul {
      list-style: none;
      margin: 0;
      padding:0;
      height: 215px;
      padding-bottom: 10px;
      overflow: auto;
      li {
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
      .check {
        background: #E8F0FC;
        .name {
          color: #3674d7;
        }
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