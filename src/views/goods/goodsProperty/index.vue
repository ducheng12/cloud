<template>
  <div class="class_box app-container">
    <div class="class_tree" max-height="620">
      <h4 class="class_title">属性</h4>
      <div class="class-nav">
        <div
          v-for="(item, index) in treeData"
          :key="item.id"
          :class="{ initClass: true, active: flag == index }"
          @click="handleNodeClick(index, item)"
        >
          <span class="before-line"></span>
          <span class="before-active"></span>
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="class_table">
      <el-form style="padding-bottom: 20px">
        <el-input
          v-model="setGoodClass.name"
          style="width: 200px"
          size="small"
          placeholder="请输入名称"
        ></el-input>
        &nbsp;
        <el-button type="primary" size="small" icon="el-icon-search" @click="goodsQuery">查询</el-button>
        <el-button v-if="treeData.length > 0" type="default" size="small" @click="addFoxbase">新建{{ initData.name }}</el-button>
        <el-button v-else type="default" :disabled="treeData.length === 0" size="small" @click="addFoxbase">新建属性名称</el-button>
      </el-form>
      <!-- 表格 -->
      <PublicTable :table-head="tableHead" :table-data="tableData" :show-select="false">
        <template slot="handle" slot-scope="slotProps">
          <el-button
            type="text"
            size="mini"
            @click="setGoodsClass(slotProps.data)"
          >
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="DeleteBy(slotProps.data.id)">删除</el-button>
        </template>
      </PublicTable>
      <!-- 分页 -->
      <Pagination
        ref="myPagination"
        :sum-total="sumTotal"
        @handle-size="handlePageSize"
        @handle-current="handlePageCurrent"
      />
    </div>

    <!-- 新建分类 -->
    <class-dialog :dialog-obj="dialogObj" @cancel="cancelClick" @confirm="confirm">
      <div slot="center">
        <el-form :model="GoodsCategorys" size="small" class="form-data">
          <el-form-item>
            <!-- <el-input v-model.trim="GoodsCategorys.name" :placeholder="`请输入${initData.name}名称`" @input="cpCompute"></el-input> -->
            <el-input v-model.trim="GoodsCategorys.name" :placeholder="`请输入${initData.name}名称`" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="attrType === '3'">
            <el-input v-model="GoodsCategorys.code" maxlength="3" :placeholder="`请输入${initData.name}编码`" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number="GoodsCategorys.sort" :placeholder="`请输入属性排序值`" clearable @input="inputControl(GoodsCategorys, 'sort', 0)"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </class-dialog>
  </div>
</template>

