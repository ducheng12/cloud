<!-- 角色管理 -->
<template>
  <div class="app-container">
    <el-form :inline="true" :model="formData" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.keyWord"
          clearable
          placeholder="角色名称"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button plain icon="el-icon-plus" @click="handleCreate">新增角色</el-button>
      </el-form-item>
    </el-form>
    <public-table :table-head="tableHead" :table-data="tableData">
      <template slot="status" slot-scope="slotProps">
        <el-switch
          v-model="slotProps.data.enabled"
          
          @change="handleStatusChange(slotProps.data)"
        ></el-switch>
      </template>
      <template slot="handle" slot-scope="slotProps">
        <div>
          <el-button type="text" :disabled="slotProps.data.enabled" @click="handleEdit(slotProps.data)">编辑</el-button>
          <el-button type="text" :disabled="slotProps.data.enabled" @click="handleDelete(slotProps.data,slotProps.data.$index)">删除</el-button>
        </div>
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
import { enabledStatus } from '@/api/role'
export default {
  components: { PublicTable, Pagination },

  data() {
    return {
      tableHead: [
        { label: '角色名称', value: 'roleName' },
        { label: '角色说明', value: 'roleDesc' },
        { label: '创建时间', value: 'createTime' },
        { label: '创建人', value: 'createUser' },
        { label: '是否启用', value: 'enabled', type: 'slot', slotName: 'status' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 150 }
      ],
      tableData: [],
      formData: {
        keyWord: '',
        status: null
      },
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10
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
      vm.getTableData()
    },
    // 获取列表数据
    getTableData() {
      const vm = this
      const params = {
        roleName: vm.formData.keyWord || null,
        // status: vm.formData.status,
        pageNum: vm.currentPage,
        pageSize: vm.pageSize
      }
      Basic.list('admin/role', params).then(res => {
        if (res.code === 200) {
          vm.sumTotal = res.data.total
          vm.tableData = res.data.records
        }
      })
    },
    // 新增
    handleCreate() {
      this.$router.push({
        name: 'roleAdd'
      })
    },
    // 编辑
    handleEdit(data) {
      this.$router.push(`role-list/role-edact/${data.roleId}`)
    },
    // 删除
    handleDelete(data, index) {
      this.$confirm('确定要删除该角色吗?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        const roleId = data.roleId
        Basic.normal('admin/role/delete', { roleId }).then(res => {
          if (res.code === 200) {
            // this.tableData.splice(index, 1)
            this.getTableData()
            this.$message({ message: '删除成功', type: 'success' })
          }
        })
      })
    },
    // 是否启用change事件
    handleStatusChange(val) {
      if (!val.enabled) {
        this.$confirm('停用该角色权限后，此前赋予此角色的用户对应权限均将无效，需要重新配置角色权限，是否确认停用？', '停用角色', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          enabledStatus(val.roleId).then(res => {
            if (res.code === 200) {
              this.$message({ message: '停用成功', type: 'success' })
            }
          }).catch(() => {
            val.enabled = !val.enabled
          })
        }).catch(() => {
          val.enabled = !val.enabled
        })
      } else {
        // 启用
        enabledStatus(val.roleId).then(res => {
          if (res.code === 200) {
            this.$message({ message: '启用成功', type: 'success' })
          }
        }).catch(() => {
          val.enabled = !val.enabled
        })
      }
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
</style>
