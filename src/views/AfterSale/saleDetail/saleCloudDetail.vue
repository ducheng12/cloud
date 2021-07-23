<!--  -->
<template>
  <div class="app-container">
    <el-page-header @back="goBack">返回</el-page-header>
    <!--  -->
    <div class="primary">
      <div class="primary-title">退货单信息</div>
      <div class="primary-list" style="padding-top: 12px">
        <div>退款单号:</div>
        <div>{{ allData.afterSaleId || '' }}</div>
      </div>
      <div class="primary-list">
        <div>状态:</div>
        <div>{{ allData.afterSaleStatus.shopMsg || '' }}</div>
      </div>
      <div class="primary-list">
        <div>退货运单号:</div>
        <div>{{ allData.waybillNumber || '' }}</div>
        <div v-if="allData.waybillNumber && allData.waybillNumber && allData.relationPhone" class="lookInfo" @click="logisticsTrajectory(allData)">物流轨迹</div>
      </div>
      <div class="primary-list">
        <div>退货收货人:</div>
        <div>{{ allData.consigneeName }}</div>
        <div style="margin-left:16px;">{{ allData.consigneeTelephone || '' }}</div>
        <div style="margin-left:16px;">{{ allData.consigneeAddress || '' }}</div>
      </div>
      <div class="primary-list">
        <div>退货时间:</div>
        <div>{{ allData.deliverTime || '' }}</div>
      </div>
      <div class="primary-list">
        <div>退款时间:</div>
        <div>{{ allData.finishTime || '' }}</div>
      </div>
    </div>
    <!--  -->
    <div class="primary">
      <div class="primary-title">销售单信息</div>
      <div class="primary-list" style="padding-top: 12px">
        <div>销售单号:</div>
        <div>{{ allData.orderId }}</div>
      </div>
      <div class="primary-list">
        <div>付款时间:</div>
        <div>{{ allData.payTime }}</div>
      </div>
      <div class="primary-list">
        <div>会员账号:</div>
        <div>{{ allData.telephone }}</div>
      </div>
      <div class="primary-list">
        <div>云店名称:</div>
        <div>{{ allData.storeName }}</div>
      </div>
      <div class="primary-list">
        <div>云店账号:</div>
        <div>{{ allData.relationPhone }}</div>
      </div>
      <div class="primary-list">
        <div>配送方式:</div>
        <div>{{ allData.logisticsType === '0' ? '配送' : '自提' }}</div>
      </div>
      <div class="primary-list">
        <div>发货单号:</div>
        <div>{{ allData.shopLogisticsNumber }}</div>
        <div v-if=" allData.logisticsType === '0' && allData.waybillNumber && allData.relationPhone " class="lookInfo" @click="logisticsTrajectory(allData)">物流轨迹</div>
      </div>
    </div>
    <!--  -->
    <div class="primary">
      <div class="primary-title">申请退款商品信息</div>
      <div class="primary-table">
        <public-table :table-head="tableHead" :table-data="tableData" :show-index="showIndex">
        </public-table>
      </div>
      <div v-if="tableData.length > 0" class="primary-price">
        <div>
          合计:<span>￥{{ num }}</span>
        </div>
      </div>
    </div>
    <public-dialog
      :title="'物流轨迹'"
      :visible="returnedPurchaseView"
      :custom-class="'my-dialog'"
      @handle-cancel="returnedPurcancel"
      @after-close="afterClosedre"
    >
      <div style="waybill-info" class="flex_two">
        <div class="widFl">
          物流单号：{{ orderPurchange.data.expName + ' ' }} {{ orderPurchange.data.number }}
          <p v-for="item in orderPurchange.data.list" :key="item.time">{{ item.time }} : {{ item.status }}</p>
        </div>
        <div class="flma">
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
        </div>
      </div>
    </public-dialog>
  </div>
</template>

