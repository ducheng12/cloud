<!--  -->
<template>
  <div class="app-container">
    <!-- 头部搜索 -->
    <div style="position:relative;">
      <searchForm class="searchFrom" :option-list="optionList" @handle-query="handleQuery" @handle-clear="handleClear">
      </searchForm>
      <el-button size="small" icon="el-icon-download" style="position:absolute;right:0;top:2px;" @click="exportHand">
        {{ alterSaleIdsList.length > 1 ? '导出数据' : '导出数据' }}
      </el-button>
    </div>
    <public-table
      :table-head="tableHead"
      :table-data="tableData"
      :show-select="showSelect"
      :show-index="showIndex"
      style="margin-top: 10px"
      @handle-selection="handleSelection"
    >
      <template slot="retreatStatus" slot-scope="slotProps">
        <div class="status">
          <span class="status-color" :style="{ background: slotProps.data.statusColor }"></span>
          <span>{{ slotProps.data.afterSaleStatus.userMsg }}</span>
        </div>
      </template>
      <template slot="totalMoney" slot-scope="slotProps">
        ￥<span>{{ slotProps.data.totalMoney }}</span>
      </template>
      <template slot="goodsMoney" slot-scope="slotProps">
        ￥<span>{{ slotProps.data.goodsMoney }}</span>
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="goDetail(slotProps.data)"> 详情 </el-button>
        <el-button
          v-if="false"
          type="text"
          :disabled="slotProps.data.retreatStatus != '平台介入'"
          @click="consent(slotProps.data)"
        >
          同意
        </el-button>
        <el-button
          v-if="false"
          type="text"
          :disabled="slotProps.data.retreatStatus != '平台介入'"
          :style="{ color: slotProps.data.retreatStatus != '平台介入' ? '#cccccc' : 'red' }"
          @click="reject(slotProps.data)"
        >
          驳回
        </el-button>
      </template>
    </public-table>
    <!-- 分页 -->
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
    <!-- <el-button style="margin-top: 20px;" size="small" @click="consentBatch">批量同意</el-button>
    <el-button style="margin-top: 20px;" size="small" @click="rejectBatch">批量拒绝</el-button> -->
  </div>
</template>

