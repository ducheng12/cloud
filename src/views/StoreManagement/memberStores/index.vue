<!--会员信息-->
<template>
  <div class="app-container">
    <el-form ref="ValidateForm" :inline="true" :model="formData" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.keyWord"
          clearable
          placeholder="会员名称/手机号"
          class="hy"
          style="width: 193px"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="false">
        <el-select
          v-model="formData.source"
          placeholder="来源渠道"
        >
          <el-option v-for="item in theLabelsj" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-select
          v-model="formData.groupIds"
          placeholder="会员等级"
          clearable
          multiple
          @change="groupLabels($event)"
        >
          <el-option v-for="item in groupLabel" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item class="buttons">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
        <el-button plain icon="el-icon-refresh-right" @click="resetForm">重 置</el-button>
      </el-form-item>
      <br />
      <el-button size="small" style="margin-bottom:24px;" icon="el-icon-download" @click="handleExport">
        {{ selectList.length ? '导出数据' : '导出数据' }}
      </el-button>
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
      <!-- <template slot="tagName" slot-scope="slotProps">
        <span v-for="(item, index) in slotProps.data.tagNameList" :key="index">
          <span>{{ item.name + ',' }}</span>
        </span>
      </template> -->
      <template slot="source" slot-scope="slotProps">
        <span>{{ slotProps.data.source | orderSourceFilter }}</span>
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
import fileDownload from 'js-file-download'
import { membersList } from '@/api/members'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
export default {
  components: { PublicTable, Pagination },
  filters: {
    orderSourceFilter(source) {
      switch (source) {
        case 1:
          return '懂衣小程序'
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
      tableHead: [
        { label: '会员名称', value: 'nickname' },
        { label: '手机号', value: 'telephone' },
        // { label: '注册来源', value: 'source', type: 'slot', slotName: 'source' },
        { label: '归属门店', value: 'vestShop' },
        { label: '注册时间', value: 'createTime' },
        // { label: '会员等级', value: 'level' },
        // { label: '会员标签', value: 'tagIds', type: 'slot', slotName: 'tagName' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 150 }
      ],
      formData: { // 会员列表与查询参数
        keyWord: '',
        source: '',
        level: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      sumTotal: 0,
      theLabelsj: [ // 渠道来源数据
        { label: '懂衣小程序', value: 1 }
      ],
      groupLabel: [ // 会员等级数据
        { name: 'level 1', id: 1 }, { name: 'level 2', id: 2 }, { name: 'level 3', id: 3 }, { name: 'level 4', id: 4 }, { name: 'level 5', id: 5 },
        { name: 'level 6', id: 6 }, { name: 'level 7', id: 7 }, { name: 'level 8', id: 8 }, { name: 'level 9', id: 9 }, { name: 'level 10', id: 10 }
      ],
      selectList: [],
      disabled: false,
      fileName: '会员信息数据.xlsx'
    }
  },
  mounted() {
    this.getTableData()
  },

  methods: {
    // 查询
    handleQuery() {
      const vm = this
      vm.formData.pageNum = 1
      vm.$refs.myPagination.currentPage = 1
      vm.getTableData()
    },
    // 获取列表数据
    getTableData() {
      const vm = this
      membersList(vm.formData).then(res => {
        vm.tableData = res.data.records
        vm.sumTotal = res.data.total
      })
    },
    // 跳转详情页面
    handleInfo(e) {
      const orderId = e.id
      this.$router.push({
        path: 'member-stores/member-detail/orderId',
        query: {
          orderId: orderId
        }
      })
    },
    // 重置
    resetForm() {
      const vm = this
      vm.formData.pageNum = 1
      vm.formData.source = ''
      vm.formData.level = ''
      vm.formData.keyWord = ''
      vm.$refs.myPagination.currentPage = 1
      vm.getTableData()
    },
    // 新增
    handleCreate() {
      this.showAdd = true
    },
    // 分页
    handlePageSize(val) {
      this.formData.pageSize = val
      this.getTableData()
    },
    // 分页
    handlePageCurrent(val) {
      this.formData.pageNum = val
      this.getTableData()
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
      if (vm.tableData.length === 0) {
        vm.$message.warning('暂无数据！')
        return
      }
      if (slect.length === 0) {
        vm.$message.warning('请选择导出数据！')
        return
      }
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
// .buttons {
//   // float: right;
// }
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
