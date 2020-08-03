<template>
  <div class='record'>
      <div class="title">
        <icon name="mine3" class="title-icon" ></icon>
        <h4>全部记录</h4>  
      </div>
      <div class="center">
        <div class="center-top">
            <div v-for="(value,key) in transFilter" :key='value' @click="getTransList(key)" class="option">
            <div class="txt">{{value}}</div>
          </div>
        </div>
           <div class="center-c">
              <div class="option" v-for="(value,key) in statusFilter" :key='value' @click="getStatusList(key) ">
             <div>{{value}}</div>
          </div>
           </div>
          <div class="center-bottom">
            <h4 class="time" @click="test()">时间</h4>
            <Row>
                  <DatePicker type="date" placeholder="Select date" class='select1' ></DatePicker>
                  <DatePicker type="date" placement="bottom-end" placeholder="Select date" class="select" ></DatePicker>
            </Row>
        </div>
      </div>
      <Table height="1000px" :columns="columns1" :data="infos" style="border:none;backgroundColor:white"></Table>
  </div>
</template>

<script>
import {formatDate,getStatus} from '../../filters.js'
import '../../icons/mine3'
export default {
        data () {
            return {
                columns1: [
                    {
                        title: '类别',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    style: {
                                        marginRight: '5px',
                                        width:'29px',
                                        height:'29px',
                                    },
                                    attrs:{
                                       src:params.row.avatar,
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '订单时间',
                        key: 'createAt',
                        render: (h, params) => {
                            return h('div', formatDate(params.row.createAt,'yyyy-MM-dd hh:mm:ss'));
                        }
                    },
                    {
                        title: '名称|帐号|订单号',
                        key: 'orderId',
                        render: (h, params) => {
                            return h('div', params.row.orderId);
                        }
                    },
                    {
                        title: '金额|明细',
                        key: 'money',
                        render: (h, params) => {
                            return h('div', params.row.usd);
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            console.log(params.row.type);
                            return h('div', getStatus(params.row.type,params.row.status));
                        }
                    },
                    {
                        title: '备注',
                        key: 'comment',
                        render: (h, params) => {
                            return h('div', params.row.comment);
                        }
                    },
                    {
                        title: '操作',
                        key: 'address'
                    }
                ],
               infos:[],
               transFilter:["全部","充值","提现"],
               transKey: 0,
               statusKey: 0,
               statusFilter:["全部","进行中","成功","失败"]
            }
        },
        mounted(){
          this.getTransList(0); //获取全部
        },
        methods:{
           getTransList(key){
             this.transKey = key;
             let params = {
               type: key
             }
             if (this.statusKey > 0) {
               params.status = this.statusKey;
             }
             //充值或提现
             if (key == 1 || key == 2){
                this.$getWithdrawDepositList(params,res=>{
                  this.infos = res.data.info;
                  console.log(res.data)
                })
            //充值和提现
             }else if (key == 0 ){
                this.transKey = 8;
                params.type = this.transKey;
                this.$getWithdrawDepositList(params,res=>{
                  this.infos = res.data.info;
                })
             //转账
             }
          },
          getStatusList(key){
            this.statusKey = key;
            let params = {
               type: this.transKey
             }
            if(key > 0){
              this.statusKey = key+2;
              params.status = this.statusKey;
            }
            if (this.transKey != 3) {
                this.$getWithdrawDepositList(params,res=>{
                  this.infos = res.data.info;
                })
            }else {

            }
        }
    }   
}


</script>
<style lang='stylus' scoped>
.record
  margin-left 308px
  .title
    margin-top 88px
    margin 14px
    height:30px;
    .title-icon
      float left 
      width:20px;
      height:18px;
      margin 7px 12px 5px 0
    h4 
      float left
      width:102px;
      height:30px;
      font-size:18px;
      font-family:MicrosoftYaHei-Bold,MicrosoftYaHei;
      font-weight:bold;
      color:rgba(98,105,127,1);
      line-height:30px;
  .center
    height:150px;
    background:rgba(245,246,250,1);
    margin-bottom 13px
    position relative
    .center-top
        height 20px
        position absolute
        top 65px
        left 21px
        font-size:14px;
        font-family:MicrosoftYaHei;
        color:rgba(102,102,102,1);
        line-height 20px;
        .txt
          float left
        .option
          float left
          height:19px
          margin-right 48px
          cursor pointer
          &:hover
            color #3674D7
    .center-c
      height 20px
      margin-top 20px
      position absolute
      font-size:14px;
      font-family:MicrosoftYaHei;
      color:rgba(102,102,102,1);
      line-height:20px;
      top 90px
      left 21px
      .txt
        float left
        margin-right 48px
      .option
        height:19px;
        font-size:14px;
        font-family:MicrosoftYaHei;
        line-height:19px;  
        float left
        margin-right 48px
        cursor pointer
        &:hover
          color #3674D7
    .center-bottom
      position absolute
      top 17px
      left 21px
      height 32px
      .time 
        margin-right 48px
        min-width:28px;
        height:19px;
        font-size:14px;
        font-family:MicrosoftYaHei;
        color:rgba(102,102,102,1);
        line-height:19px;
      .select1
        position absolute
        top -26px
        left 76px
        width:160px;
        height:28px;
        background:rgba(255,255,255,1);
        border-radius:4px;
      .select
        position absolute
        top -26px
        left 257px
        width:160px;
        height:28px;
        background:rgba(255,255,255,1);
        border-radius:4px;

</style>
