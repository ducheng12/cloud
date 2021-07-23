<!-- 角色详情 -->
<template>
  <div class="app-container">
    <el-page-header @back="goBack"></el-page-header>
    <div class="role-main">
      <el-form label-width="100px" size="small">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="角色名称：" :required="true">
              <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" @change="roleNameClick"></el-input>
            </el-form-item>
            <div style="margin:0 0 10px 100px;line-height: 26px;color: #7F7F7F;font-size:14px;">
              <div>说明：</div>
              <div>
                1、修改角色权限后,所有斌予此角色的员工账号对应权限均将修改<br />
                2、超级管理员角色不允许改名,也不允许修改其操作权限
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="角色说明：">
              <el-input v-model="roleForm.roleDesc" placeholder="请输入角色说明"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="权限配置" label-width="85px">
              <span class="label-tail"></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-tree
            ref="tree"
            :data="treeData"
            :render-content="renderContent"
            node-key="permissionId"
            show-checkbox
            :props="defaultProps"
            @check="handleCheck"
            @node-expand="handleExpand"
          >
          </el-tree>
        </el-col>
      </el-row>
      <div style="margin-top:50px;">
        <el-button type="default" size="small" @click="cancel">重 置</el-button>
        <el-button type="primary" size="small" @click="comfirRole">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Basic } from '@/api/base'
import { addRole } from '@/api/role'
export default {
  components: {},

  data() {
    return {
      roleId: null, // 角色id
      roleForm: {
        roleName: null, // 角色名字
        roleDesc: null, // 角色说明
        permissionIds: [] // 权限id集
      },
      defaultProps: {
        children: 'permissionList',
        label: 'permissionName'
      },
      treeData: [],
      isHandle: false
    }
  },

  computed: {},
  created() {
    if (this.$route.params.id) {
      this.roleId = this.$route.params.id
      this.getroleDetails(this.roleId)
    }
  },
  mounted() {
    this.getTableData()
    this.changeCss()
  },

  methods: {
    // 角色名称change事件
    roleNameClick() {
      this.roleForm.roleName = this.roleForm.roleName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 获取角色详情
    getroleDetails(id) {
      Basic.general('admin/permission/by_role', { roleId: id }).then(res => {
        if (res.code === 200) {
          this.$refs.tree.setCheckedKeys(res.data.permissionList)
          this.roleForm.roleName = res.data.roleName
          this.roleForm.roleDesc = res.data.roleDesc
          this.roleForm.permissionIds = res.data.permissionList
        }
      })
    },
    // 编辑
    editRole() {
      const vm = this
      if (vm.isHandle) {
        Basic.normal('admin/role/edit', vm.roleForm).then(res => {
          vm.$message({ message: '保存成功', type: 'success' })
          vm.$router.back()
        })
      } else {
        vm.$message({ message: '保存成功', type: 'success' })
        vm.$router.back()
      }
    },
    // 新增权限
    comfirRole() {
      if (!this.roleForm.roleName) {
        this.$message.warning('请输入角色名称!')
        return false
      }
      if (this.roleId) {
        // 编辑
        this.roleForm.roleId = this.roleId
        this.editRole()
      } else {
        // 新增
        addRole(this.roleForm).then(res => {
          if (res.code === 200) {
            this.$message({ message: '新增成功', type: 'success' })
            this.$router.back()
            this.cancel()
          }
        })
      }
    },
    // 取消
    cancel() {
      this.$refs.tree.setCheckedKeys([]) // 清空权限树
      this.roleForm.roleName = '' // 清空角色名字
      this.roleForm.roleDesc = '' // 清空角色说明
      this.roleForm.permissionIds = [] // 清空角色id
    },
    // 获取权限
    getTableData() {
      const vm = this
      Basic.list('admin/permission').then(res => {
        if (res.code === 200) {
          vm.treeData = res.data
        }
      })
    },
    handleExpand() { // 节点被展开时触发的事件	//因为该函数执行在renderContent函数之前，所以得加定时
      setTimeout(() => {
        this.changeCss()
      }, 10)
    },
    childrenCheck() {
      this.checked = true
    },
    // 权限点击事件
    perissionClick(val) {
      this.checked = true
    },
    // 树形change事件
    handleCheck(item, list) {
      const vm = this
      const { checkedKeys = [], halfCheckedKeys = [] } = list
      const arr = [...checkedKeys, ...halfCheckedKeys]
      vm.roleForm.permissionIds = arr
      vm.isHandle = true
    },
    // 返回上一页
    goBack() {
      this.$router.back()
    },
    changeCss() {
      var levelName = document.getElementsByClassName('levelname') // levelname是上面的最底层节点的名字
      for (var i = 0; i < levelName.length; i++) {
        // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
        levelName[i].parentNode.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
        levelName[i].parentNode.style.styleFloat = 'left'
      }
    },
    // 内容区渲染后执行 判断底层 赋 class
    renderContent(h, { node, data, store }) {
      let classname = ''
      if (data.type === 3) {
        classname = 'levelname'
      }
      // 由于项目中有二级菜单也有三级菜单，就要在此做出判断。
      // if (node.data.type === 2 && node.childNodes.length === 0) {
      //   classname = 'levelname'
      // }
      return (
        <p class={classname}>
          {node.label}
        </p>)
    }
  }
}

</script>
<style lang='scss' scoped>
  .role-main{
    padding: 20px 24px;
  }
  /deep/ .el-page-header__title {
    font-size: 20px;
    font-weight: 500;
  }
  /deep/ .el-page-header__left::after {
    width: 0;
  }
</style>
