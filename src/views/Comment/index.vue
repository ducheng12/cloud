<!--  -->
<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <searchForm :option-list="optionList" @handle-query="handleQuery" @handle-clear="handleClear">
    </searchForm>
    <!-- 表格 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="正常评论" name="first">
        <public-table
          :table-head="tableHeadAll"
          :table-data="tableDataAll"
          :show-select="showSelect"
        >
          <template slot="goodsLevel" slot-scope="slotProps">
            <el-rate v-model="slotProps.data.goodsLevel" disabled></el-rate>
          </template>
          <template slot="displayStatus" slot-scope="slotProps">
            <el-switch
              v-model="slotProps.data.displayStatus"
              active-value="Y"
              inactive-value="N"
              @change="changeStatus(slotProps.data)"
            >
            </el-switch>
          </template>
          <template slot="handle" slot-scope="slotProps">
            <el-button type="text" @click="reply(slotProps.data)"> 回复 </el-button>
            <el-button type="text" @click="delate(slotProps.data)"> 删除 </el-button>
          </template>
        </public-table>
      </el-tab-pane>
      <el-tab-pane label="已删除评论" name="second">
        <public-table
          :table-head="tableHeadDelete"
          :table-data="tableDataDelete"
          :show-select="showSelect"
        >
          <template slot="goodsLevel" slot-scope="slotProps">
            <el-rate v-model="slotProps.data.goodsLevel" disabled></el-rate>
          </template>
          <template slot="supplierLevel" slot-scope="slotProps">
            <el-rate v-model="slotProps.data.supplierLevel" disabled></el-rate>
          </template>
          <template slot="handle" slot-scope="slotProps">
            <el-button type="text" @click="restore(slotProps.data)"> 还原 </el-button>
          </template>
        </public-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <Pagination
      ref="myPagination"
      :sum-total="total"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
    <!-- 回复弹窗 -->
    <public-dialog
      :title="'回复评论'"
      :visible="filterView"
      :custom-class="'filter-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form ref="formData" :model="formData" label-width="100px">
        <el-form-item label="评论内容：">
          <div class="txt">{{ commentContent }}</div>
        </el-form-item>
        <el-form-item
          style="100%"
          label="回复内容："
          prop="replyContent"
          :rules="[{ required: true, message: '回复内容不能为空' }]"
        >
          <el-input
            v-model.trim="formData.replyContent"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入内容"
            maxlength="600"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button type="primary" size="small" @click="handleSearch()">回 复</el-button>
        <el-button size="small" @click="handleReset">取 消</el-button>
      </template>
    </public-dialog>
  </div>
</template>

