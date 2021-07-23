<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="searchForm.keyWord"
          clearable
          placeholder="用户名称/账号"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button plain icon="el-icon-plus" @click="handleCreate">新增用户</el-button>
      </el-form-item>
    </el-form>
    <public-table :table-head="tableHead" :table-data="tableData">
      <template slot="isEnableFlag" slot-scope="slotProps">
        <el-switch
          v-model="slotProps.data.enableFlag"
          @change="handleStatusChange(slotProps.data)"
        ></el-switch>
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button :disabled="slotProps.data.enableFlag" type="text" @click="handleEdit(slotProps.data)">编辑</el-button>
        <el-button :disabled="slotProps.data.enableFlag" type="text" @click="handleDelete(slotProps.data)">删除</el-button>
      </template>
    </public-table>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
    <public-dialog
      :title="title"
      :visible="userView"
      :custom-class="'dialog-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form ref="rulesForm" :model="formData" :rules="rules" size="small" label-width="80px">
        <el-form-item label="账号" prop="account">
          <el-input v-model.trim="formData.account" :maxlength="11" clearable placeholder="请输入手机号作为账号" :disabled="userId ? true : false"></el-input>
        </el-form-item>
        <div v-if="userId">
          <el-form-item label="重置密码">
            <el-input v-model.trim="formData.initial" minlength="8" maxlength="18" clearable placeholder="请输入密码" show-password @change="initPasswordChange"></el-input>
          </el-form-item>
          <div style="margin: 0 0 15px 80px">允许英文字母、数字</div>
          <el-form-item label="确认密码">
            <el-input v-model.trim="formData.password" minlength="8" maxlength="18" clearable placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <div style="margin: 0 0 15px 80px">允许英文字母、数字</div>
        </div>
        <div v-else>
          <el-form-item label="密码" prop="initial">
            <el-input v-model.trim="formData.initial" minlength="8" maxlength="18" clearable placeholder="请输入密码" show-password @blur="initPasswordChange"></el-input>
          </el-form-item>
          <div style="margin: 0 0 15px 80px">允许英文字母、数字</div>
          <el-form-item label="确认密码" prop="password">
            <el-input v-model.trim="formData.password" minlength="8" maxlength="18" clearable placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <div style="margin: 0 0 15px 80px">允许英文字母、数字</div>
        </div>
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model.trim="formData.name" clearable placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="归属集群" prop="clusterId">
          <el-select
            v-model="formData.clusterId"
            placeholder="请选择归属集群"
            style="width: 100%;"
          >
            <el-option
              v-for="item in clusterList"
              :key="item.clusterId"
              :label="item.clusterName"
              :value="item.clusterId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色配置" prop="roles">
          <el-select
            v-model="formData.roles"
            multiple
            placeholder="请选择角色配置"
            style="width: 100%;"
          >
            <el-option
              v-for="item in options"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </template>
    </public-dialog>
  </div>
</template>

<script>
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import PublicDialog from '@/components/Dialog/PublicDialog'
import { Basic } from '@/api/base'
import { upStatus } from '@/api/user'
import md5 from 'js-md5'

