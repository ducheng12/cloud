<template>
  <div class="class_box">
    <div class="class_tree">
      <div class="class_title">一级分类 <i class="el-icon-plus" @click="classTitle"></i></div>
      <div class="class-nav">
        <div
          v-for="item in treeData"
          :key="item.id"
          :class="{ active: flag === item.id }"
          class="initClass"
          @click="clickInitClass(item)"
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
          v-model="foxbaseParam.name"
          style="width: 200px"
          placeholder="请输入名称"
          size="small"
        ></el-input>
        &nbsp;
        <el-button type="primary" icon="el-icon-search" size="small" @click="goodsQuery">查询</el-button>
        <el-button v-if="treeData.length > 0" type="default" size="small" @click="addFoxbase">新建{{ formData.parentName }}分类</el-button>
        <el-button v-else type="default" size="small" @click="addFoxbase">新建分类</el-button>
      </el-form>
      <!-- 表格 -->
      <public-table :table-head="tableHeadConfig" :table-data="tableLoadData">
        <template slot="handle" slot-scope="slotProps">
          <el-button type="text" @click="setTowGoodsClass(slotProps.data)">编辑</el-button>
          <el-button type="text" @click="deleteGoods(slotProps.data.id, slotProps.data.$index)">删除</el-button>
        </template>
      </public-table>
      <!-- 分页 -->
      <Pagination
        ref="myPagination"
        :sum-total="sumTotal"
        @handle-size="handlePageSize"
        @handle-current="handlePageCurrent"
      />
    </div>
    <public-dialog
      :title="title"
      :visible="visible"
      :custom-class="'dialog-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form ref="form" :model="formData" size="small" label-width="80px">
        <el-form-item v-if="createdType === 2" label="父类:">
          {{ formData.parentName }}
        </el-form-item>
        <el-form-item label="分类名称:">
          <el-input v-model.trim="formData.name" maxlength="15" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item v-if="createdType === 2" label="分类编码:">
          <!-- <el-input v-model.trim="formData.code" :maxlength="3" placeholder="请输入分类编码" @input="toUpper"></el-input> -->
          <el-input v-model.trim="formData.code" :maxlength="3" placeholder="请输入分类编码"></el-input>
        </el-form-item>
        <el-form-item v-if="createdType === 2" label="分类图标:">
          <SingleUpload :image-url="formData.fullImgUrl" @on-upload="handleUploader" />
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
import { Basic } from '@/api/base'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import PublicDialog from '@/components/Dialog/PublicDialog'
import SingleUpload from '@/components/SingleUpload'
import {
  getGoodsInitClass,
  getGoodsSecondClass,
  setGoodsClass,
  deleteGoodsClass
} from '@/api/goods'
export default {
  components: {
    Pagination,
    PublicTable,
    PublicDialog,
    SingleUpload
  },
  data() {
    return {
      sumTotal: 0, // 分页
      pageSize: 10,
      pageNum: 1,
      mouseoverStatus: false, // 移入状态
      skuDialog: false, // sku图弹窗
      skuImageUrl: null, // sku图弹窗地址
      uploadUrl: `${process.env.VUE_APP_FILE_URL}/file/uploadFile`, // 图片地址
      imgBaseUrl: process.env.VUE_APP_FILE_URL_OBS,
      storeBannerImgList: [], // 图片地址
      setGoodClass: {// 新增或修改的参数
        id: null,
        name: null,
        status: 1, // 是否生效：0失效，1生效
        imgUrl: null // 图片地址
      },
      flag: 0,
      initData: {},
      dialogObj: {
        DialogType: false, // 新建分类弹窗开关
        title: '新建一级分类', // 标题
        width: '30%'
      },
      treeData: [], // 一级分类数据
      // 配置
      tableHeadConfig: [
        { label: '名称', value: 'name' },
        { label: '分类编码', value: 'code' },
        { label: '创建人', value: 'creatorName' },
        { label: '添加时间', value: 'createTime' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 150 }
      ],
      // 二级分类数据
      tableLoadData: [],
      foxbaseParam: { // 二级分类参数
        parentId: null,
        name: null
      },
      title: '',
      visible: false,
      createdType: 1,
      formData: {
        id: '',
        name: '',
        parentName: '',
        code: '',
        imgUrl: '',
        fullImgUrl: '',
        parentId: ''
      }
    }
  },
  async created() {
    const vm = this
    await vm.getClass()
    if (vm.treeData.length) {
      await vm.clickInitClass(vm.treeData[0])
    }
  },
  methods: {
    // 查询分类
    goodsQuery() {
      const vm = this
      vm.pageNum = 1
      vm.$refs.myPagination.currentPage = 1
      this.getGoodsSecondClassData()
    },
    // 二级分类删除
    deleteGoods(id, index) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoodsClass({ id: id }).then(res => {
          if (res.code === 200) {
            this.tableLoadData.splice(index, 1)
            this.getGoodsSecondClassData()
            this.$message({ message: '删除成功', type: 'success' })
          }
        })
      })
    },
    // 蕾蕾编码大写设置
    toUpper() {
      this.formData.code = this.formData.code.toUpperCase()
    },
    // 获取分类
    async getClass() {
      const vm = this
      const res = await getGoodsInitClass()
      const { data } = res
      vm.treeData = data
    },
    // 新建分类
    classTitle() {
      const vm = this
      vm.visible = true
      vm.title = '新建一级分类'
      vm.createdType = 1
    },
    // 上传图片
    handleUploader(val) {
      const vm = this
      const formData = new FormData()
      formData.append('file', val.file)
      formData.append('path', 1)
      formData.append('useDay', 1)
      const url = '/file/uploadFile'
      Basic.upLoad(url, formData).then(res => {
        const { data } = res
        const { ip, fileUrl } = data
        vm.formData.imgUrl = fileUrl
        vm.formData.fullImgUrl = ip + '/' + fileUrl
        vm.$message({ message: `上传图片成功！`, type: 'success' })
      })
    },
    // 新增分类
    async addGoodsClass(text) {
      const res = await setGoodsClass(this.setGoodClass)
      if (res.code === 200) {
        this.$message({ message: `${text}成功`, type: 'success' })
        if (this.dialogObj.title === '新建一级分类') {
          this.getClass()
        }
        this.getGoodsSecondClassData()
        this.setGoodClass.name = null
        this.setGoodClass.imgUrl = null
        this.setGoodClass.id = null
        this.setGoodClass.parentId = null
        this.storeBannerImgList = []
      }
    },
    // 一级分类事件
    clickInitClass(item) {
      const vm = this
      const { id, name } = item
      vm.flag = id
      vm.formData.parentName = name
      vm.formData.parentId = id
      vm.pageNum = 1
      vm.$refs.myPagination.currentPage = 1
      vm.foxbaseParam.name = ''
      vm.getGoodsSecondClassData()
    },
    // 获取二级分类数据
    async getGoodsSecondClassData() {
      const vm = this
      vm.foxbaseParam.parentId = vm.flag
      vm.foxbaseParam.pageSize = vm.pageSize
      vm.foxbaseParam.pageNum = vm.pageNum
      const { data } = await getGoodsSecondClass(vm.foxbaseParam)
      const { records = [], total } = data
      vm.tableLoadData = records
      vm.sumTotal = total
    },
    // 编辑二级分类
    addFoxbase() {
      const vm = this
      if (vm.treeData.length === 0) {
        vm.$message.warning('请先建一级分类！')
        return
      }
      vm.visible = true
      vm.title = '新建二级分类'
      vm.createdType = 2
    },
    // 编辑二级分类
    setTowGoodsClass(item) {
      const vm = this
      vm.createdType = 2
      vm.title = '编辑二级分类'
      vm.formData.name = item.name || ''
      vm.formData.code = item.code || ''
      vm.formData.imgUrl = item.imgUrl || ''
      vm.formData.fullImgUrl = item.imgUrl ? `${vm.imgBaseUrl}/${item.imgUrl}` : ''
      vm.formData.id = item.id
      vm.visible = true
    },
    // 子组件传回的分页事件
    handlePageSize(val) {
      this.pageSize = val
      this.getGoodsSecondClassData()
    },
    handlePageCurrent(val) {
      this.pageNum = val
      this.getGoodsSecondClassData()
    },
    handleCancel() {
      this.visible = false
    },
    afterClosed() {
      const vm = this
      vm.formData.name = ''
      vm.formData.code = ''
      vm.formData.name = ''
      vm.formData.imgUrl = ''
      vm.formData.fullImgUrl = ''
      vm.formData.id = ''
      vm.getGoodsSecondClassData()
    },
    handleConfirm() {
      const vm = this
      const formeData = JSON.parse(JSON.stringify(vm.formData))
      let params = {}
      if (vm.createdType === 1) {
        const { name } = formeData
        params = { name }
        if (!name) {
          vm.$message.error('请输入一级分类名称')
          return false
        }
      } else {
        // 二级分类
        params = formeData
        delete params.parentName
        const { name, code, imgUrl } = params
        if (!name) {
          vm.$message.error('请输入二级分类名称')
          return false
        }
        if (!code) {
          vm.$message.error('请输入二级分类编码')
          return false
        }
        const reg = /^[A-Za-z0-9]+$/
        if (!reg.test(vm.formData.code)) {
          vm.$message.warning('分类编码只能是字母数字组合！')
          return false
        }
        if (!imgUrl) {
          vm.$message.error('请上传二级分类图标')
          return false
        }
      }
      vm.save(params)
    },
    save(data) {
      const vm = this
      const params = JSON.parse(JSON.stringify(data))
      Basic.normal('GoodsCategory/save', params).then(res => {
        vm.$message({ message: `保存成功！`, type: 'success' })
        vm.visible = false
        if (params.code) {
          // 二级分类
          vm.getGoodsSecondClassData()
        } else {
          // 一级分类
          vm.getClass()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.class_box {
  padding: 20px;
  display: flex;
  /deep/ .dialog-view {
    width: 376px;
  }
}
.class_tree {
  width: 272px;
  height: calc(100vh - 90px);
  overflow: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  float: left;
}
.class_title {
  height: 54px;
  margin: 0;
  background: rgba(0, 0, 0, 0.02);
  line-height: 54px;
  text-align: left;
  padding: 0 16px;
  font-weight: bold;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  margin-bottom: 12px;
  .el-icon-plus {
    color: rgba(0,0,0,0.65);
    margin-left: 3px;
    cursor: pointer;
  }
}
.class_table {
  padding: 0 10px;
  width: calc(100% - 272px) !important;
  // width:100%;
}
.class-nav {
  width: 272px;
  height: calc(100vh - 144px);
}
.initClass {
  height: 36px;
  line-height: 36px;
  padding-left: 28px;
  font-size: 14px;
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
.active2 {
  overflow-x: hidden;
}
/* 滚动条样式 */
.class-nav::-webkit-scrollbar {
  width: 5px;
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
  // background: #ededed;
  // border-radius: 5px;
}
</style>