<script>
import { selectListPage, updateStatus, deleteByOrderId, updateReplyContent } from '@/api/comment'
import searchForm from '@/components/Search/searchForm'
import PublicTable from '@/components/Tables/PublicTable'
import PublicDialog from '@/components/Dialog/PublicDialog'
import Pagination from '@/components/Pagination'
export default {
  components: {
    searchForm,
    PublicTable,
    PublicDialog,
    Pagination
  },

  data() {
    return {
      activeName: 'first', // tab默认选择
      showSelect: false, // 表格多选初始状态
      filterView: false, // 弹窗初始状态
      commentContent: '', // 默认弹窗评论内容
      id: '', // 当前评论id
      // 分页
      pageNum: 1,
      pageSize: 10,
      total: 0,
      deleteStatus: null, // 全部列表&删除列表初始值
      searchData: {}, // 搜索
      // 搜索组件数据
      optionList: [],
      optionListAll: [
        {
          label: '',
          type: 'input',
          placeholder: '订单编号',
          key: 'orderId',
          width: '120'
        },
        {
          label: '',
          type: 'input',
          placeholder: '商品名称',
          key: 'goodsName',
          width: '120'
        },
        {
          label: '',
          type: 'date2',
          placeholder: '评论',
          key: 'dateAarry',
          width: '120'
        },
        {
          label: '',
          type: 'select',
          placeholder: '商品评分',
          key: 'goodsLevel',
          width: '120',
          list: [
            { value: null, label: '全部' },
            { value: 1, label: '一星' },
            { value: 2, label: '二星' },
            { value: 3, label: '三星' },
            { value: 4, label: '四星' },
            { value: 5, label: '五星' }
          ]
        },
        {
          label: '',
          type: 'select',
          placeholder: '显示状态',
          key: 'displayStatus',
          width: '120',
          list: [
            { value: null, label: '全部' },
            { value: 'Y', label: '显示' },
            { value: 'N', label: '隐藏' }
          ]
        },
        {
          label: '',
          type: 'input',
          placeholder: '用户账号/昵称',
          key: 'account',
          width: '120'
        }
      ],
      optionListDelete: [
        {
          label: '',
          type: 'input',
          placeholder: '订单编号',
          key: 'orderId',
          width: '120'
        },
        {
          label: '',
          type: 'input',
          placeholder: '商品名称',
          key: 'goodsName',
          width: '120'
        },
        {
          label: '',
          type: 'date2',
          placeholder: '删除',
          key: 'dateAarry',
          width: '120'
        },
        {
          label: '',
          type: 'select',
          placeholder: '商品评分',
          key: 'goodsLevel',
          width: '120',
          list: [
            { value: null, label: '全部' },
            { value: 1, label: '一星' },
            { value: 2, label: '二星' },
            { value: 3, label: '三星' },
            { value: 4, label: '四星' },
            { value: 5, label: '五星' }
          ]
        },
        // {
        //   label: '',
        //   type: 'select',
        //   placeholder: '显示状态',
        //   key: 'displayStatus',
        //   width: '120',
        //   list: [
        //     { value: null, label: '全部' },
        //     { value: 'Y', label: '显示' },
        //     { value: 'N', label: '隐藏' }
        //   ]
        // },
        {
          label: '',
          type: 'input',
          placeholder: '用户账号/昵称',
          key: 'account',
          width: '120'
        }
      ],
      // 全部数据表头
      tableHeadAll: [
        { label: '订单编号', value: 'orderId' },
        { label: '商品名称', value: 'goodsInfo' },
        { label: '商品评分', type: 'slot', slotName: 'goodsLevel', width: 180 },
        { label: '评论内容', value: 'commentContent', width: 220 },
        { label: '回复内容', value: 'replyContent', width: 220 },
        { label: '评论时间', value: 'commentTime' },
        { label: '回复时间', value: 'replyTime' },
        { label: '用户账号/昵称', value: 'account' },
        {
          label: '显示/隐藏',
          type: 'slot',
          slotName: 'displayStatus',
          width: 100,
          align: 'center'
        },
        { label: '操作', type: 'slot', slotName: 'handle', width: 120 }
      ],
      // 全部数据
      tableDataAll: [],
      // 删除数据表头
      tableHeadDelete: [
        { label: '订单编号', value: 'orderId' },
        { label: '商品名称', value: 'goodsInfo' },
        { label: '商品评分', type: 'slot', slotName: 'goodsLevel', width: 180 },
        { label: '评论内容', value: 'commentContent', width: 220 },
        { label: '回复内容', value: 'replyContent', width: 220 },
        // { label: '供应商评分', type: 'slot', slotName: 'supplierLevel' },
        { label: '评论时间', value: 'commentTime' },
        { label: '删除时间', value: 'deleteTime' },
        { label: '用户账号/昵称', value: 'account' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 80 }
      ],
      // 删除数据
      tableDataDelete: [],
      // 回复表单
      formData: {
        replyContent: ''
      }
    }
  },

  computed: {},

  mounted() {
    this.getData()
    this.open()
  },

  methods: {
    open() {
      this.optionList = this.optionListAll
    },
    // 全部数据列表
    getData() {
      const that = this
      const params = JSON.parse(JSON.stringify(that.searchData))
      const { dateAarry = [] } = params
      if (dateAarry && dateAarry.length) {
        params.commentStartTime = dateAarry ? dateAarry[0] : ''
        params.commentEndTime = dateAarry ? dateAarry[1] : ''
        delete params.dateAarry
      }
      params.pageNum = that.pageNum
      params.pageSize = that.pageSize
      params.deleteStatus = 1
      selectListPage(params).then(res => {
        that.total = res.data.total
        that.tableDataAll = res.data.records
      })
    },
    // 删除数据列表
    getDelete() {
      const that = this
      const params = JSON.parse(JSON.stringify(that.searchData))
      const { dateAarry = [] } = params
      if (dateAarry && dateAarry.length) {
        params.deleteStartTime = dateAarry ? dateAarry[0] : ''
        params.deleteEndTime = dateAarry ? dateAarry[1] : ''
        delete params.dateAarry
      }
      params.pageNum = that.pageNum
      params.pageSize = that.pageSize
      params.deleteStatus = 0
      selectListPage(params).then(res => {
        that.total = res.data.total
        that.tableDataDelete = res.data.records
      })
    },
    // 分页
    handlePageSize(val) {
      const that = this
      this.pageSize = val
      // 选择删除时
      if (that.activeName === 'second') {
        that.getDelete()
      }
      // 选择全部数据
      if (that.activeName === 'first') {
        that.getData()
      }
    },
    handlePageCurrent(val) {
      const that = this
      this.pageNum = val
      // 选择删除时
      if (that.activeName === 'second') {
        that.getDelete()
      }
      // 选择全部数据
      if (that.activeName === 'first') {
        that.getData()
      }
    },
    // tab
    handleClick(e) {
      const that = this
      that.activeName = e.name
      that.pageNum = 1
      that.$refs.myPagination.currentPage = 1
      // 选择全部数据
      if (that.activeName === 'first') {
        that.optionList = that.optionListAll
        that.getData()
      }
      // 选择删除时
      if (that.activeName === 'second') {
        that.optionList = that.optionListDelete
        that.getDelete()
      }
    },
    // 查询
    handleQuery(e) {
      const that = this
      that.searchData = Object.assign(e)
      that.pageNum = 1
      that.$refs.myPagination.currentPage = 1
      // 选择删除时
      if (that.activeName === 'second') {
        that.getDelete()
      }
      // 选择全部数据
      if (that.activeName === 'first') {
        that.getData()
      }
    },
    // 重置
    handleClear() {
      const that = this
      that.searchData = {}
      that.pageNum = 1
      that.$refs.myPagination.currentPage = 1
      // 选择删除时
      if (that.activeName === 'second') {
        that.getDelete()
      }
      // 选择全部数据
      if (that.activeName === 'first') {
        that.getData()
      }
    },
    // 改变状态
    changeStatus(e) {
      const orderId = e.orderId
      const displayStatus = e.displayStatus
      const params = {
        orderId: orderId,
        displayStatus: displayStatus
      }
      updateStatus(params).then(res => {
        this.getData()
      })
    },
    // 打开回复弹窗
    reply(e) {
      const that = this
      that.commentContent = e.commentContent
      that.id = e.orderId
      that.filterView = true
    },
    // 确认回复
    handleCancel() {
      this.filterView = false
    },
    handleSearch() {
      const that = this
      const params = JSON.parse(JSON.stringify(that.formData))
      params.orderId = that.id
      this.$refs['formData'].validate(valid => {
        if (valid) {
          updateReplyContent(params).then(res => {
            that.getData()
            that.filterView = false
          })
        }
      })
    },
    // icon & 关闭弹窗
    afterClosed() {
      this.filterView = false
      this.$refs['formData'].resetFields()
    },
    handleReset() {
      this.filterView = false
      this.$refs['formData'].resetFields()
    },
    // 删除
    delate(e) {
      const orderId = e.orderId
      this.$confirm('确定要删除该评论吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            orderId: orderId,
            deleteStatus: 0
          }
          deleteByOrderId(params).then(res => {
            if (res.code === 200) {
              this.getData()
              this.$message({ type: 'success', message: '删除成功!', duration: 2000 })
            } else {
              this.$message({ type: 'error', message: '删除失败!', duration: 2000 })
            }
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除!', duration: 2000 })
        })
    },
    // 还原
    restore(e) {
      const orderId = e.orderId
      const displayStatus = e.displayStatus
      this.$confirm('确定要还原该评论吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            orderId: orderId,
            deleteStatus: 1,
            displayStatus: displayStatus
          }
          updateStatus(params).then(res => {
            if (res.code === 200) {
              this.getDelete()
              this.$message({ type: 'success', message: '还原成功!', duration: 2000 })
            } else {
              this.$message({ type: 'error', message: '还原失败!', duration: 2000 })
            }
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消还原!', duration: 2000 })
        })
    }
  }
}
</script>
<style lang='scss' scoped>
.app-container /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.app-container /deep/ .el-dialog {
  width: 480px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.txt {
  margin-top: 10px;
  max-height: 100px;
  overflow-x: hidden;
  overflow-y: scroll;
  line-height: 20px;
}
.txt::-webkit-scrollbar {
  display: none;
}
</style>
