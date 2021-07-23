<!-- 供应商列表 -->
<template>
  <div class="app-container">
    <el-form :ref="filterForm" :inline="true" :model="filterForm" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="filterForm.supplierName"
          class="wid220"
          clearable
          placeholder="供应商名称"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filterForm.storeName"
          class="wid220"
          clearable
          placeholder="门店名称"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="typeTime" class="wid120" placeholder="时间类型">
          <el-option label="创建时间" :value="0"></el-option>
          <el-option label="发货时间" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="dateRange">
        <el-date-picker
          v-model="filterForm.dateRange"
          class="wid330"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filterForm.purchaseId"
          class="wid220"
          clearable
          placeholder="采购单编号"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filterForm.purchaseStatus" class="wid220" placeholder="采购单状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="待接单" :value="'WAIT_TAKE'"></el-option>
          <el-option label="待付款" :value="'WAIT_PAYMENT'"></el-option>
          <el-option label="待发货" :value="'WAIT_SHIP'"></el-option>
          <el-option label="待收货" :value="'WAIT_RECEIVE'"></el-option>
          <el-option label="已完成" :value="'FINISHED'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="wid78"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
        <el-button class="wid78" plain icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <public-table :table-head="tableHead" :table-data="tableData" :show-index="showIndex">
      <template slot="purchaseGoodsMoney" slot-scope="slotProps">
        ￥<span>{{ slotProps.data.purchaseGoodsMoney || '0.00' }}</span>
      </template>
      <template slot="serviceMoney" slot-scope="slotProps">
        ￥<span>{{ slotProps.data.serviceMoney ||'0.00' }}</span>
      </template>
      <template slot="freightMoney" slot-scope="slotProps">
        ￥<span>{{ slotProps.data.freightMoney || '0.00'}}</span>
      </template>
      <template slot="totalMoney" slot-scope="slotProps">
        ￥<span>{{ slotProps.data.payable || '0.00' }}</span>
      </template>
      <template slot="purchaseStatus" slot-scope="slotProps">
        <div class="status">
          <span class="status-color" :style="{ background: slotProps.data.statusColor }"></span>
          <span>{{ slotProps.data.orderStatusValue }}</span>
        </div>
      </template>
      <template slot="logisticsInfo" slot-scope="slotProps">
        <span v-if="slotProps.data.logisticsCompany !== 'NONE'">{{ slotProps.data.logisticsCompany }}</span>
        {{ slotProps.data.waybillNumber }}
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="handleEdit(slotProps.data)">详情</el-button>
        <el-button
          v-if="slotProps.data.waybillNumber && slotProps.data.telephone"
          type="text"
          @click="handleInfo(slotProps.data)"
        >物流轨迹</el-button>
        <el-button
          v-if="false"
          type="text"
          class="colfaad14"
          @click="returnGoods(slotProps.data)"
        >退货申请</el-button>
      </template>
    </public-table>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
    <!-- 物流轨迹弹窗 -->
    <public-dialog
      :title="dialogTitle"
      :visible="returnedPurchaseView"
      :custom-class="mydialogs"
      @handle-cancel="returnedPurcancel"
      @after-close="afterClosedre"
    >
      <div v-if="showTypeHide === 1">
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
      </div>
      <el-form v-if="showTypeHide == 2" :model="formDatas" size="small" label-width="">
        <el-form-item v-for="(item, index) in formDatas" :key="index">
          <span style="display: inline-block; width: 20px">{{ index + 1 }}.</span>商品名称：<el-input
            v-model="item.goodsName"
            disabled
            size="small"
            style="width: 90px"
            placeholder="商品名称"
          ></el-input>
          商品编码：<el-input
            v-model="item.goodsNo"
            disabled
            size="small"
            style="width: 160px"
            placeholder="商品编码"
          ></el-input>
          退货数量：<el-input
            v-model.number="item.goodsNum"
            disabled
            size="small"
            style="width: 90px"
            placeholder="商品数量"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-if="showTypeHide == 2">
        <hr style="border: 0;height: 1px;background: rgba(0, 0, 0, 0.06);width: 640px;margin-left: -24px;">
        <el-button
          size="small"
          style="position: relative; right: -400px; top: 10px"
          @click="returnedPurchase()"
        >同意退货</el-button>
        <el-button
          type="primary"
          size="small"
          style="position: relative; right: -400px; top: 10px"
          @click="refuseReturn"
        >拒绝退货</el-button>
      </template>
    </public-dialog>
  </div>