<script>
import fileDownload from 'js-file-download'
import { Basic } from '@/api/base'
import searchForm from '@/components/Search/searchForm'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  components: {
    searchForm,
    PublicTable,
    Pagination
  },
  filters: {
    orderTypeFilter(orderType) {
      if (orderType === 'NORMAL_ORDER') {
        return '普通订单'
      } else if (orderType === 'EXCHANGE_ORDER') {
        return '换货订单'
      } else {
        return ''
      }
    },
    orderSourceFilter(orderSource) {
      if (orderSource === 'APPLETS') {
        return '小程序'
      } else if (orderSource === 'APP') {
        return 'APP'
      } else if (orderSource === 'PC') {
        return 'PC'
      } else if (orderSource === 'H5') {
        return 'H5'
      } else {
        return ''
      }
    },
    logisticsCompanyFilter(logisticsCompany) {
      if (logisticsCompany === 'YTO_EXPRESS') {
        return '圆通快递'
      } else if (logisticsCompany === 'SF_EXPRESS') {
        return '顺丰快递'
      } else if (logisticsCompany === 'STO_EXPRESS') {
        return '申通快递'
      } else if (logisticsCompany === 'ZTO_EXPRESS') {
        return '中通快递'
      } else if (logisticsCompany === 'YUN_DA_EXPRESS') {
        return '韵达快递'
      } else if (logisticsCompany === 'EMS') {
        return '邮政快递'
      } else {
        return ''
      }
    },
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
    },
    payMethodFilter(payMethod) {
      if (payMethod === 'ALIPAY') {
        return '支付宝'
      } else if (payMethod === 'WECHAT') {
        return '微信'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      showSelect: true, // 表格多选
      showIndex: false, // 表格序号
      searchData: {},
      retreatId: '', // 换货单号
      retreatStatus: '', // 售后状态
      alterSaleIdsList: [], // 批量换货单号
      multipleSelection: [],
      rejectList: [],
      type: true, // 同意&驳回
      // 订单状态
      optionsStatus: [
        { value: '待审核', label: '待审核', color: '#FAAD14' },
        { value: '待退货', label: '待退货', color: '#FAAD14' },
        { value: '待退款', label: '待退款', color: '#1890FF' },
        { value: '已驳回', label: '已驳回', color: '#FF4D4F' },
        { value: '售后完成', label: '售后完成', color: '#52C41A' },
        { value: '平台介入', label: '平台介入', color: '#cccccc' }
      ],
      // 搜索
      optionList: [
        {
          label: '',
          type: 'input',
          placeholder: '退货单编号/销售单号/会员账号/云店名称',
          key: 'searchKeywords',
          width: '330'
        }
      ],
      // 表头
      tableHead: [
        { label: '退货单编号', value: 'afterSaleId' },
        { label: '销售单号', value: 'orderId' },
        { label: '会员账号', value: 'telephone' },
        { label: '云店名称', value: 'storeName' },
        { label: '销售单总金额', type: 'slot', slotName: 'totalMoney' },
        { label: '申请退款金额', type: 'slot', slotName: 'goodsMoney' },
        { label: '售后状态', type: 'slot', slotName: 'retreatStatus' },
        { label: '申请退款时间', value: 'createTime' },
        { label: '退款时间', value: 'payTime' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 150 }
      ],
      // 表格数据
      tableData: [],
      // 分页配置
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  // watch: {
  //   // 监听批量
  //   multipleSelection(newValue) {
  //     const vm = this
  //     vm.rejectList = newValue.filter(t => t.afterSaleStatus !== 'WAIT_VERIFY')
  //   }
  //   // immediate: true,
  //   // deep: true
  // },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 数据列表
    getTableData() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.searchData))
      params.pageNum = vm.currentPage
      params.pageSize = vm.pageSize
      Basic.general('after_sale/shop/selectListPage', params).then(res => {
        if (res.code === 200) {
          const { data } = res
          const arr = data.records
          vm.tableData = arr.map(i => {
            const { afterSaleStatus } = i
            console.log(vm.optionsStatus)
            const activeItem = vm.optionsStatus.filter(i => i.value === afterSaleStatus.userMsg)
            if (activeItem.length) {
              i.statusColor = activeItem[0].color
              i.statusName = activeItem[0].label
            }
            return i
          })
          vm.sumTotal = data.total
          vm.tableData.forEach(i=>{
            switch (i.afterSaleStatus.userMsg) {
              case '买家已退货':
                i.statusColor = '#FAAD14'
                break
              case '待付款':
                i.statusColor = '#FAAD14'
                break
              case '待发货':
                i.statusColor = '#1890FF'
                break
              case '待处理':
                i.statusColor = '#FF4D4F'
                break
              case '退款成功':
                i.statusColor = '#52C41A'
                break
              default:
                i.statusColor = '#cccccc'
                break
            }
          })
        }
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
    // 查询
    handleQuery(e) {
      const that = this
      that.searchData = Object.assign(e)
      that.currentPage = 1
      that.$refs.myPagination.currentPage = 1
      that.getTableData()
    },
    // 重置
    handleClear() {
      const that = this
      that.searchData = {}
      that.currentPage = 1
      that.$refs.myPagination.currentPage = 1
      that.getTableData()
    },
    // 多选
    handleSelection(e) {
      const that = this
      if (e && e.length > 0) {
        that.alterSaleIdsList = e.map(item => item.afterSaleId)
      } else {
        that.alterSaleIdsList = []
      }
      that.multipleSelection = e
    },
    // 同意
    consent(e) {
      const that = this
      this.$confirm('此操作将同意退货, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.retreatId = e.retreatId
          that.retreatStatus = '售后完成'
          that.audit()
          that.retreatId = ''
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            center: true,
            duration: 500
          })
          that.retreatId = ''
        })
    },
    // 驳回
    reject(e) {
      this.$confirm('此操作将驳回退货, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const that = this
          that.retreatId = e.retreatId
          that.retreatStatus = '已驳回'
          that.audit()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            center: true,
            duration: 500
          })
        })
    },
    // 批量同意
    consentBatch() {
      const that = this
      if (that.alterSaleIdsList.length > 0) {
        const alterSaleIdsList = JSON.parse(JSON.stringify(that.alterSaleIdsList))
        that.type = false
        const params = {
          alterSaleIds: alterSaleIdsList,
          type: true
        }
        Basic.general('/order/after_sale/verify/ssss', params).then(res => {
          if (res.code === 200) {
            that.getTableData()
            this.$message({
              type: 'success',
              message: '操作成功!',
              center: true,
              duration: 500
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择订单!',
          center: true,
          duration: 500
        })
      }
    },
    // 批量驳回
    rejectBatch() {
      const that = this
      if (that.alterSaleIdsList.length > 0) {
        const alterSaleIdsList = JSON.parse(JSON.stringify(that.alterSaleIdsList))
        that.type = false
        const params = {
          alterSaleIds: alterSaleIdsList,
          type: false
        }
        Basic.general('/order/after_sale/verify/sss', params).then(res => {
          if (res.code === 200) {
            that.getTableData()
            this.$message({
              type: 'success',
              message: '操作成功!',
              center: true,
              duration: 500
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择订单!',
          center: true,
          duration: 500
        })
      }
    },
    // 审核方法
    audit() {
      const that = this
      const params = {
        retreatId: that.retreatId,
        retreatStatus: that.retreatStatus
      }
      Basic.normal('after_sale/updateAfterSaleStatus', params).then(res => {
        if (res.code === 200) {
          that.getTableData()
          this.$message({
            type: 'success',
            message: '操作成功!',
            duration: 500
          })
        }
      })
    },
    // 导出
    exportHand() {
      const that = this
      const idList = JSON.parse(JSON.stringify(that.alterSaleIdsList))
      // const url = idList.length ? 'export' : 'export/all'
      const url = idList.length ? 'export' : 'export'
      const params = idList.length ? { afterSaleIds: idList } : {}
      if (that.tableData.length === 0) {
        that.$message.warning('暂无数据！')
        return
      }
      if (idList.length === 0) {
        that.$message.warning('请选择导出数据！')
        return
      }
      that.$axios
        .get(`${process.env.VUE_APP_BASE_API}/after_sale/shop/${url}`, {
          responseType: 'blob',
          headers: {
            Authorization: getToken(),
            source: 4
          },
          params
        })
        .then(res => {
          fileDownload(res.data, '云店售后单.xlsx')
        })
        .catch(err => {
          const { response } = err
          if (response.status && response.status === 401) {
            that.$message.error('暂无操作权限，请联系管理员！')
          }
        })
    },
    // 跳转详情
    goDetail(row) {
      this.$router.push({
        path: 'sales-cloud/sales-detail',
        query: {
          afterSaleId: row.afterSaleId
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
/deep/ .searchFrom .el-input--small .el-input__inner{
  width:330px;
}
</style>
