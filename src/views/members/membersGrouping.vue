<!--会员分组-->
<template>
  <div class="app-container">
    <el-form :inline="true" :model="formData" size="small" class="form-inline">
      <!-- <el-form-item>
        <el-select
          v-model="formData.tagIds"
          placeholder="标签"
          clearable
          multiple
        >
          <el-option v-for="item in theLabelsj" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-select v-model="formData.status" clearable no-data-text="启用">
          <el-option
            v-for="item in theLabel"
            :key="item.index"
            :label="item.label"
            :value="item.index"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formData.name"
          clearable
          placeholder="分组名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formData.memName"
          clearable
          placeholder="会员名称"
          class="hy"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item class="buttons">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
        <el-button plain icon="el-icon-refresh-right" @click="reset">重 置</el-button>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button plain icon="el-icon-upload2" @click="handleNumber">导入分组</el-button>
        <el-button plain icon="el-icon-plus" @click="add">新 增</el-button>
      </el-form-item>
    </el-form>
    <public-table
      :table-head="tableHead"
      :table-data="tableData"
    >
      <template slot="status" slot-scope="slotProps">
        <el-switch
          v-model="slotProps.data.status"
          :active-value="1"
          :inactive-value="0"
          inactive-color="#909399"
          active-color="#2F80ED"
          @change="handleStatusChange(slotProps.data)"
        ></el-switch>
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="handleEdit(slotProps.data)">修改</el-button>
      </template>
    </public-table>
    <!-- 新增、修改、删除弹窗 -->
    <class-dialog :dialog-obj="dialogObj" @cancel="cancel" @confirm="confirm" @closeIcon="closeIcon">
      <div slot="center" class="dialog">
        <el-form v-if="dialogIndex === 1" ref="addLabel" :model="GoodAdd" label-width="75px">
          <el-form-item label="分组名称:">
            <el-input v-model.trim="GoodAdd.name" placeholder="请输入分组名称"></el-input>
          </el-form-item>
          <el-form-item label="备注:" style="margin-top: 20px">
            <el-input v-model.trim="GoodAdd.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <!-- 导入分组 -->
        <el-form v-if="dialogIndex === 2" :rules="rules" label-width="80px" size="small">
          <a href="https://yswl-cloud-stall.obs.cn-north-4.myhuaweicloud.com/middleground/storeclass/20210506/3d7a62fcb8594a3c8c69220819be0e48_.xlsx"><el-button size="small">下载模板</el-button></a>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :http-request="changeFile"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            style="margin-top: 10px"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xslx文件，且不超过500kb</div>
          </el-upload>
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
import { groupList, addSave, update, listNoPage } from '@/api/members'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import classDialog from '@/components/Dialog/Dialog'
import { mapGetters } from 'vuex'
export default {
  components: {
    PublicTable,
    Pagination,
    classDialog
  },
  data() {
    return {
      formData: {
        status: '',
        tagIds: '',
        name: '',
        memName: ''
      },
      tableHead: [
        { label: '分组名称', value: 'name' },
        { label: '备注', value: 'remark' },
        { label: '是否启用', type: 'slot', slotName: 'status' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 250 }
      ],
      dialogObj: {
        DialogType: false, // 弹窗开关
        title: '请填写信息', // 标题
        width: '20%'
      },
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      GoodAdd: {
        id: '',
        name: '',
        remark: '',
        creatorId: '1'
      },
      dialogIndex: '',
      biaoqian: '',
      theLabelsj: [],
      file: {},
      rules: {},
      // 启用
      theLabel: [
        { index: '1', label: '启用' },
        { index: '0', label: '关闭' }
      ]
    }
  },

  computed: {
    ...mapGetters(['token'])
  },

  mounted() {
    this.groupLists()
    this.getTheLabel()
  },
  created() {
    this.formData.status = this.theLabel[0].index
  },
  methods: {
    // 查询
    handleQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      vm.groupLists()
    },
    // 会员分组列表接口
    groupLists() {
      const vm = this
      const params = {
        pageNum: vm.currentPage,
        pageSize: vm.pageSize,
        status: vm.formData.status,
        name: vm.formData.name,
        memName: vm.formData.memName
      }
      groupList(params).then(res => {
        if (res.code === 200) {
          vm.tableData = res.data.records
          vm.sumTotal = res.data.total
        }
      })
    },
    // 重置
    reset() {
      const vm = this
      vm.formData.status = this.theLabel[0].index
      vm.formData.tagIds = ''
      vm.formData.name = ''
      vm.formData.memName = ''
      this.groupLists()
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
    // 新增弹窗
    add() {
      this.dialogIndex = 1
      this.dialogObj.DialogType = true
      this.dialogObj.title = '新增'
    },
    // 修改弹窗
    handleEdit(item) {
      const vm = this
      const { id, name, remark } = item
      vm.dialogIndex = 1
      vm.GoodAdd.id = id
      vm.GoodAdd.name = name
      vm.GoodAdd.remark = remark
      vm.dialogObj.DialogType = true
      vm.dialogObj.title = '编辑'
    },
    // 导入分组数据
    handleNumber() {
      this.dialogIndex = 2
      this.dialogObj.DialogType = true
      this.dialogObj.title = '导入分组'
    },
    changeFile(val) {
      this.file = val.file
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    // 会员分组新增
    memSaveAdd() {
      if (!this.GoodAdd.name) {
        this.$message.error('请输入分组名称')
        return false
      }
      const params = {
        name: this.GoodAdd.name || null,
        remark: this.GoodAdd.remark,
        creatorId: this.GoodAdd.creatorId
      }
      addSave(params).then(res => {
        this.$message({ message: `新增成功`, type: 'success' })
        this.groupLists()
        this.dialogObj.DialogType = false
      })
    },
    // 会员分组修改
    updateMembers() {
      if (!this.GoodAdd.name) {
        this.$message.error('请输入分组名称')
        return false
      }
      const params = {
        id: this.GoodAdd.id,
        name: this.GoodAdd.name || null,
        remark: this.GoodAdd.remark,
        creatorId: this.GoodAdd.creatorId
      }
      update(params).then(res => {
        this.$message({ message: `修改成功`, type: 'success' })
        this.groupLists()
        this.dialogObj.DialogType = false
      })
    },
    // 导入会员分组
    memImportGroup() {
      const params = new FormData()
      params.append('file', this.file)
      const url = `${process.env.VUE_APP_BASE_API}/mem_group/importGroup`
      this.$axios.post(url, params, {
        headers: {
          Authorization: this.token,
          source: 4
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success({
            message: '导入成功',
            duration: 2000,
            center: true,
            width: 60
          })
          this.groupLists()
          this.dialogObj.DialogType = false
          this.$refs.upload.clearFiles()
        } else {
          this.$message.error({
            message: res.data.msg,
            duration: 0,
            center: true,
            showClose: true,
            width: 60
          })
          this.groupLists()
          this.dialogObj.DialogType = false
          this.$refs.upload.clearFiles()
        }
      })
    },
    // 确认弹窗事件
    confirm() {
      const vm = this
      if (vm.dialogIndex === 1) {
        // 新增、编辑
        if (vm.GoodAdd.id) {
          vm.updateMembers()
        } else {
          vm.memSaveAdd()
        }
      } else {
        vm.memImportGroup()
      }
    },
    // 分页
    handlePageSize(val) {
      this.pageSize = val
      this.groupLists()
    },
    handlePageCurrent(val) {
      this.currentPage = val
      this.groupLists()
    },
    // 启用
    async handleStatusChange(item) {
      update({
        id: item.id,
        status: item.status
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: (item.status === 1 ? '启用' : '关闭') + '成功!',
            type: 'success'
          })
        }
      })
    },
    // 取消关闭弹窗
    cancel() {
      this.dialogObj.DialogType = false // 关闭弹窗
    },
    // 弹窗icon关闭
    closeIcon() {
      const vm = this
      vm.GoodAdd.name = ''
      vm.GoodAdd.remark = ''
      vm.GoodAdd.id = ''
      vm.dialogObj.DialogType = false
    }
  }
}
</script>
<style lang='scss' scoped>
.hy {
  width: 343px;
}
.buttons {
  float: right;
}
::v-deep .el-button + .el-button {
  font-size: 14px;
}
::v-deep .el-button--small {
  font-size: 14px;
}
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 24px;
}
</style>
