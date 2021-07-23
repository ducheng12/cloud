<!--会员信息-->
<template>
  <div class="app-container">
    <el-form :inline="true" :model="formData" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.nickname"
          clearable
          placeholder="会员名称"
          class="hy"
          style="width: 193px"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formData.tagIds"
          placeholder="标签"
          clearable
          multiple
          @change="queryChange($event)"
        >
          <el-option v-for="item in theLabelsj" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formData.groupIds"
          placeholder="会员分组"
          clearable
          multiple
          @change="groupLabels($event)"
        >
          <el-option v-for="item in groupLabel" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="buttons">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
        <el-button plain icon="el-icon-refresh-right" @click="reset">重 置</el-button>
        <el-button plain icon="el-icon-search" @click="handleFilter">高级筛选</el-button>
      </el-form-item>
      <br />
      <el-form-item>
        <!-- <el-button plain icon="el-icon-plus" @click="handleCreate">新 增</el-button> -->
        <el-button plain @click="createGroup">创建分组</el-button>
        <el-button plain @click="addTags">添加标签</el-button>
      </el-form-item>
      <el-form-item class="buttons">
        <el-button size="small" icon="el-icon-download" @click="handleExport">
          {{ selectList.length ? '导出选择数据' : '导出全部' }}
        </el-button>
        <!-- <el-button size="small" icon="el-icon-upload2">导入会员</el-button> -->
      </el-form-item>
    </el-form>
    <!-- 会员列表 -->
    <public-table
      :show-index="false"
      :show-select="true"
      :table-head="tableHead"
      :table-data="tableData"
      @handle-selection="selection"
    >
      <template slot="groupName" slot-scope="slotProps">
        <span v-for="(i, index) in slotProps.data.groupNameList" :key="index">
          <span>{{ i.name + ',' }}</span>
        </span>
      </template>
      <template slot="tagName" slot-scope="slotProps">
        <span v-for="(item, index) in slotProps.data.tagNameList" :key="index">
          <span>{{ item.name + ',' }}</span>
        </span>
      </template>
      <template slot="source" slot-scope="slotProps">
        <span>{{ slotProps.data.source | orderSourceFilter }}</span>
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="handleInfo(slotProps.data)">详情</el-button>
        <!-- <el-button type="text" @click="handleEdit(slotProps.data)">修改</el-button> -->
      </template>
    </public-table>
    <public-dialog
      v-if="dialogIndex === 3"
      :title="'高级筛选'"
      :visible="filterView"
      :custom-class="'filter-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form ref="filterForm" :model="filterForm" size="small" label-width="102px" class="gjsx">
        <el-row>
          <el-col :span="12">
            <el-form-item label="收件人手机:" prop="consPhone">
              <el-input v-model="filterForm.consPhone" placeholder="收件人手机"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员名称:" prop="nickname">
              <el-input v-model="filterForm.nickname" placeholder="会员名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员等级:" prop="level">
              <el-select v-model="filterForm.level" style="width: 100%" placeholder="会员等级">
                <el-option
                  v-for="item in grade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员分组:" prop="groupIds">
              <el-select v-model="filterForm.groupIds" placeholder="会员分组" clearable multiple>
                <el-option
                  v-for="item in groupLabel"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="来源渠道:" prop="source">
              <el-select v-model="filterForm.source" style="width: 100%" placeholder="来源渠道">
                <el-option
                  v-for="item in membersSource"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人:" prop="consName">
              <el-input v-model="filterForm.consName" placeholder="收货人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签:" prop="tagIds">
              <el-select
                v-model="filterForm.tagIds"
                placeholder="标签"
                clearable
                multiple
                @change="queryChange($event)"
              >
                <el-option
                  v-for="item in theLabelsj"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="handleReset">重 置</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">查 询</el-button>
      </template>
    </public-dialog>
    <!--  新增、修改、删除弹窗 -->
    <class-dialog
      :dialog-obj="dialogObj"
      @cancel="cancelClick"
      @confirm="confirm"
      @closeIcon="closeIcon"
    >
      <div slot="center" class="cent">
        <el-form v-if="dialogIndex === 1" label-width="80px">
          <el-form-item label="会员分组:">
            <el-select
              v-model="formLsit.id"
              placeholder="请选择会员分组"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in groupLabel"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form v-if="dialogIndex === 2" label-width="50px">
          <el-form-item class="my_form-item" label="标签:">
            <el-select
              v-model="formDatas.tagIds"
              placeholder="请选择标签"
              style="width: 100%"
              clearable
              multiple
              @change="queryChangeas($event)"
            >
              <el-option
                v-for="item in theLabelsj"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </class-dialog>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
  </div>
