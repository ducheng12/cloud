<!-- 供应商列表 -->
<template>
  <div class="app-container">
    <el-form :inline="true" :model="formData" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.keyWord"
          clearable
          placeholder="供应商名称"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="formData.status" placeholder="审核状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="待审核" :value="0"></el-option>
          <el-option label="审核通过" :value="1"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button plain icon="el-icon-refresh-right" @click="reset">重置</el-button>
        <el-button plain icon="el-icon-plus" @click="handleCreate">新增供应商</el-button>
        <el-button plain icon="el-icon-search" @click="handleFilter">高级筛选</el-button>
      </el-form-item>
    </el-form>
    <public-table :show-index="false" :table-head="tableHead" :table-data="tableData">
      <template slot="auditStatus" slot-scope="slotProps">
        <span v-if="slotProps.data.verifyStatus == 0">待审核</span>
        <span v-if="slotProps.data.verifyStatus == 1" style="color: #98CB87;">审核通过</span>
        <span v-if="slotProps.data.verifyStatus == 2" style="color: red;">审核驳回</span>
      </template>
      <template slot="handle" slot-scope="slotProps">
        <!-- <el-button type="text" :disabled="slotProps.data.status === 1" @click="handleCheck(slotProps.data)">审核</el-button> -->
        <el-button type="text" @click="handleEdit(slotProps.data)">{{ slotProps.data.verifyStatus !== 2 ? '查看' : '编辑' }}</el-button>
        <!-- <el-button type="text" @click="handleInfo(slotProps.data)">详情</el-button> -->
      </template>
    </public-table>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
    <AddView
      key="1"
      :show-add="showAdd"
      :supplier-id="supplierId1"
      :show-type="showType"
      @closed="closeAddView"
    />
    <ApproveView key="2" :show-add="showApprove" :supplier-id="supplierId2" :show-type="showType" @closed="closeApproveView" />
    <public-dialog
      :title="'高级筛选'"
      :visible="filterView"
      :custom-class="'filter-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form ref="filterForm" :model="filterForm" size="small" label-width="102px">
        <el-form-item label="供应商ID/名称" prop="keyWord">
          <el-input v-model="filterForm.keyWord" placeholder="供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="creatorName">
          <el-input v-model="filterForm.creatorName" placeholder="创建人"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="dateRange">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </el-form-item>
        <!-- <el-form-item label="审核状态" prop="status">
          <el-select v-model="filterForm.status" style="width: 100%;" placeholder="审核状态">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="待审核" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="handleReset">重 置</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">查 询</el-button>
      </template>
    </public-dialog>
  </div>
</template>

<script>
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import AddView from './components/AddView'
import ApproveView from './components/ApproveView'
import PublicDialog from '@/components/Dialog/PublicDialog'
import { Basic } from '@/api/base'

export default {
  components: { PublicTable, Pagination, AddView, ApproveView, PublicDialog },

  data() {
    return {
      tableHead: [
        { label: '供应商编号', value: 'supplierNo', minWidth: 100, fixed: 'left' },
        { label: '供应商全称', value: 'supplierName', minWidth: 170 },
        { label: '商圈', value: 'clusterName', minWidth: 170  },
        { label: '入驻审核状态', type: 'slot', slotName: 'auditStatus', width: 170, fixed: 'right' },
        { label: '联系人', value: 'contactName', minWidth: 120 },
        { label: '联系电话', value: 'contactPhone', minWidth: 120 },
        { label: '创建人', value: 'createUser', minWidth: 120 },
        { label: '创建时间', value: 'createTime', minWidth: 170 },
        { label: '操作', type: 'slot', slotName: 'handle', width: 120, fixed: 'right' }
      ],
      tableData: [],
      formData: {
        keyWord: '',
        status: null
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
      filterView: false,
      filterForm: {
        keyWord: '',
        creatorName: '',
        dateRange: [],
        startTime: '',
        endTime: '',
        status: null
      },
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
        keyWord: vm.formData.keyWord || null,
        status: vm.formData.status
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
      Basic.list('supplier', params).then(res => {
        const { data } = res
        const { total = 0, records = [] } = data
        vm.sumTotal = total
        const arr = records.map(t => {
          t.statusName = t.status === 1 ? '审核通过' : '待审核'
          return t
        })
        vm.tableData = arr
      })
    },
    // 重置
    reset() {
      const vm = this
      vm.formData.keyWord = ''
      vm.formData.status = null
      vm.$nextTick(_ => {
        vm.handleQuery()
      })
    },
    // // 新增
    // handleCreate() {
    //   this.showAdd = true
    //   this.showType = 1
    // },
    // // 编辑
    // handleEdit(data) {
    //   const { id } = data
    //   this.showAdd = true
    //   this.supplierId1 = id
    //   this.showType = 2
    // },
    handleCreate() {
      this.$router.push({
        name: 'AddSupplierList'
      })
    },
    handleEdit(data) {
      this.$router.push({
        name: 'AddSupplierList',
        query: {
          id: data.supplierId
        }
      })
    },
    closeAddView(val) {
      this.showAdd = false
      this.supplierId1 = ''
      if (val) {
        this.getTableData()
      }
    },
    closeApproveView(val) {
      this.showApprove = false
      this.supplierId2 = ''
      if (val) {
        this.getTableData()
      }
    },
    // 审核
    handleCheck(data) {
      const { id } = data
      this.showApprove = true
      this.supplierId2 = id
      this.showType = 3
    },
    // 查看详情
    // handleInfo(data) {
    //   const { id } = data
    //   this.showApprove = true
    //   this.supplierId2 = id
    //   this.showType = 4
    // },
    handleInfo(data) {
      this.$router.push({
        name: 'DetailsSupplierList',
        query: {
          id: data.id
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
    // 高级筛选
    handleFilter() {
      this.filterView = true
    },
    handleCancel() {
      this.filterView = false
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
      vm.searchData = params
      await vm.getTableData()
      vm.filterView = false
    },
    afterClosed() {
      this.handleReset()
      this.filterView = false
    },
    handleReset() {
      this.$refs['filterForm'].resetFields()
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
.app-container /deep/ .filter-view {
  width: 480px;
}
</style>
