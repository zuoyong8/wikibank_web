<template>
  <!--提示地址簿-->
  <ModalMask
    :isShowModal="isShowAddressModal"
    :isHideMask="isHideAddressMask"
    @closeModal="closeAddressModal"
    @openModal="openAddressModal"
  >
    <template v-slot:body>
      <div class="modal-content-1">
        <div class="modal-head">
          <span class="modal-title">{{$t('personCenter.addressBook')}}</span>
        </div>
        <div class="modal-body transfer-body">
          <div class="transfer-list" v-if="addressList.length">
            <div
              class="transfer-item"
              v-for="item in addressList"
              :key="item.id"
              @click="getRadio(item.id, item.address)"
            >
              <div class="withdraw-pic">
                <img :src="item.url" alt class />
              </div>
              <div class="withdraw-right">
                <div class="detail">
                  <span class="withdraw-type">{{item.comment}} ({{item.coin}})</span>
                  <span class="withdraw-code">{{$t("personCenter.address")}}:{{item.address}}</span>
                </div>
                <div class="handle">
                  <span class="radio" :class="index === item.id ? 'active':''"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="data" v-else>
            {{$t('login.withoutData')}}
          </div>
        </div>
      </div>
    </template>
  </ModalMask>
</template>

<script>
import ModalMask from "../components/ModalMask";
export default {
  name: "AddressList",
  components: {
    ModalMask,
  },
  props: {
    addressList: Array,
    isHideAddressMask: Boolean,
    isShowAddressModal: Boolean,
    index: Number,
  },
  methods: {
    // 选择地址
    getRadio(id, address) {
      this.$emit("getRadio", id, address);
    },
    openAddressModal(isShow) {
      this.$emit("openAddressModal", isShow);
    },
    closeAddressModal(isShow) {
      this.$emit("closeAddressModal", isShow);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>