</template>
<script>
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import PublicDialog from '@/components/Dialog/PublicDialog'
import { Basic } from '@/api/base'

export default {
  components: {
    PublicTable,
    Pagination,
    PublicDialog
  },
  data() {
    return {
      treeDataStatus: [
        '快递收件(揽件)',
        '在途中',
        '正在派件',
        '已签收',
        '派送失败',
        '疑难件',
        '退件签收'
      ],
      falgs: 0,
      mydialogs: 'my-dialog',
      dialogTitle: '',
      showIndex: false, // 表格序号
      returnedPurchaseView: false,
      orderPurchaing: [],
      outOrder: {},
      orderPurchange: {
        data: {
          expName: '',
          number: '',
          list: []
        }
      },
      exformDatas: {},
      formDatas: {},
      showTypeHide: '',
      tableHead: [
        { label: '采购单编号', value: 'orderId', width: 192 },
        { label: '商品金额', type: 'slot', slotName: 'purchaseGoodsMoney', width: 140 },
        { label: '服务费用', type: 'slot', slotName: 'serviceMoney', width: 140 },
        { label: '运费', type: 'slot', slotName: 'freightMoney', width: 140 },
        { label: '应付金额', type: 'slot', slotName: 'totalMoney', width: 140 },
        { label: '采购单状态', type: 'slot', slotName: 'purchaseStatus', width: 140 },
        { label: '门店名称', value: 'storeName', width: 177 },
        { label: '供应商名称', value: 'supplierName', width: 160 },
        { label: '创建时间', value: 'createTime', width: 178 },
        { label: '发货时间', value: 'deliverTime', width: 178 },
        { label: '门店备注', value: 'remark', width: 120 },
        { label: '供应商备注', value: 'supplierRemark', width: 120 },
        { label: '物流信息', value: 'logisticsVOList', type: 'slot', slotName: 'logisticsInfo', width: 230 },
        { label: '操作', type: 'slot', slotName: 'handle', width: 240 }
      ],
      tableData: [],
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      typeTime: 0,
      filterForm: {
        supplierName: '',
        storeName: '',
        status: '',
        dateRange: '',
        purchaseId: '',
        typeTime: 0,
        purchaseStatus: '' 
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 查询
    handleQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      vm.getTableData()
    },
    // 获取列表数据
    getTableData() {
      const vm = this
      const params = {
        supplierName: vm.filterForm.supplierName,
        storeName: vm.filterForm.storeName,
        purchaseId: vm.filterForm.purchaseId,
        purchaseStatus: vm.filterForm.purchaseStatus
      }
      if (vm.filterForm.dateRange && vm.filterForm.dateRange.length) {
        if (vm.typeTime === 0) {
          params.createStartTime = vm.filterForm.dateRange[0] + ' 00:00:00'
          params.createEndTime = vm.filterForm.dateRange[1] + ' 23:59:59'
        } else {
          params.deliverStartTime = vm.filterForm.dateRange[0] + ' 00:00:00'
          params.deliverEndTime = vm.filterForm.dateRange[1] + ' 23:59:59'
        }
      }
      params.pageNum = vm.currentPage
      params.pageSize = vm.pageSize
      Basic.general('purchase/selectListPage', params).then(res => {
        const { data } = res
        const { total = 0, records = [] } = data
        vm.sumTotal = total
        records.forEach(t => {
          if (t.logisticsVOList === null) {
            t.logisticsVOList = []
          }

          const arr = t.logisticsVOList
          if (arr.length !== 0) {
            t.logistics = arr[0].primaryId
          } else {
            t.logistics = ''
          }
        })
        vm.tableData = records
        vm.tableData.forEach(i => {
          switch (i.orderStatusValue) {
            case '待接单':
              i.statusColor = '#FAAD14'
              break
            case '待付款':
              i.statusColor = '#FAAD14'
              break
            case '待发货':
              i.statusColor = '#1890FF'
              break
            case '待收货':
              i.statusColor = '#FF4D4F'
              break
            case '已完成':
              i.statusColor = '#52C41A'
              break
            default:
              i.statusColor = '#cccccc'
              break
          }
        })
      })
    },
    // 重置
    reset() {
      const vm = this
      vm.filterForm.supplierName = ''
      vm.filterForm.storeName = ''
      vm.filterForm.status = ''
      vm.filterForm.dateRange = ''
      vm.filterForm.purchaseId = ''
      vm.typeTime = 0
      vm.filterForm.purchaseStatus = ''
      vm.handleQuery()
    },
    // 详情
    handleEdit(data) {
      this.$router.push({
        path: 'purchasing-list/purchasing-details',
        query: {
          purchaseId: data.orderId
        }
      })
    },
    returnGoods(d) {
      // 申请退货
      this.outOrder = d
      this.dialogTitle = '申请退货'
      this.showTypeHide = 2
      this.mydialogs = 'mydialogs'
      const vm = this
      Basic.general('purchase/detail/goods/list', { purchaseId: d.purchaseId }).then(res => {
        if (res.code === 200) {
          this.returnedPurchaseView = true
          vm.formDatas = res.data
        }
      })
    },
    returnedPurcancel() {
      this.returnedPurchaseView = false
    },
    afterClosedre() {
      this.returnedPurchaseView = false
    },
    // 同意退货
    returnedPurchase() {
      this.returnedPurchaseView = false
      const params = this.formDatas
      const paramsQuery = {
        purchaseId: this.outOrder.purchaseId,
        remark: this.outOrder.remark,
        returnDetail: []
      }
      params.forEach(i => {
        const obj = {
          goodsName: i.goodsName,
          skuId: i.skuCode,
          amount: i.goodsNum
        }
        paramsQuery.returnDetail.push(obj)
      })
      Basic.normal('purchase/createReturnOrder', paramsQuery).then(res => {
        if (res.code === 200) {
          this.$message({ message: '保存成功', type: 'success' })
        }
      })
    },
    // 拒绝退货
    refuseReturn() {
      this.returnedPurchaseView = false
    },
    // 物流轨迹
    handleInfo(data) {
      console.log(data)
      const vm = this
      vm.dialogTitle = '物流轨迹'
      vm.showTypeHide = 1
      vm.mydialogs = 'mydialogs'
      Basic.general('getPhoneLogisticsTrack', { waybillNumber: data.waybillNumber, phoneNumber: data.telephone }).then(res => {
        vm.returnedPurchaseView = true
        vm.acitveName = data.waybillNumber
        const s = JSON.parse(res.data.list)
        res.data.list = s
        this.orderPurchange = res
        this.falgs = parseInt(res.data.deliverystatus)
      })
    },
    // 分页
    handlePageSize(val) {
      this.pageSize = val
      this.getTableData()
    },
    handlePageCurrent(val) {
      this.currentPage = val
      this.getTableData()
    },
    async handleSearch() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      let params = JSON.parse(JSON.stringify(vm.filterForm))
      const { dateRange = [] } = params
      if (dateRange.length) {
        params.startTime = dateRange[0]
        params.endTime = dateRange[1]
      }
      params = vm.initParams(params)
      vm.getTableData()
    },
    initParams(params) {
      if (JSON.stringify(params) !== '{}') {
        const obj = JSON.parse(JSON.stringify(params))
        const data = {}
        for (const key in obj) {
          if (obj[key] !== '' && obj[key] !== undefined) {
            data[key] = obj[key]
          }
        }
        return data
      } else {
        return {}
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.status {
  .status-color {
    float: left;
    width: 8px;
    height: 8px;
    margin: 6px;
    border: none;
    border-radius: 10px;
  }
}
.app-container /deep/ .my-dialog {
  width: 480px;
}
.public-dialog /deep/ .el-dialog__body {
  overflow: hidden;
}
.wid220 {
  width: 220px !important;
  font: size 14px !important;
}
.wid330 {
  width: 330px !important;
  font: size 14px !important;
}
.wid120 {
  width: 120px !important;
  font: size 14px !important;
}
.wid78 {
  width: 78px;
  font-size: 14px !important;
}
.name {
  display: inline-block;
  width: 100px;
}
.tabActive {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}
.mydialogs{
  width: 700px !important;;
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
</style>
