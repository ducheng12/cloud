<!--销售单详情-->
<template>
  <div class="app-container">
    <div style="cursor: pointer;" class="app-nav" @click="goBack">
      <i class="el-icon-back icons"></i>
      <span class="hyName">返回</span>
    </div>
    <div style="overflow:hidden">
      <p class="zc" style="float:left;margin-right:20px">订单信息 </p>
      <div style="float:left;">
        <p>订单编号：{{ orderId || null }}</p>
        <p>门店名称：{{ storeName || null }}</p>
        <p>会员昵称：{{ username || null }}</p>
        <p>会员账号：{{ account || null }}</p>
        <p>配送方式：{{ logisticsType }} <span style="margin-left:20px;color:rgb(64, 158, 255);cursor: pointer;" v-if="logisticsTypes && orderId && userId" @click="logisticsTrack(orderId,userId)"> 物流轨迹 </span></p>
      </div>
    </div>

    <div style="overflow:hidden">
      <p class="zc" style="float:left;margin-right:20px">支付信息 </p>
      <div style="float:left;">
        <p>下单时间：{{ createTime || null }}</p>
        <p>支付时间：{{ payTime || null }}</p>
        <p>交易单号：{{ tradeNum || null }}</p>
        <p>完成时间：{{ finishedTime || null }}</p>
      </div>
    </div>

    <public-dialog
      :title="'物流轨迹'"
      :visible="returnedPurchaseView"
      :custom-class="'mydialogs'"
      @handle-cancel="returnedPurcancel"
      @after-close="afterClosedre"
    >
      <div style="waybill-info" class="flex_two">
        <div class="widFl">
          物流单号：{{ orderPurchange.data.expName || '' + ' ' }} {{ orderPurchange.data.number || '' }}
          <p v-for="item in orderPurchange.data.logisticsDetails" :key="item.time">{{ item.time }} : {{ item.status }}</p>
        </div>
        <!-- <div class="flma">
          <div
            v-for=" (item, index) in treeDataStatus "
            :key="item"
            :class="{ active: falgs === index }"
            class="initClass"
          >
            <span class="before-line"></span>
            <span class="before-active"></span>
            {{ item }}
          </div>
        </div> -->
      </div>
    </public-dialog>
    <div class="shrxx">商品名称 <hr size="40" /></div>
    <public-table
      :show-index="true"
      :show-select="false"
      :table-head="tableHead"
      :table-data="tableData"
    >
      <template slot="skuPrice" slot-scope="slotProps">
        ￥{{ slotProps.data.skuPrice }}
      </template>
      <template slot="totalPrice" slot-scope="slotProps">
        ￥{{ slotProps.data.totalPrice }}
      </template>
    </public-table>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
    <p style="text-align:right;position: relative;right: calc(20% - 116px);">
      合计：<span style="color:#ff4d4f;">￥{{ totalPrices || 0 }}</span>
    </p>
  </div>
</template>

<script>
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import { Basic } from '@/api/base'
import PublicDialog from '@/components/Dialog/PublicDialog'
export default {
  components: {
    PublicTable,
    Pagination,
    PublicDialog
  },
  filters: {
    orderSourceFilter(source) {
      switch (source) {
        case 1:
          return 'APP'

        case 2:
          return '小程序'

        case 3:
          return 'PC'

        default:
          return '----'
      }
    }
  },
  data() {
    return {
      orderId: '',
      userId: '',
      payTime: '',
      finishedTime: '',
      storeName: '',
      username: '',
      account: '',
      createTime: '',
      tradeNum: '',
      logisticsType: '',
      logisticsTypes: false,
      totalPrices: 0,
      returnedPurchaseView: false,
      orderPurchange: {
        data: {
          expName: '',
          number: '',
          logisticsDetails:[]
        }
      },
      tableHead: [
        { label: '商品名称', value: 'skuName' },
        { label: '商品类型', value: 'goodsType' },
        { label: '售价', type: 'slot', slotName: 'skuPrice' },
        { label: '数量', value: 'skuNum' },
        // { label: '服务费', value: 'serviceMoney' },
        { label: '小计', type: 'slot', slotName: 'totalPrice' }
      ],
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 100000000000,
      tableData: [],
      treeDataStatus: []
    }
  },
  computed: {},
  mounted() {
    this.infoDetail()
  },
  methods: {
    goBack() { // 返回上一级
      this.$router.go(-1)
    },
    // 获取详情页面信息
    infoDetail() {
      const vm = this
      const params = {
        orderId: vm.$route.query.orderId
      }
      Basic.general('admin/shop/order/detail', params).then(res => {
        if (res.code === 200) {
          vm.tableData = res.data.goodsList
          vm.orderId = res.data.orderId
          vm.payTime = res.data.payTime
          vm.finishedTime = res.data.finishedTime
          vm.storeName = res.data.shopName
          vm.username = res.data.nickname
          vm.account = res.data.account
          vm.userId = res.data.userId

          if ( res.data.logisticsType === false) {
            vm.logisticsType = '配送'
            vm.logisticsTypes = true
          } else {
            vm.logisticsType = '自提'
            vm.logisticsTypes = false
          }
          vm.createTime = res.data.createTime
          vm.tradeNum = res.data.tradeNum
          let num = 0
          vm.tableData.forEach(i =>{
            num += parseFloat(i.totalPrice)
          })
          vm.totalPrices = num.toFixed(2)
        }
      })
    },
    // 物流轨迹
    logisticsTrack(id,userId) {
      const params = {
        orderId: id,
        userId: userId
      }
      Basic.general('order/shop/logistics', params).then(res => {
        if (res.code === 200) {
          if (res.data !== null) {
            this.returnedPurchaseView = true
            this.orderPurchange = res
          } else {
            this.$message.warning('暂无数据！')
          }
        }
        // this.falgs = parseInt(res.data.deliverystatus)
      })
    },
    returnedPurcancel() {
      this.returnedPurchaseView = false
    },
    afterClosedre() {
      this.returnedPurchaseView = false
    },
    // 分页
    handlePageSize(val) {
      this.pageSize = val
      this.getTableData()
    },
    // 分页
    handlePageCurrent(val) {
      this.currentPage = val
      this.getTableData()
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep .app-nav {
  height: 66px;
  line-height: 66px;
  position: relative;
}
.icons {
  font-size: 20px;
}
.hyName {
  display: inline-block;
  margin-left: 15px;
  font-size: 20px;
}
.gmcs {
  float: right;
}
.zc {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
}
.xfze {
  position: absolute;
  right: 24px;
  top: 115px;
}
.shrxx {
  padding: 25px 0;
  font-size: 16px;
  position: relative;
  font-family: PingFangSC, PingFangSC-Regular;
}
hr{
  color: rgba(0, 0, 0, 0.85);
  position: absolute;
  left: 0px;
  top: 38px;
  width: 80px;
}
.shri{
  display: inline-block;
  height: 1px;
  background: red;
}
.hyfz{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 250px;
}
.widFl {
  flex:2;
  padding-right:20px;
}
.bg005aa0{
  background: #005aa0
}
.colfaad14{
  color: #faad14
}
.flma{
  flex: 1;
  margin-top: 10px;
}
.flex_two{
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.mydialogs{
  width: 700px !important;;
}
</style>
