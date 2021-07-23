<!-- 供应商列表 -->
<template>
  <div class="app-container">
    <SearchTable
      ref="searchModel"
      :option-list="optionList"
      :search-list="searchList"
      :table-head="tableHead"
      :table-data="tableData"
      :show-select="showSelect"
      :show-index="showIndex"
      :sum-total="sumTotal"
      style="margin-top: 10px"
      @handle-size="handleSizeChange"
      @handle-current="handleCurrentChange"
      @handle-selection="handleSelection"
      @handle-query="handleQuey"
    >
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="handleEdit(slotProps.data)">编辑</el-button>
        <el-button type="text" @click="handleInfo(slotProps.data)">详情</el-button>
      </template>
    </SearchTable>
  </div>
</template>

<script>
import SearchTable from '@/components/Tables/searchTable'
import { Basic } from '@/api/base'

export default {
  components: { SearchTable },

  data() {
    return {
      optionList: [
        { label: '供应商全称', value: '供应商全称' },
        { label: '商圈', value: '商圈' },
        { label: '联系人', value: '联系人' }
      ],
      searchList: [
        { type: 'input', key: 'fullName' }
      ],
      showSelect: true,
      showIndex: true,
      tableData: [],
      tableHead: [
        { label: '供应商编号', value: 'suppNo', minWidth: 100, fixed: 'left' },
        { label: '供应商全称', value: 'fullName', minWidth: 170 },
        { label: '商圈', value: 'areaName' },
        { label: '联系人', value: 'relation', minWidth: 120 },
        { label: '联系电话', value: 'relationPhone', minWidth: 120 },
        { label: '业务联系电话', value: 'salePhone', minWidth: 120 },
        { label: '创建人', value: 'creatorName', minWidth: 120 },
        { label: '创建时间', value: 'createTime', minWidth: 170 },
        { label: '操作', type: 'slot', slotName: 'handle', width: 120, fixed: 'right' }
      ],
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      searchData: {}
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
  },
  methods: {
    handleSelection() {},
    handleQuey(e) {
      const that = this
      that.searchData = Object.assign(e)
      that.currentPage = 1
      that.$refs.searchModel.currentPage = 1
      that.getTableData()
    },
    // 查询
    handleQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.searchModel.currentPage = 1
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
      console.log(params)
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
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      console.log(val)
      this.getTableData()
    },
    handleCurrentChange(val) {
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
</style>
