<!-- 门店列表 -->
<template>
  <div class="app-container">
    <el-form :inline="true" :model="formData" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.searchKey"
          style="width:300px;"
          clearable
          placeholder="销售单编号/商品名称/门店名称"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="formData.orderStatus" placeholder="销售单状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="待取货" :value="0"></el-option>
          <el-option label="交易成功" :value="1"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button plain icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <public-table :table-head="tableHead" :table-data="tableData" :show-index="false">
      <template slot="orderStatus" slot-scope="slotProps">
        <span class="status-color" :style="{ background: slotProps.data.statusColor }"></span>
        {{ slotProps.data.orderStatus.userMsg }}
      </template>
      <template slot="totalMoney" slot-scope="slotProps">
        ￥{{ slotProps.data.totalMoney }}
      </template>
      <template slot="serviceMoney" slot-scope="slotProps">
        ￥{{ slotProps.data.serviceMoney }}
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="handleInfo(slotProps.data)">详情</el-button>
      </template>
    </public-table>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
  </div>
</template>

<script>
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import { Basic } from '@/api/base'

export default {
  components: { PublicTable, Pagination },

  data() {
    return {
      tableHead: [
        { label: '销售单编号', value: 'orderId', width: 200 },
        // { label: '商品名称', value: 'goodsName' },
        { label: '商品数量', value: 'amount' },
        { label: '门店名称', value: 'shopName' },
        // { label: '门店商品金额', value: 'storeTotalMoney', width: 110 },
        // { label: '云档口商品金额', value: 'stallTotalMoney', width: 120 },
        { label: '销售单总金额', type: 'slot', slotName: 'totalMoney', width: 110 },
        { label: '服务费', type: 'slot', slotName: 'serviceMoney' },
        { label: '会员账号', value: 'account' },
        // { label: '会员昵称', value: 'username' },
        { label: '销售单状态', type: 'slot', slotName: 'orderStatus', width: 100 },
        { label: '付款时间', value: 'payTime' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 250 }
      ],
      tableData: [],
      formData: {
        searchKey: ''
      },
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      showAdd: false,
      showApprove: false,
      supplierId1: null,
      supplierId2: null,
      showType: 1,
      searchData: {}
    }
  },

  computed: {},

  mounted() {
    this.getTableData()
  },

  methods: {
    // 查询
    handleQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      const params = {
        searchKey: vm.formData.searchKey || null
      }
      vm.searchData = params
      vm.getTableData()
    },
    // 获取列表数据
    getTableData() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.searchData))
      params.pageNum = vm.currentPage
      params.pageSize = vm.pageSize
      Basic.general('admin/shop/order/page', params).then(res => {
        const { data } = res
        const { total = 0, records = [] } = data
        vm.sumTotal = total
        const arr = records.map(t => {
          t.statusName = t.status === 1 ? '审核通过' : '待审核'
          return t
        })
        vm.tableData = arr
        vm.tableData.forEach(i => {
          switch (i.orderStatus.userMsg) {
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
      vm.formData.searchKey = ''
      vm.searchData = JSON.parse(JSON.stringify(vm.formData))
      vm.$nextTick(_ => {
        vm.getTableData()
      })
    },
    // 查看详情
    handleInfo(data) {
      this.$router.push({
        path: 'storemanagementinfo-list/storemanagement-infor',
        query: {
          orderId: data.orderId
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
    }
  }
}
</script>
<style lang='scss' scoped>
.app-container /deep/ .filter-view {
  width: 480px;
}
.status-color {
    float: left;
    width: 8px;
    height: 8px;
    margin: 6px;
    border: none;
    border-radius: 10px;
  }
</style>
