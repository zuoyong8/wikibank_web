<template>
  <transition name="fade">
    <div class="confirm-wrap" v-if="visible">
      <div class="confirm">
        <div class="hd">
          {{title}}
          <i class="btn-close iconfont icon-close" @click="handleAction('close')"></i>
        </div>
        <div class="bd">
          <i v-if="type!=''" class="icon-type iconfont" :class="'icon-'+type"></i>
          {{content}}
        </div>
        <div class="ft">
          <a
            href="javscript:void(0)"
            class="btn btn-default"
            @click="handleAction('cancel')"
          >{{cancelBtnText}}</a>
          <a
            href="javscript:void(0)"
            class="btn btn-primary"
            @click="handleAction('yes')"
          >{{yesBtnText}}</a>
        </div>
      </div>
      <div class="backdrop" @click="handleAction('close')"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Confirm",
  data() {
    return {
      visible: false,
      title: "",
      content: "",
      yesBtnText: "确定",
      cancelBtnText: "取消",
      type: "",
      promiseStatus: null,
    };
  },
  watch: {
    visible: function (curVal) {
      // if (curVal && document.body.scrollHeight > window.innerHeight) {
      //   $("body").addClass("backdrop-open");
      // } else {
      //   $("body").removeClass("backdrop-open");
      // }
    },
  },
  methods: {
    confirm() {
      let _this = this;
      this.visible = true;
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject };
      });
    },
    handleAction(action) {
      this.visible = false;
      if (action == "yes") {
        this.promiseStatus && this.promiseStatus.resolve();
      } else {
        this.promiseStatus && this.promiseStatus.reject();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$them-color: #3674d7;
$warning-color:#e6a23c !default;
$error-color:#f56c6c !default;
.fade {
  opacity: 0;
  -webkit-transition: opacity 0.15s linear;
  -o-transition: opacity 0.15s linear;
  transition: opacity 0.15s linear;
}
//confirm Modal
.confirm-wrap{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  text-align: center;
  opacity: 1;
  transition:opacity .3s;
  z-index: 9999;
  &.fade-enter, &.fade-leave-active {
    opacity:0;
  }
  .confirm,.modal{
    position: relative;
    display: inline-block;
    width: 420px;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
    z-index: 999;
    .hd{
      font-size: 16px;
      line-height: 1;
      padding: 15px 20px 10px 20px;
      font-weight: bold;
      .btn-close{
        position: absolute;
        right: 15px;
        top: 15px;
      }
    }
    .bd{
      padding: 10px 15px;
    }
    .ft{
      padding: 5px 15px;
      text-align: right;
    }
  }
  &:after{
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
}
.modal-wrap{
  .modal{
    width: 600px;
  }
}
.confirm-wrap{
  .icon-type{
    margin-right: 10px;
    font-size: 24px;
    vertical-align: middle;
  }
}
.backdrop{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.5);
  z-index: 99;
}

/*-- 按钮 --*/
.btn {
  display: inline-block;
  padding: 5px 25px;
  font-size: 13px;
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-decoration: none;
  border: 1px solid transparent;
  &:hover{
    text-decoration: none;
  }
  &.disabled,&[disabled]{cursor: not-allowed;filter: alpha(opacity=65);-webkit-box-shadow: none;box-shadow: none;opacity: .65;}
  &.active{outline: 0;-webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);}
  @at-root #{&}-default {
    color: #666;
    background-color: #fff;
    border-color: #eee;
    &:hover,
    &.active {
      color: #666;
      background-color: #f6f6f6;
      border-color: #adadad;
    }
    &.active:hover{color: #666;background-color: #d4d4d4;border-color: #8c8c8c;}
    &[disabled]{color: #fff;border-color: #ddd;background-color: #ddd;}
  }
  @mixin btn($color){
    color: #fff;
    background-color: $color;
    border-color: $color;
    &:hover {
      color: #fff;
      background-color: lighten($color, 5%);
      border-color: lighten($color, 5%);
    }
    &.active {
      color: #fff;
      background-color: darken($color, 10%);
      border-color: darken($color, 20%);
    }
    &.active:hover {
      color: #fff;
      background-color: darken($color, 20%);
      border-color: darken($color, 30%);
    }
    &.disabled:hover,
    &[disabled]:hover {
      background-color: $color;
      border-color: darken($color, 10%);
    }
  }
  @at-root #{&}-primary {
    @include btn($them-color);
  }
  @at-root #{&}-warning {
    @include btn($warning-color);
  }
  @at-root #{&}-warning-o {
    color: $warning-color;
    background-color: #fff;
    border-color: $warning-color;
    .iconfont{

    }
  }
  @at-root #{&}-danger {
    @include btn(lighten($error-color,10%));
  }
  @at-root #{&}-block{width: 100%;}
  @at-root #{&}-new{
    border: 1px dashed $them-color;
    color: $them-color;
    &:hover{
      background-color: $them-color;
      color: #ffffff;
    }
  }

  &+.btn{
    margin-left: 10px;
  }
}
.btn-close{color: #c0c4cc;cursor: pointer;}
.btn-close:hover{box-shadow: 0 0 0 rgba(0,0,0,.5)}
</style>