<script>
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import classDialog from '@/components/Dialog/Dialog'
import {
  AttributeSelectBase,
  AttributeByAttrId,
  AttributeSave,
  AttributeDeleteById,
  AttSaveOrRelation,
  GoodSelectListPage
} from '@/api/goodsAttribute'
export default {
  components: {
    PublicTable,
    Pagination,
    classDialog
  },
  data() {
    return {
      flag: 0,
      initData: {},
      dialogObj: {
        DialogType: false, // 新建分类弹窗开关
        title: '添加属性', // 标题
        width: '20%'
      },
      treeData: [],
      objDeploy: {
        id: null
      },
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      // 配置
      tableHead: [
        { label: '名称', value: 'name' },
        { label: '创建人', value: 'creatorName' },
        { label: '添加时间', value: 'createTime' },
        { label: '排序', value: 'sort' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 120 }
      ],
      // 数据
      tableData: [],
      setGoodClass: {
        name: null,
        parentId: null
      },
      GoodsCategorys: {
        name: '',
        id: '',
        parentId: '',
        type: '',
        code: '',
        sort: ''
      },
      storeTagList: [],
      selectClass: {
        creatorId: 1,
        list: [],
        name: ''
      },
      title: '',
      attrType: ''
    }
  },
  watch: {
    attrType: function(val, oldVal) {
      const vm = this
      const item = {
        label: '编码',
        value: 'code'
      }
      if (val === '3') {
        vm.tableHead.splice(1, 0, item)
      } else {
        const arr = vm.tableHead.filter(t => t.value !== 'code')
        vm.tableHead = JSON.parse(JSON.stringify(arr))
      }
    }
  },
  created() {
    this.SelectListPage()
    this.SelectBase()
    this.title = this.dialogObj.title
  },
  methods: {
    cpCompute() {
      const vm = this
      if (vm.attrType === '1') {
        vm.GoodsCategorys.name = vm.GoodsCategorys.name.toUpperCase()
      }
    },
    // 查询分类
    goodsQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      this.attribute()
    },
    // 下拉列表change事件
    queryChange(event) {
      const arr = JSON.parse(JSON.stringify(event))
      this.selectClass.list = arr.map(t => ({ relationId: t }))
    },
    // 一级分类事件
    handleNodeClick(index, item) {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      vm.flag = index
      vm.initData = item
      vm.attrType = item.type
      vm.GoodsCategorys.type = item.type
      vm.GoodsCategorys.parentId = item.id
      this.attribute()
      this.setGoodClass.name = null
    },
    // 新建一级属性
    classTitle() {
      this.dialogObj.DialogType = true
      this.dialogObj.title = '添加属性'
    },
    // 子组件返回的确认弹窗事件
    confirm() {
      // 新增属性
      const vm = this
      const reg = /^[A-Za-z0-9]+$/
      if (vm.attrType === '1') {
        if (!reg.test(vm.GoodsCategorys.name)) {
          vm.$message.warning('尺码名称只能是字母数字组合！')
          return false
        }
      }
      if (vm.attrType === '3') {
        if (!reg.test(vm.GoodsCategorys.code)) {
          vm.$message.warning('颜色编码只能是字母数字组合！')
          return
        }
      }
      const params = JSON.parse(JSON.stringify(vm.GoodsCategorys))
      if (!params.parentId) {
        // 新增一级
        vm.SelectId()
      } else {
        if (params.id) {
          // 修改逻辑
          vm.addGoodsClass('编辑')
        } else {
          // 新增逻辑
          vm.addGoodsClass('新建')
        }
      }
    },
    // 新增属性
    async addGoodsClass(text) {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.GoodsCategorys))
      if (!params.name) {
        vm.$message.error('请输入属性名称！')
        return false
      }
      if (vm.attrType === '3' && !params.code) {
        vm.$message.error('请输入颜色属性编码！')
        return false
      }
      const res = await AttributeSave(params)
      if (res.code === 200) {
        this.$message({ message: `${text}成功`, type: 'success' })
        if (this.dialogObj.title === '添加属性') {
          this.SelectBase()
        }
        this.attribute()
        this.dialogObj.DialogType = false
        this.GoodsCategorys.name = ''
        this.GoodsCategorys.id = ''
        this.GoodsCategorys.code = ''
        this.GoodsCategorys.sort = ''
      }
    },
    async attribute() {
      // 获取二级属性数据
      const { id = '' } = this.initData
      this.setGoodClass.parentId = id
      const pames = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        parentId: this.setGoodClass.parentId,
        name: this.setGoodClass.name
      }
      const res = await AttributeByAttrId(pames)
      if (res.code === 200) {
        this.tableData = res.data.records
        this.sumTotal = res.data.total
      }
    },
    // 二级属性
    addFoxbase() {
      this.GoodsCategorys.name = ''
      const { id = '', name = '' } = this.initData
      this.GoodsCategorys.parentId = id
      if (!this.GoodsCategorys.parentId) {
        this.$message.error('请选择父级属性！')
        return false
      }
      this.dialogObj.title = '添加一种' + name
      this.dialogObj.DialogType = true
    },
    // 编辑二级属性
    setGoodsClass(item) {
      const vm = this
      const data = JSON.parse(JSON.stringify(item))
      vm.dialogObj.DialogType = true
      vm.dialogObj.title = '编辑' + this.initData ? this.initData.name : null
      vm.GoodsCategorys.id = data.id || ''
      vm.GoodsCategorys.name = data.name || ''
      vm.GoodsCategorys.code = data.code || ''
      vm.GoodsCategorys.sort = data.sort || ''
    },
    async SelectBase() {
      // 获取父类属性
      const res = await AttributeSelectBase()
      if (res.code === 200) {
        this.treeData = res.data
        if (this.treeData.length) {
          this.handleNodeClick(0, this.treeData[0])
        }
      }
    },
    DeleteBy(items) {
      // 根据属性id删除
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        AttributeDeleteById({ id: items }).then(res => {
          if (res.code === 200) {
            this.$message({ message: '删除成功', type: 'success' })
            this.attribute()
          }
        })
      })
    },
    async SelectId() {
      // 属性新增同时绑定分类
      if (!this.selectClass.name) {
        this.$message.error('请输入属性名称！')
        return false
      }
      const res = await AttSaveOrRelation(this.selectClass)
      if (res.code === 200) {
        this.$message({ message: `新建成功`, type: 'success' })
        if (this.dialogObj.title === '添加属性') {
          this.SelectBase()
        }
        this.dialogObj.DialogType = false
        this.selectClass.name = ''
        this.selectClass.list = []
        this.objDeploy.id = null
      }
    },
    async SelectListPage() {
      // 商品分类分页（树形）
      const res = await GoodSelectListPage()
      if (res.code === 200) {
        this.storeTagList = res.data.records
      }
    },
    // 子组件传回的表格全选事件
    handleSelectionChange(val) {
    },
    // 分页
    handlePageSize(val) {
      this.pageSize = val
      this.attribute()
    },
    handlePageCurrent(val) {
      this.currentPage = val
      this.attribute()
    },
    cancelClick() {
      const vm = this
      vm.GoodsCategorys.id = ''
      vm.GoodsCategorys.name = ''
      vm.GoodsCategorys.code = ''
      vm.GoodsCategorys.sort = ''
      vm.dialogObj.DialogType = false
    }
  }
}
</script>

