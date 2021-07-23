<!--商品列表  -->
<template>
  <div class="app-container">
    <div>
      <formItem
        :form-options="formOptions"
        :btn-items="btnItems"
        :down-url="downLoadUrl"
        @handle-down="btnDown"
        @handle-query="btnQuery"
        @handle-delete="ntnDelete"
        @handle-push="btnAdd"
        @handle-export="btnExport"
        @handle-impor="btnImpor"
        @select-change="selectChange"
        @initSelect-change="initSelectChange"
      />
    </div>
    <div class>
      <!--表格 -->
      <public-table :table-head="tableHeadConfig" :table-data="tableLoadData">
        <template slot="status" slot-scope="slotProps">
          <el-switch
            v-model="slotProps.data.isShelves"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(slotProps.data)"
          ></el-switch>
        </template>
        <template slot="handle" slot-scope="slotProps">
          <el-button type="text" :disabled="slotProps.data.isShelves === 1" @click="setGoods(slotProps.data.id)">编辑</el-button>
          <el-button type="text" :disabled="slotProps.data.isShelves === 1" @click="goodsDelete(slotProps.data, slotProps.data.$index)">删除</el-button>
        </template>
      </public-table>
      <!-- 分页 -->
      <Pagination ref="myPagination" :sum-total="sumTotal" @handle-size="handlePageSize" @handle-current="handlePageCurrent" />
      <!-- <pagination :obj-deploy="objDeploy" @sizeChange="sizeChange" @currentChange="currentChange"></pagination> -->
    </div>
  </div>
</template>

