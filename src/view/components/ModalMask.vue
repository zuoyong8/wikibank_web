<template>
<div class="modal-component" :class="isShowModal ? 'show':''" >
    <div class="modal-mask" @click.stop="closeModal" :class="[isShowModal ? 'show':'', isHideMask ? 'hide-mask':'']"></div>
    <div class="modal-widget"  :class="[isShowModal ? 'show':'']">
        <slot class="modal-body" name="body">
        </slot>
    </div>
</div>
</template>

<script>
export default {
    name: "",
    components: {},
    data() {
        return {

        }
    },
    props: {
        isShowModal: Boolean,
        isHideMask: Boolean,
    },
    methods: {
        // 关闭弹框
        closeModal() {
            this.$emit("closeModal", false);
        },
        // 打开弹框
        openModal() {
            this.$emit("openModal", true );
        },
    }
}
</script>

<style lang="scss" scoped>
.modal-component.show {
  visibility: visible;
}
.modal-widget.show{
  visibility: visible;
  transform: scale(1);
  opacity: 1;
}
.modal-mask.show{
  visibility: visible;
  background: rgba(0, 0, 0, .6);
}
.modal-mask.hide-mask {
  background: rgba(255,255, 255, 0)
}
.modal-component {
  visibility: hidden;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 13;
  transition: all .2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0);
  transition: all .2s ease-in-out;
}
.modal-widget {
    visibility: hidden;
    transform: scale(.8);
    background: #fff;
    box-shadow:0px 2px 12px 0px rgba(0,0,0,0.2);
    border-radius:4px;
    transition: all .2s ease-in-out;
    opacity: 0;
}
</style>