<script>
import PublicTable from '@/components/Tables/PublicTable'
import { Basic } from '@/api/base'
import PublicDialog from '@/components/Dialog/PublicDialog'
export default {
  components: {
    PublicTable,
    PublicDialog
  },
  filters: {
    afterSaleStatusFilter(afterSaleStatus) {
      if (afterSaleStatus === 'WAIT_VERIFY') {
        return '待审核'
      } else if (afterSaleStatus === 'WAIT_SHIP') {
        return '待换货'
      } else if (afterSaleStatus === 'EXCHANGED') {
        return '已发货'
      } else if (afterSaleStatus === 'FINISHED') {
        return '已完成'
      } else if (afterSaleStatus === 'REJECT') {
        return '已驳回'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      showIndex: true, // 表格序号
      num: '', // 合计
      returnedPurchaseView: false,
      orderPurchange: {
        data: {
          expName: '',
          number: '',
          list: []
        }
      },
      falgs: 0,
      treeDataStatus: [
        '快递收件(揽件)',
        '在途中',
        '正在派件',
        '已签收',
        '派送失败',
        '疑难件',
        '退件签收'
      ],
      // 表头
      tableHead: [
        { label: '商品名称', value: 'goodsName' },
        { label: '规格', value: 'goodsSpecs', width: 360 },
        { label: '单价', value: 'goodsPrice', width: 200 },
        { label: '数量', value: 'goodsNum', width: 200 },
        { label: '退款小计', value: 'goodsMoney', width: 200 }
      ],
      allData: {}, // 数据
      tableData: [] // 表格数据
    }
  },

  computed: {},

  mounted() {
    this.getData()
  },

  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    // 云店查看详情
    detailCloud(id) {
      this.$router.push({
        name: 'StoreManagementDetail',
        query: {
          id: id
        }
      })
    },
    // 供应商详情
    detaiSupplier(id) {
      this.$router.push({
        name: 'DetailsSupplierList',
        query: {
          id: id
        }
      })
    },
    // 物流轨迹
    logisticsTrajectory(id) {
      const vm = this
      Basic.general('getPhoneLogisticsTrack', { waybillNumber: id.waybillNumber, phoneNumber: id.relationPhone }).then(res => {
        const s = JSON.parse(res.data.list)
        vm.returnedPurchaseView = true
        res.data.list = s
        this.orderPurchange = res
        this.falgs = parseInt(res.data.deliverystatus)
      })
    },
    returnedPurcancel() {
      this.returnedPurchaseView = false
    },
    afterClosedre() {
      this.returnedPurchaseView = false
    },
    // 数据处理
    getData() {
      const that = this
      const params = {
        afterSaleId: this.$route.query.afterSaleId
      }
      Basic.general('after_sale/shop/selectAfterSaleShopInfo', params).then(res => {
        const { data } = res
        that.allData = data
        that.tableData = data.goodsList
        const num = []
        that.allData.goodsList.forEach(t => {
          num.push(Number(t.goodsMoney))
          t.goodsPrice = '￥' + t.goodsPrice
          t.goodsMoney = '￥' + t.goodsMoney
        })
        const arr = num
        that.num = arr.reduce((sum, current) => {
          return sum + current
        })
        that.num = parseFloat(that.num).toFixed(2)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.app-container /deep/ .el-table th > .cell {
  font-size: 14px;
  font-weight: 500;
}
.app-container /deep/ .el-page-header__left::after {
  display: none;
  color: rgba(0, 0, 0, 0.85);
}
.app-container /deep/ .el-page-header__title {
  font-size: 20px;
  font-weight: 500;
}
.app-container {
  .page-header {
    background: #fff;
    border-radius: 4px 4px 0 0;
    padding: 10px 0;
  }
  .primary {
    // background: #cccccc;
    width: 100%;
    padding-top: 18px;
    color: rgba(0, 0, 0, 0.85);
    .primary-title {
      font-weight: 500;
      font-size: 20px;
    }
    .primary-list {
      display: flex;
      font-size: 16px;
      padding: 8px 12px 8px 12px;
      div:nth-child(1) {
        // background: red;
        width: 120px;
        text-align: right;
      }
      div:nth-child(2) {
        // background: blue;
        padding-left: 6px;
        color: rgba(0, 0, 0, 0.45);
        overflow: hidden;
      }
    }
    .primary-table {
      //background: #cccccc;
      width: 100%;
      padding-top: 18px;
    }
    .primary-price {
      width: 100%;
      padding-top: 18px;
      padding-right: 140px;
      text-align: right;
      div {
        font-size: 16px;
        font-weight: bold;
        span {
          color: #ff4d4f;
          padding-left: 40px;
          font-weight: 400;
        }
      }
    }
  }
}
.initClass {
  height: 36px;
  line-height: 36px;
  padding-left: 28px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  .before-line {
    position: absolute;
    top: 0;
    left: 10px;
    width: 2px;
    height: 36px;
    background: rgba(0, 0, 0, 0.06);
  }
  .before-active {
    position: absolute;
    top: 50%;
    left: 7px;
    width: 8px;
    height: 8px;
    transform: translateY(-50%);
    border: 2px solid #999999;
    border-radius: 8px;
    // display: none;
  }
  &:hover {
    color: #005AA0;
  }
}
.initClass.active {
  color: #005AA0;
  .before-active {
    display: block;
    border: 2px solid #005AA0;
  }
}
.flma{
  flex: 1;
  margin-top: 10px;
}
.widFl {
  flex:3;
  padding-right:20px;
}
.flex_two{
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.app-container /deep/ .my-dialog {
  width: 600px;
}
.lookInfo{
  color:#409eff;
  font-size: 14px;
  cursor: pointer;
  margin-left:10px;
}
</style>
