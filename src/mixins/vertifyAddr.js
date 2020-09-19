import axios from "@/api/request";

export const vertify = {
    data() {
        return {
        }
    },
    methods: {
        async vertifyAddr() {
            let { checkCoin, checkChain, addressTips, withdrawAddress, coin  } = this;
            if(!withdrawAddress || !coin) return;
            const params = {
                coin: coin,
                address: withdrawAddress
            }
            let res = await axios.vertifyAddress(params);
            const { isValidate } = res.data;
            if(isValidate) return this.addressTips = this.$t('account.addressSuccess');
            return this.addressTips = this.$t('account.addressFail');
        }
    }
}