<style lang="scss" scoped>
.class_box {
  display: flex;
  /deep/ .dialog-view {
    width: 348px;
  }
}
.class_tree {
  width: 272px;
  height: calc(100vh - 100px);
  overflow: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}
.class_title {
  height: 54px;
  margin: 0;
  background: rgba(0, 0, 0, 0.02);
  line-height: 54px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  margin-bottom: 12px;
}
.class_table {
  padding-left: 16px;
  min-width: calc(100% - 272px);
}
.initClass {
  height: 36px !important;
  line-height: 36px;
  font-size: 14px;
  padding-left: 28px;
  cursor: pointer;
  position: relative;
  .before-line {
    position: absolute;
    top: 0;
    left: 10px;
    width: 2px;
    height: 36px;
    background: rgba(0, 0, 0, 0.06);
  }
  .before-active {
    position: absolute;
    top: 50%;
    left: 7px;
    width: 8px;
    height: 8px;
    transform: translateY(-50%);
    border: 2px solid rgba(0,90,160,1);
    border-radius: 8px;
    display: none;
  }
  &:hover {
    color: rgba(0,90,160,1);
  }
}
.initClass.active {
  color: rgba(0,90,160,1);
  .before-active {
    display: block;
  }
}
.fenlei {
  margin-top: 20px;
}
::v-deep .my_form-item .el-select {
  width: 100%;
  margin-top: 20px;
}
::v-deep .el-table tr {
  background-color: #fff;
  height: 54px;
}
// ::v-deep .el-pagination {
//   text-align: left;
// }
.class-nav {
  width: 272px;
  height: calc(100vh - 155px);
  overflow-x: hidden;
}
/* 滚动条样式 */
.class-nav::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}
.class-nav::-webkit-scrollbar-thumb {
  //滑块部分
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
.class-nav::-webkit-scrollbar-track {
  //轨道部分
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