<script>
import formItem from '@/components/searchForm/formitem'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import {
  getGoodsList,
  GoodsDelet,
  getGoodsInitClass,
  getGoodsClassIspaging,
  getSupplierList,
  updateStatus
} from '@/api/goods'
import { getToken } from '@/utils/auth'
export default {
  name: 'GoodsList',
  components: {
    formItem,
    PublicTable,
    Pagination
  },
  props: {},
  data() {
    return {
      queryOption: {}, // 查询带回的参数
      height: 700, // 表格高度
      btnItems: { // 查询按钮
        btnQuery: { type: true, name: '查询' }, // 查询
        btnAdd: { type: true, name: '新增商品' }, // 新增
        btnRese: { type: false, name: '重置' }, // 重置
        btnExport: { type: false, name: '导出数据' }, // 导出
        btnImpo: { type: true, name: '批量导入' }, // 导入
        btnDown: { type: true, name: '下载模板' } // 下载模板
      },
      formOptions: [
        // 查询数据
        { label: '', prop: 'goodsName', type: 'input', placeholder: '请输入商品名称' },
        { label: '', prop: 'firstCategoryId', type: 'initSelect', placeholder: '一级分类', num: '1', options: [] },
        { label: '', prop: 'secondCategoryId', type: 'select', placeholder: '二级分类', num: '2', options: [] },
        { label: '', prop: 'supplierId', type: 'select', placeholder: '供应商', num: '3', options: [] }
      ],
      // 分页参数
      sumTotal: 0, // 分页总条数
      pageSize: 10, // 每页十条
      pageNum: 1, // 当前页数
      objDeploy: {
        selection: false, // 多选状态
        index: true, // 序号
        pageSize: 10,
        pageNum: 1,
        pagecount: null
      },
      // 配置
      tableHeadConfig: [
        { label: '商品编码', value: 'goodsNo' },
        { label: '商品名称', value: 'name' },
        { label: '供应商', value: 'supplierName' },
        { label: '一级分类', value: 'firstCateName' },
        { label: '二级分类', value: 'secondCateName' },
        { label: '上架状态', type: 'slot', slotName: 'status' },
        { label: '添加时间', value: 'createTime' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 150 }
      ],
      // 数据
      tableLoadData: [],
      downLoadUrl: process.env.VUE_APP_FILE_URL_OBS + '/导入模板文件.xlsx'
    }
  },
  activated() {
    this.onSearch()
  },
  created() {
    this.onSearch()
    this.getGoodsClass()
    this.getSuppliel()
  },
  mounted() {},
  methods: {
    // 获取供应商
    async getSuppliel() {
      const vm = this
      const { data } = await getSupplierList()
      const list = data.map(t => {
        return { label: t.fullName, value: t.id }
      })
      vm.formOptions[3].options = list
    },
    // 获取一级分类
    async getGoodsClass() {
      const res = await getGoodsInitClass()
      if (res.code === 200) {
        const options = res.data.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.formOptions.forEach(i => {
          if (i.num === '1') {
            i.options = options
          }
        })
      }
    },
    // 一级分类下拉事件
    initSelectChange(val) {
      getGoodsClassIspaging({ parentId: val }).then(res => {
        const options = res.data.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.formOptions.forEach(i => {
          if (i.num === '2') {
            i.options = options
          }
        })
      })
    },
    // 下拉框事件
    selectChange(val) {
    },
    // 删除
    goodsDelete(val, index) {
      if (val.isShelves === 0) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          GoodsDelet({ id: val.id }).then(res => {
            if (res.code === 200) {
              this.tableLoadData.splice(index, 1)
              this.onSearch()
              this.$message({ message: '删除商品成功', type: 'success' })
            }
          })
        })
      } else {
        this.$message({ message: '您是上架状态，不可删除，请先下架！', type: 'warning' })
      }
    },
    // 查询
    btnQuery(val) {
      this.pageNum = 1
      this.$refs.myPagination.currentPage = 1
      this.queryOption = val
      this.onSearch()
    },
    // 获取商品列表/查询
    async onSearch() {
      let obj
      if (this.queryOption) {
        const { firstCategoryId, goodsName, secondCategoryId, supplierId } = this.queryOption
        obj = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          firstCategoryId: firstCategoryId,
          goodsName: goodsName,
          secondCategoryId: secondCategoryId,
          supplierId: supplierId
        }
      } else {
        obj = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }
      const res = await getGoodsList(obj)
      if (res.code === 200) {
        const { records, total, size } = res.data
        this.tableLoadData = records
        this.sumTotal = total
        this.pageSize = size
        if (obj) {
          obj.firstCategoryId = null
          obj.goodsName = null
          obj.secondCategoryId = null
          obj.supplierId = null
        }
      }
    },
    // 上下架
    async handleStatusChange(item) {
      const vm = this
      const params = {
        id: item.id,
        status: item.isShelves
      }
      try {
        await updateStatus(params)
        const handle = item.isShelves === 1 ? '上架' : '下架'
        vm.$message({
          message: `${handle}成功！`,
          type: 'success'
        })
      } catch (err) {
        item.isShelves = item.isShelves === 1 ? 0 : 1
      }
    },
    // 子组件传回的表格全选事件
    handleSelectionChange(val) {
    },
    // 子组件传回的分页事件
    handlePageSize(val) {
      this.pageSize = val
      this.onSearch()
    },
    handlePageCurrent(val) {
      this.pageNum = val
      this.onSearch()
    },
    // 编辑
    setGoods(id) {
      this.$router.push(`list/goodsedit/${id}`)
    },
    ntnDelete() {
      // 重置
      this.initSelectChange()
      this.onSearch()
    },
    btnAdd() { // 新增
      this.$router.push('list/goodsAdd')
    },
    btnDown() { // 下载
    },
    btnExport() { // 导出
    },
    btnImpor(val) {
      const vm = this
      const params = new FormData()
      params.append('file', val.file)
      const url = `${process.env.VUE_APP_BASE_API}/goods/importFile`
      vm.$axios
        .post(url, params, {
          headers: {
            Authorization: getToken(),
            source: 4
          }
        }).then(res => {
          const { data } = res
          const { code, msg } = data
          if (code !== 200) {
            vm.$message.error(msg)
          } else {
            vm.pageNum = 1
            vm.$refs.myPagination.currentPage = 1
            vm.onSearch()
            vm.$message({
              message: '数据导入成功',
              type: 'success'
            })
          }
        })
    }
  }
}
</script>
<style lang="scss" scope>
.success-tooltip {
  background: #67c23a !important;
  color: #ffffff !important;

  .popper__arrow {
    border-right-color: #67c23a !important;

    &::after {
      border-right-color: #67c23a !important;
    }
  }
}

.failed-tooltip {
  background: #909399 !important;
  color: #ffffff !important;

  .popper__arrow {
    border-right-color: #909399 !important;

    &::after {
      border-right-color: #909399 !important;
    }
  }
}
// .shopBox{
//   height: auto;
//   width: 97%;
//   background-color: #fff;
//   margin: 20px auto;
//   margin-top: 15px;
//   border-radius: 6px;
//   padding: 15px;
//   box-shadow: 0 0 4px 0 rgba(200, 200, 200, 0.5);
//   padding-bottom: 40px;
// }
</style>
