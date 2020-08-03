<template>
  <div class="download-b">
    <div class="first">
      <a href="https://apps.apple.com/us/app/id1516993350">
        <div class="df">
          <div class="apple"></div>
          <div class="writing">
            <span class="top">下载</span>
            <span class="bt">Ios版</span>
          </div>
        </div>
      </a>
      <div class="ds">
        <div class="robot"></div>
        <div class="writing">
          <span class="top">下载</span>
          <span class="bt">Android版</span>
        </div>
      </div>
    </div>
    <div class="second">
      <div class="dt">
        <div class="group"></div>
        <div class="writing">
          <span class="top">下载</span>
          <span class="bt">Google</span>
        </div>
      </div>
      <div class="dfo">
        <div class="code"></div>
        <div class="qrcode">
          <div class="inner-qrcode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "downloadVersion",
  data() {
    return {
      isActive: false,
      active: true,
      isShow: false
    }
  },
  methods: {
  }
};
</script>
<style lang='stylus' scoped>
.download-b {
  height: 115px;
  margin-top: 60px;

  .first {
    height: 48px;
    margin-bottom: 37px;

    .df {
      margin-right: 31px;
      width: 160px;
      height: 48px;
      border: 1px solid #fff;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
      border-radius: 24px;
      float: left;
      cursor: pointer;
      transition: all .3s ease-out;
      &:hover {
        background-color: white;

        .apple {
          background-image: url('../../assets/imgs/apple2.png');
        }

        .writing {
          .top {
            color: #333333;
            text-shadow: none;
          }

          .bt {
            color: #6F6F6F;
            text-shadow: none;
          }
        }
      }

      .apple {
        margin: 5px 0 5px 40px;
        float: left;
        width: 34px;
        height: 38px;
        background-image: url('../../assets/imgs/apple1.png');
        background-repeat: no-repeat;
        background-position: 0 50%;
      }

      .writing {
        margin: 5px 0 5px 9px;
        float: left;

        .top {
          display: block;
          width: 29px;
          height: 19px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: white;
          line-height: 19px;
        }

        .bt {
          display: block;
          width: 68px;
          height: 19px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: white;
          line-height: 19px;
        }
      }
    }

    .ds {
      cursor: pointer;
      width: 160px;
      height: 48px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 1);
      float: left;
      transition: all .3s ease-out;
      &:hover {
        background-color: white;

        .robot {
          background-image: url('../../assets/imgs/robot.png');
        }

        .writing {
          .top {
            color: #333333;
            text-shadow: none;
          }

          .bt {
            color: #6F6F6F;
            text-shadow: none;
          }
        }
      }

      .robot {
        float: left;
        width: 34px;
        height: 37px;
        margin: 6px 0px 5px 21px;
        background-image: url('../../assets/imgs/robot1.png');
        background-repeat: no-repeat;
        background-position: 50% 50%;
      }

      .writing {
        margin: 5px 0 5px 9px;
        float: left;

        .top {
          display: block;
          width: 29px;
          height: 19px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
          line-height: 19px;
        }

        .bt {
          display: block;
          width: 70px;
          height: 19px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
          line-height: 19px;
        }
      }
    }
  }

  .second {
    .dt {
      cursor: pointer;
      margin-right: 31px;
      box-sizing: border-box;
      width: 160px;
      height: 48px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 1);
      float: left;
      transition: all .3s ease-out;
      &:hover {
        background-color: white;

        .group {
          background-color: #000000;
        }

        .writing {
          .top {
            color: #333333;
            text-shadow: none;
          }

          .bt {
            color: #6F6F6F;
            text-shadow: none;
          }
        }
      }

      .group {
        float: left;
        width: 17px;
        height: 18px;
        mask-image: url('../../assets/imgs/group.svg');
        background-color: white;
        margin: 15px 0 15px 43px;
      }

      .writing {
        margin: 5px 0 5px 9px;
        float: left;

        .top {
          display: block;
          width: 29px;
          height: 19px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
          line-height: 19px;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .bt {
          display: block;
          width: 49px;
          height: 19px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
          line-height: 19px;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
        }
      }
    }

    .dfo {
      cursor: pointer;
      width: 160px;
      height: 48px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 1);
      float: left;
      transition: all .3s ease-out;
      position: relative;
      &:hover {
        background-color: white;
        .code {
          background-color: #000000;
        }
        .qrcode {
          visibility: visible;
          opacity: 1;
          transform: scaleY(1);
        }
      }

      .code {
        width: 30px;
        height: 30px;
        mask-image: url('../../assets/imgs/qrcode.svg');
        background-color: white;
        margin: 9px 65px;
      }

      .qrcode {
        visibility: hidden;
        position: absolute;
        top: 68px;
        left: 0;
        width: 153px;
        height: 139px;
        border-radius: 8px;
        background: #fff;
        transition: all .2s ease-in;
        transform: scaleY(0);
        transform-origin: center top;
        opacity: 0;
        .inner-qrcode{
          width: 140px;
          height: 126px;
          background: #D8D8D8;
          margin: 6px auto;
        }
      }
    }
  }
}
</style>