</template>

<script>
import fileDownload from 'js-file-download'
import {
  membersList,
  listNoPage,
  groupNoPage,
  groupList,
  createGroup,
  createTag
} from '@/api/members'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import PublicDialog from '@/components/Dialog/PublicDialog'
import classDialog from '@/components/Dialog/Dialog'
import { getToken } from '@/utils/auth'
export default {
  components: {
    PublicDialog,
    PublicTable,
    Pagination,
    classDialog
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
      formLsit: {
        memList: [],
        id: null
      },
      createTag: {
        tagId: '',
        id: null
      },
      formDatas: {
        tagIds: null
      },
      tableHead: [
        { label: '会员名称', value: 'nickname' },
        { label: '手机号', value: 'telephone' },
        { label: '注册来源', value: 'source', type: 'slot', slotName: 'source' },
        { label: '归属门店', value: 'vestShop' },
        { label: '注册时间', value: 'createTime' },
        { label: '会员等级', value: 'level' },
        { label: '会员标签', value: 'tagIds', type: 'slot', slotName: 'tagName' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 150 }
      ],
      formData: {
        nickname: '',
        tagIds: '',
        groupIds: ''
      },
      filterForm: {
        nickname: '',
        level: '',
        source: '',
        tagIds: '',
        groupIds: '',
        consName: '',
        consPhone: ''
      },
      tableData: [],
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      filterView: false,
      searchData: {},
      // 标签list
      theLabelsj: [],
      // 分组list
      groupLabel: [],
      selectList: [],
      disabled: false,
      shu: '',
      zu: '',
      dialogIndex: '',
      dialogObj: {
        DialogType: false, // 新建分类弹窗开关
        title: '添加属性', // 标题
        width: '20%'
      },
      fileName: '会员信息数据.xlsx',
      // 标签
      theLabel: [
        { value: 'APP', label: 'APP' },
        { value: '小程序', label: '小程序' },
        { value: 'PC', label: 'PC' }
      ],
      // 来源渠道
      membersSource: [
        { value: '1', label: 'APP' },
        { value: '2', label: '小程序' },
        { value: '3', label: 'PC' }
      ],
      // 会员等级
      grade: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ]
    }
  },
  mounted() {
    this.getTableData()
    this.getTheLabel()
    this.getGroupLabel()
    // this.groupLists()
  },

  methods: {
    queryChange(v) {
      this.shu = v.map(item => item).join(',')
    },
    queryChangeas(v) {
      this.createTag.tagId = v.toString()
    },
    groupLabels(v) {
      this.zu = v.map(item => item).join(',')
    },
    // 查询
    handleQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      const params = {
        nickname: vm.formData.nickname || null,
        groupIds: vm.zu,
        tagIds: vm.shu
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
      membersList(params).then(res => {
        if (res.code === 200) {
          vm.tableData = res.data.records
          vm.sumTotal = res.data.total
        }
      })
    },
    // 获取标签查询数据
    getTheLabel() {
      const vm = this
      listNoPage().then(res => {
        if (res.code === 200) {
          vm.theLabelsj = res.data
        }
      })
    },
    // 获取分组查询数据
    getGroupLabel() {
      const vm = this
      groupNoPage().then(res => {
        if (res.code === 200) {
          vm.groupLabel = res.data
        }
      })
    },
    // 会员分组列表接口
    groupLists() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      groupList(params).then(res => {
        if (res.code === 200) {
          console.log(res)
        }
      })
    },
    // 跳转详情页面
    handleInfo(e) {
      const orderId = e.id
      this.$router.push({
        path: 'detail',
        query: {
          orderId: orderId
        }
      })
    },
    // 重置
    reset() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      const params = {
        nickname: null,
        groupIds: null,
        tagIds: null
      }
      vm.searchData = params
      vm.formData.nickname = ''
      vm.formData.tagIds = null
      vm.formData.groupIds = null
      vm.getTableData()
    },
    // 新增
    handleCreate() {
      this.showAdd = true
    },
    // 创建分组弹窗事件
    createGroup() {
      this.dialogIndex = 1
      if (this.selectList.length >= 1) {
        this.dialogObj.DialogType = true
        this.dialogObj.width = '20%'
        this.dialogObj.title = '请填写分组信息'
      } else {
        this.$message.error('请选择会员')
        return false
      }
    },
    // 添加标签弹窗事件
    addTags() {
      this.dialogIndex = 2
      if (this.selectList.length >= 1) {
        this.dialogObj.DialogType = true
        this.dialogObj.width = '20%'
        this.dialogObj.title = '请选择标签'
      } else {
        this.$message.error('请选择会员')
        return false
      }
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
    },
    // 高级筛选
    handleFilter() {
      this.dialogIndex = 3
      this.filterView = true
    },
    // 高级搜索查询
    async handleSearch() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      const params = JSON.parse(JSON.stringify(vm.filterForm))
      vm.searchData = params
      await vm.getTableData()
      vm.filterView = false
    },
    // 确认弹窗事件
    confirm() {
      // 创建分组弹窗调用
      if (this.dialogIndex === 1) {
        this.memCreateGroup()
      } else if (this.dialogIndex === 2) {
        this.memCreateTag()
      }
    },
    // 会员分组弹窗接口
    memCreateGroup() {
      this.dialogIndex === 1
      if (!this.formLsit.id) {
        this.$message.error('请选择分组名称')
        return false
      }
      createGroup(this.formLsit).then(res => {
        if (res.code === 200) {
          this.dialogObj.DialogType = false
          this.getTableData()
        }
        this.formLsit.id = ''
      })
    },
    // 添加标签弹窗接口
    memCreateTag() {
      this.dialogIndex === 2
      if (!this.createTag.tagId) {
        this.$message.error('请选择标签名称')
        return false
      }
      createTag(this.createTag).then(res => {
        if (res.code === 200) {
          this.dialogObj.DialogType = false
          this.getTableData()
        }
        this.formDatas.tagIds = ''
      })
    },
    // 取消弹窗
    handleCancel() {
      this.filterView = false
    },
    cancelClick() {
      this.formLsit.id = ''
      this.formDatas.tagIds = null
      this.dialogObj.DialogType = false
    },
    // 弹窗icon关闭
    closeIcon() {
      this.formLsit.id = ''
      this.formDatas.tagIds = null
      this.dialogObj.DialogType = false
    },
    // 多选框
    selection(e) {
      this.selectList = e
      this.selectList = e.map(item => item.id)
      if (e.length >= 1) {
        this.disabled = true
        this.formLsit.memList = e.map(item => ({ memId: item.id }))
        this.createTag.id = e.map(item => item.id).toString()
      } else {
        this.disabled = false
      }
    },
    // 导出数据
    handleExport() {
      const vm = this
      const slect = JSON.parse(JSON.stringify(vm.selectList))
      const url = slect.length ? 'exportMember' : 'exportMemberAll'
      const params = slect.length
        ? { memIds: slect }
        : {}
      vm.$axios
        .get(`${process.env.VUE_APP_BASE_API}/member/${url}`, {
          responseType: 'blob',
          headers: {
            Authorization: getToken(),
            source: 4
          },
          params
        })
        .then(res => {
          fileDownload(res.data, this.fileName)
        })
        .catch(err => {
          const { response } = err
          if (response.status && response.status === 401) {
            vm.$message.error('暂无操作权限，请联系管理员！')
          }
        })
    },
    afterClosed() {
      this.handleReset()
      this.filterView = false
    },
    handleReset() {
      // 重置表单
      this.$refs['filterForm'].resetFields()
    }
  }
}
</script>
<style lang='scss' scoped>
.hy {
  width: 289px;
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 24px !important;
}
::v-deep .cent .el-form-item--small.el-form-item {
  margin-bottom: 0px !important;
}
.buttons {
  float: right;
}
.my_form-item ::v-deep .el-form-item__content {
  margin-left: 50px !important;
}
::v-deep .el-select .el-select__tags > span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: inline-block;
  height: 25px;
}
.gjsx ::v-deep .el-select {
  width: 100%;
}
</style>
