<template>
  <div class="select-widget">
    <slot class="select-val" name="title"></slot>
    <div class="select-triangle"></div>
    <div class="select-list">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "select_widget",
  components: {},
  props: {
      width: String
  },
  data() {
    return {
    }
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.select-widget {
  position: relative;
  z-index: 1;
  display: inline-block;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.19);
    }

    .select-list, .select-triangle {
      visibility: visible;
      transform: scaleY(1);
    }
  }


  .select-val {
    display: inline-block;
  }

  .select-triangle {
    visibility: hidden;
    position: absolute;
    width: 0;
    height: 0;
    left: 60px;
    top: 28px;
    content: '';
    display: block;
    border-width: 7px 7px 7px 7px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
  }

  .select-list {
    overflow: auto;
    visibility: hidden;
    position: absolute;
    top: 40px;
    left: 0;
    width: 132px;
    height: 150px;
    background: #fff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
    transform-origin: top;
    transform: scaleY(0);
    padding: 16px 0;
  }
}
</style>>