export default {
  components: { PublicTable, Pagination, PublicDialog },

  data() {
    return {
      regPhone: /^[1][3,4,5,7,8][0-9]{9}$/, // 手机正则
      regPassword: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$/, // 密码正则
      rolesList: [],
      initPassword: null, // v-model绑定的密码
      userId: '', // 用户当前id
      multipleLimit: null, // 多选时用户最多可以选择的项目数，为 0 则不限制
      keyWord: '',
      title: '新增用户',
      tableHead: [
        { label: '用户姓名', value: 'name' },
        { label: '归属集群', value: 'clusterName' },
        { label: '账号', value: 'account' },
        { label: '角色', value: 'roleList' },
        { label: '创建时间', value: 'createTime' },
        { label: '创建人', value: 'createUser' },
        { label: '是否启用', value: 'enableFlag', type: 'slot', slotName: 'isEnableFlag' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 150 }
      ],
      tableData: [],
      searchForm: {
        keyWord: ''
      },
      formData: {
        userId: '',
        account: '',
        initial: '',
        password: '',
        name: '',
        clusterId: '',
        roles: []
      },
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      userView: false,
      options: [],
      clusterList: [],
      rules: {
        account: [
          { required: true, message: '请输入手机号作为账号', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        initial: [
          { required: true, message: '请输入账号密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入账号密码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        clusterId: [
          { required: true, message: '请选择归属集群', trigger: 'change' }
        ]
      }
    }
  },

  computed: {},

  mounted() {
    this.getTableData()
  },

  methods: {
    // 密码验证
    initPasswordChange() {
      // if (this.formData.initial !== '' && !this.regPassword.test(this.formData.initial)) {
      //   this.$message({ message: '密码格式不对，请输入数字字母组合，6到18位', type: 'error' })
      //   return
      // }
    },
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
        account: vm.searchForm.keyWord || null,
        pageNum: vm.currentPage,
        pageSize: vm.pageSize
      }
      Basic.list('admin/user', params).then(res => {
        const { data } = res
        const arr = data.records
        arr.forEach(t => {
          t.roleList = vm.initRoles(t.adminRoleVoList)
        })
        vm.tableData = arr
        vm.sumTotal = data.total
      })
    },
    initRoles(role) {
      const data = JSON.parse(JSON.stringify(role)) || []
      let list
      if (data.length) {
        list = data.filter(t => t)
        list = data.map(item => {
          if (item) {
            const name = item.roleName || ''
            return name
          }
        }).join(',')
      } else {
        list = ''
      }
      return list
    },
    // 获取角色列表-不分页
    getRoleData() {
      const vm = this
      Basic.general('admin/role/all').then(res => {
        if (res.code === 200) {
          vm.options = res.data
        }
      })
    },
    // 新增
    handleCreate() {
      this.userView = true
      this.title = '新增用户'
      this.getRoleData()
      this.getClusterList()
    },
    // 编辑
    handleEdit(data) {
      this.getRoleData()
      this.getClusterList()
      const vm = this
      vm.userView = true
      vm.$nextTick(_ => {
        const { userId, account, password, name, clusterId, adminRoleVoList = [] } = data
        vm.userId = userId
        vm.title = '编辑用户'
        vm.formData.userId = userId // userid
        vm.formData.account = account // 账号
        vm.formData.name = name // 姓名
        vm.formData.clusterId = clusterId || ''
        vm.initPassword = password
        vm.formData.roles = adminRoleVoList.map(item => { // 角色id
          return item.roleId
        })
      })
    },
    // 获取归属地列表
    getClusterList() {
      const vm = this
      Basic.list('admin/cluster').then(res => {
        const { data = [] } = res
        vm.clusterList = data
      })
    },
    // 启用/禁用
    handleEnable(data) {},
    handleCancel() {
      this.userView = false
    },
    // 重置弹窗数据
    afterClosed() {
      const vm = this
      vm.formData.userId = null
      vm.formData.account = null
      vm.formData.password = null
      vm.formData.name = null
      vm.initPassword = null
      vm.formData.initial = null
      vm.formData.roles = []
      this.userId = null
      vm.$refs['rulesForm'].clearValidate()
    },
    // 编辑接口
    setUser(item) {
      const vm = this
      Basic.normal('admin/user/edit', item).then(res => {
        if (res.code === 200) {
          vm.$message({ showClose: true, message: '编辑用户成功！', type: 'success' })
          this.getTableData()
          vm.userView = false
        }
      })
    },
    // 弹窗确认
    handleConfirm() {
      const vm = this
      if (vm.formData.initial === '') {
        vm.$message({ message: '请输入密码', type: 'error' })
        return
      }
      if (vm.formData.initial !== '' && !vm.regPassword.test(vm.formData.initial)) {
        vm.$message({ message: '密码格式不对，必须含有大小写字母和数字的8到18位组合', type: 'error' })
        return
      }
      if (vm.formData.initial !== vm.formData.password) {
        this.$message({ message: '两次输入密码不一致', type: 'error' })
        return
      }
      const params = JSON.parse(JSON.stringify(vm.formData))
      vm.$refs['rulesForm'].validate((valid) => {
        if (valid) {
          if (params.password) { // 如果有输入密码就转md5
            params.password = md5(params.password)
          }
          vm.$delete(params, 'initial') // 删除initial属性
          if (this.userId) {
            // 编辑
            this.setUser(params)
          } else {
            // 新增
            Basic.normal('admin/user/add', params).then(res => {
              if (res.code === 200) {
                vm.$message({ showClose: true, message: '新增用户成功！', type: 'success' })
                vm.userView = false
                this.getTableData()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    handleDelete(data) {
      const { userId } = data
      this.$confirm('确定要删除用户吗?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        Basic.normal('admin/user/delete', { userId }).then(res => {
          if (res.code === 200) {
            this.getTableData()
            this.$message({ message: '删除成功', type: 'success' })
            // this.tableData.splice(index, 1)
          }
        })
      })
    },
    // 停用或启用
    handleStatusChange(val) {
      if (!val.enableFlag) {
        this.$confirm('确定要停用该用户吗？', '停用用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          upStatus(val.userId).then(res => {
            if (res.code === 200) {
              this.$message({ message: '停用成功', type: 'success' })
            }
          }).catch(() => {
            val.enableFlag = !val.enableFlag
          })
        }).catch(() => {
          val.enableFlag = !val.enableFlag
        })
      } else {
        // 启用
        upStatus(val.userId).then(res => {
          if (res.code === 200) {
            this.$message({ message: '启用成功', type: 'success' })
          }
        }).catch(() => {
          val.enableFlag = !val.enableFlag
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
.app-container /deep/ .dialog-view {
  width: 416px;
}
</style>

