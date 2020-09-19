<template>
  <div class="select-dropdown">
    <div class="select-checked">
      <slot name="title"></slot>
    </div>
    <div class="dropdown-list" :class="isShow ? 'active': ''">
      <ul>
        <li v-for="(item, key) in list" :key="key" @click="changeItem(item)" class="coin-list">
          <div class="coin-type">
            <img :src="item.avatar" alt class="coin-avatar" />
            <span class="coin-name">{{item.name}} {{$t('home.account')}}</span>
          </div>
          <div class="coin-number">
            <span>{{item.count}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    isShow: Boolean,
    list: Array
  },
  data() {
    return {};
  },
  methods: {
    select() {
    },
    changeItem(item) {
      this.$emit("selectList", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-dropdown {
  position: relative;
  width: 100%;
  .select-checked {
    font-size: 14px;
    color: #333;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    border: 1px solid #dfe2e7;
    padding: 10px 12px;
    margin: 0;
    display: flex;
    justify-content: space-between;
  }
  .dropdown-list {
    width: 100%;
    position: absolute;
    top: 36px;
    left: 0;
    background: #fff;
    box-shadow: 0px 5px 10px 0px rgba(162, 177, 202, 0.5);
    border: solid 1px #ebedf0;
    border-radius: 5px;
    transform-origin: center top;
    transform: translateY(0);
    transition: all 0.3s ease-out;
    visibility: hidden;
    opacity: 0;
    z-index: 1;
    overflow: auto;
    ul {
      list-style: none;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        cursor: pointer;
        text-align: left;
        padding-left: 19px;
        transition: all 0.2s ease-out;
        .coin-avatar {
            width: 20px;
            height: 20px;
            border-radius: 2px;
        }
        .coin-name {
            color: #333;
            font-size: 13px;
            vertical-align: middle;
            margin-left: 8px;
            border-radius: 4px;
        }
        .coin-number {
            padding-right: 20px;
            color: #818B99;
            font-size: 13px;
        }
        &:hover {
          background: #E8F0FC;
          color: #3674d7;
        }
        &:first-child {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
        &:last-child {
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
      .active {
        background: #fafafa;
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