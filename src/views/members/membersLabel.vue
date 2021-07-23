<!--标签管理-->
<template>
  <div class="app-container">
    <el-form ref="formData" :model="formData" :inline="true" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.name"
          clearable
          placeholder="标签"
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
        <el-button plain icon="el-icon-upload2" @click="handleNumber">导入标签</el-button>
        <el-button plain icon="el-icon-plus" @click="add">新 增</el-button>
      </el-form-item>
    </el-form>
    <public-table
      :table-head="tableHead"
      :table-data="tableData"
      @handle-selection="selection"
    >
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="handleEdit(slotProps.data)">编辑</el-button>
        <el-button type="text" @click="handleInfo(slotProps.data.id)">删除</el-button>
      </template>
    </public-table>
    <!-- 新增、修改、删除弹窗 -->
    <class-dialog :dialog-obj="dialogObj" @cancel="dialogObj.DialogType = false" @confirm="confirm" @closeIcon="closeIcon">
      <div slot="center" class="dialog">
        <el-form v-if="dialogIndex === 1" ref="addLabel" :model="GoodAdd" label-width="75px">
          <el-form-item label="标签名称:" style="margin-top: 20px">
            <el-input v-model.trim="GoodAdd.name" placeholder="请输入标签名称"></el-input>
          </el-form-item>
          <el-form-item label="备注:" style="margin-top: 20px">
            <el-input v-model.trim="GoodAdd.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="dialogIndex === 2" :rules="rules" label-width="80px" size="small">
          <a href="https://yswl-cloud-stall.obs.cn-north-4.myhuaweicloud.com/middleground/storeclass/20210506/0398322ce8144f7f8a084c2f9afe64e7_.xlsx"><el-button size="small">下载模板</el-button></a>
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
import { membersbq, membersAdd, membersUpdate, membersDelete } from '@/api/members'
import { mapGetters } from 'vuex'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import classDialog from '@/components/Dialog/Dialog'
export default {
  components: {
    PublicTable,
    Pagination,
    classDialog
  },
  data() {
    return {
      formData: {
        name: ''
      },
      tableHead: [
        { label: '标签名称', value: 'name' },
        { label: '备注', value: 'remark' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 250 }
      ],
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      // 发货
      dialogObj: {
        DialogType: false, // 弹窗开关
        title: '请填写信息', // 标题
        width: '20%'
      },
      GoodAdd: {
        id: '',
        name: '',
        remark: '',
        creatorId: '1'
      },
      dialogIndex: '',
      file: {},
      rules: {}
    }
  },

  computed: {
    ...mapGetters(['token'])
  },

  mounted() {
    this.getMembersbq()
  },

  methods: {
    handleQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      const params = {
        name: vm.formData.name || null
      }
      vm.searchData = params
      vm.getMembersbq()
    },
    // 获取会员标签列表
    getMembersbq() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.searchData))
      params.pageNum = vm.currentPage
      params.pageSize = vm.pageSize
      membersbq(params).then(res => {
        if (res.code === 200) {
          vm.tableData = res.data.records
          vm.sumTotal = res.data.total
        }
      })
    },
    // 分页
    handlePageSize(val) {
      this.pageSize = val
      this.getMembersbq()
    },
    handlePageCurrent(val) {
      this.currentPage = val
      this.getMembersbq()
    },
    // 导入标签数据
    handleNumber() {
      this.dialogIndex = 2
      this.dialogObj.DialogType = true
      this.dialogObj.title = '导入标签'
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
    // 导入会员标签
    memImportGroup() {
      const params = new FormData()
      params.append('file', this.file)
      const url = `${process.env.VUE_APP_BASE_API}/mem_tag/importTag`
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
          this.getMembersbq()
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
          this.getMembersbq()
          this.dialogObj.DialogType = false
          this.$refs.upload.clearFiles()
        }
      })
    },
    // 新增弹窗
    add() {
      this.dialogObj.DialogType = true
      this.dialogObj.title = '新增'
      this.dialogIndex = 1
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
    // 确认弹窗事件
    confirm() {
      const vm = this
      if (vm.dialogIndex === 1) {
        // 新增、编辑
        if (vm.GoodAdd.id) {
          vm.updateMembers()
        } else {
          vm.Addmembers()
        }
      } else {
        vm.memImportGroup()
      }
    },
    // 重置
    reset() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      const params = {
        name: null
      }
      vm.searchData = params
      this.formData.name = ''
      vm.getMembersbq()
    },
    // 新增
    Addmembers() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.GoodAdd))
      if (!params.name) {
        this.$message.error('请输入标签名称')
        return false
      }
      membersAdd(params).then(res => {
        vm.$message({ message: `新增成功`, type: 'success' })
        vm.getMembersbq()
        vm.dialogObj.DialogType = false
      })
    },
    // 多选
    selection(v) {},
    // 修改
    updateMembers() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.GoodAdd))
      if (!params.name) {
        this.$message.error('请输入标签名称')
        return false
      }
      membersUpdate(params).then(res => {
        this.$message({ message: `修改成功`, type: 'success' })
        this.getMembersbq()
        this.dialogObj.DialogType = false
      })
    },
    // 删除
    handleInfo(items) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        membersDelete({ id: items }).then(res => {
          if (res.code === 200) {
            this.$message({ message: '删除成功', type: 'success' })
            this.getMembersbq()
          }
        })
      })
    },
    // 取消关闭弹窗
    cancel() {
      this.dialogObj.DialogType = false
    },
    // 弹窗icon关闭
    closeIcon() {
      this.GoodAdd.name = ''
      this.GoodAdd.remark = ''
      this.GoodAdd.id = ''
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

</style>
