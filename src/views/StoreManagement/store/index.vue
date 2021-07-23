<!-- 门店列表 -->
<template>
  <div class="app-container">
    <el-form :inline="true" :model="formData" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.relationPhone"
          clearable
          placeholder="联系人/手机号"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formData.name"
          clearable
          placeholder="请输入门店名称进行查询"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formData.mainType" placeholder="主营类目">
          <el-option label="女装" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formData.status" placeholder="是否启用">
          <el-option label="停用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button plain icon="el-icon-refresh-right" @click="reset">重置</el-button>
        <el-button plain icon="el-icon-plus" @click="handleCreate">新增门店</el-button>
        <el-button plain icon="el-icon-plus" @click="exportData">导出数据</el-button>
      </el-form-item>
    </el-form>
    <public-table :table-head="tableHead" :table-data="tableData" :show-index="false" :show-select="true" @handle-selection="handleSelection">
      <template slot="mainType" slot-scope="slotProps">
        {{ slotProps.data.mainType === 1 ? '女装' : '其它' }}
      </template>
      <template slot="auditStatus" slot-scope="slotProps">
        <span :style="{ color: slotProps.data.color }">{{ slotProps.data.auditStatus }}</span>
      </template>
      <template slot="status" slot-scope="slotProps">
        <el-switch
          v-model="slotProps.data.enableFlag"
          @change="handleStatusChange(slotProps.data)"
        ></el-switch>
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button v-if="false" type="text" @click="handleInfo(slotProps.data)">详情</el-button>
        <el-button type="text" @click="handleEdit(slotProps.data)">{{ slotProps.data.verifyStatus === 1 || slotProps.data.verifyStatus === 2 ? '查看' : '编辑' }}</el-button>
        <el-button v-if="false" type="text" @click="handleCheck(slotProps.data)">绑定云镜</el-button>
      </template>
    </public-table>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />

    <public-dialog
      :title="'云镜绑定'"
      :visible="filterView"
      :custom-class="'filter-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form ref="filterForm" :inline="true" :model="filterForm" size="small" label-width="100px">
        <el-form-item label="已绑定云镜：" prop="keyWord">
        </el-form-item>
        <br/>
        <div v-if="optionList[0] !== null">
          <el-form-item
            v-for=" ( item, index ) in optionList "
            :key=" index "
            :label="'设备'+ (index + 1) +':'"
            prop="creatorName"
            style="position:relative;"
          >
            <el-input
              v-model=" optionList[index] "
              :disabled="true"
              style="width:210px;"
              :value="item"
              placeholder="设备编号"
              @mouseover.native="changeVover"
              @mouseout.native="changeOut"
            ></el-input>
            <el-button
              v-show="delBtn"
              style="border:0;color:#1890FF;position:absolute;padding: 10px 15px;"
              @click="delResetForm(item)"
            >删除</el-button>
          </el-form-item>
        </div>
        <el-form-item label="添加设备:" prop="creatorName">
          <el-input v-model="addFilterForm" style="width:210px;" placeholder="设备编号"></el-input>
          <el-button
            style="border:0;color:#1890FF;"
            @click="addResetForm"
          >添加</el-button>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="handleReset">取消</el-button>
        <el-button type="primary" size="small" @click="handleSearch">确定</el-button>
      </template>
    </public-dialog>
  </div>
</template>

<script>
import fileDownload from 'js-file-download'
import PublicTable from '@/components/Tables/PublicTable'
import Pagination from '@/components/Pagination'
import PublicDialog from '@/components/Dialog/PublicDialog'
import { Basic } from '@/api/base'
import { getToken } from '@/utils/auth'

export default {
  components: { PublicTable, Pagination, PublicDialog },

  data() {
    return {
      tableHead: [
        { label: '门店名称', value: 'shopName' },
        { label: '所在省份', value: 'provinceName' },
        { label: '所在城市', value: 'cityName' },
        { label: '联系人', value: 'contactName' },
        { label: '手机号', value: 'contactPhone' },
        { label: '主营类目', type: 'slot', slotName: 'mainType' },
        { label: '入驻审核状态', type: 'slot', slotName: 'auditStatus', width: 170 },
        { label: '创建时间', value: 'createTime', width: 160 },
        { label: '创建人', value: 'createUser' },
        { label: '启用', type: 'slot', slotName: 'status' },
        { label: '操作', type: 'slot', slotName: 'handle', width: 250 }
      ],
      verifyStatusList: [
        { label: '平台已驳回', value: 0, color: 'red' }, { label: '待银行审核', value: 1, color: 'black' },
        { label: '银行审核通过', value: 2, color: '#98CB87' }, { label: '银行审核驳回', value: 3, color: 'red' }, { label: '待平台审核', value: 5, color: 'black'}
      ],
      tableData: [],
      optionList: [],
      addFilterForm: '',
      formData: {
        relationPhone: '',
        name: '',
        mainType: '',
        status: ''
      },
      selectList: [],
      delBtn: false,
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      showAdd: false,
      showApprove: false,
      filterView: false,
      supplierId1: null,
      supplierId2: null,
      cloudMirrorId: '',
      showType: 1,
      filterForm: {
        keyWord: '',
        creatorName: '',
        dateRange: [],
        startTime: '',
        endTime: '',
        status: null
      },
      searchData: {}
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
      const params = {
        name: vm.formData.name || null,
        keyWord: vm.formData.relationPhone,
        mainType: vm.formData.mainType,
        status: vm.formData.status
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
      Basic.general('shop/page', params).then(res => {
        const { data } = res
        const { total = 0, records = [] } = data
        vm.sumTotal = total
        // const arr = records.map(t => {
        //   t.statusName = t.status === 1 ? '审核通过' : '待审核'
        //   return t
        // })
        // vm.tableData = arr
        const list = records
        list.forEach(item => {
          vm.verifyStatusList.forEach(x => {
            if (x.value === item.verifyStatus) {
              item.auditStatus = x.label
              item.color = x.color
            }
          })
        })
        vm.tableData = list
        console.log('列表数据:', vm.tableData)
      })
    },
    // 查看
    look(d) {
      this.$router.push({
        path: 'storemanagement-list/cloudproducts',
        query: {
          id: d
        }
      })
    },
    // 重置
    reset() {
      const vm = this
      vm.formData.name = ''
      vm.formData.relationPhone = ''
      vm.formData.status = ''
      vm.formData.mainType = ''
      vm.searchData.pageNum = 1
      vm.searchData = JSON.parse(JSON.stringify(vm.formData))
      vm.$nextTick(_ => {
        vm.getTableData()
      })
    },
    // 新增
    handleCreate() {
      this.$router.push({
        path: 'storemanagement-list/storemanagement-add'
      })
    },
    // 修改
    handleEdit(data) {
      this.$router.push({
        path: 'storemanagement-list/storemanagement-add',
        query: {
          id: data.shopId
        }
      })
    },
    // 绑定云镜
    handleCheck(data) {
      this.filterView = true
      this.cloudMirrorId = data.id
      const params = {
        id: data.id
      }
      const vms = this
      Basic.normal('shop/getMirrorsByShopId', params).then(res => {
        vms.optionList = res.data
      })
    },
    afterClosed() {
      this.filterView = false
    },
    handleCancel() {
      this.filterView = false
    },
    handleReset() {
      this.filterView = false
    },
    handleSearch() {
      const params = {
        id: this.cloudMirrorId,
        mirrorNos: []
      }
      const num = /^[0-9]+$/
      if (this.addFilterForm !== '' && !num.test(this.addFilterForm)) {
        this.$message.warning('输入框不能为空，且只能为数字！')
        return
      }
      const vm = this
      params.mirrorNos = [...new Set(this.optionList)]
      if (this.addFilterForm !== '' && num.test(this.addFilterForm)) {
        params.mirrorNos.push(this.addFilterForm)
      }
      params.mirrorNos = [...new Set(params.mirrorNos)]
      Basic.normal('shop/bindingMirror', params).then(res => {
        if (res.code === 200) {
          this.filterView = false
          this.addFilterForm = ''
          vm.$message({ message: '绑定成功', type: 'success' })
          vm.getTableData()
        }
      })
    },
    addResetForm() {
      const num = /^[0-9]+$/
      if (this.addFilterForm !== '' && num.test(this.addFilterForm)) {
        this.optionList.push(this.addFilterForm)
        this.addFilterForm = ''
      } else {
        this.$message.warning('输入框不能为空，且只能为数字！')
      }
    },
    // 查看详情
    handleInfo(data) {
      this.$router.push({
        path: 'storemanagement-list/storemanagement-detail',
        query: {
          id: data.id
        }
      })
    },
    // 启用
    handleStatusChange(data) {
      const vm = this
      const params = {
        id: data.id
      }
      Basic.normal('shop/enabledByShopId', params).then(res => {
        if (res.code === 200) {
          vm.$message({ message: data.enableFlag ? '已启用' : '已停用', type: 'success' })
        }
      }).catch(r => {
        data.enableFlag = data.enableFlag === 1 ? 0 : 1
      })
    },
    // 导出
    // 多选数组
    handleSelection(e) {
      this.selectList = e
    },
    exportData() {
      const vm = this
      const shopId = []
      if (this.selectList.length) {
        this.selectList.forEach(element => {
          shopId.push(element.id)
        })
      }
      const params = this.selectList.length ? {
        keyWord: vm.formData.relationPhone,
        name: vm.formData.name,
        mainType: vm.formData.mainType,
        status: vm.formData.status,
        shopIds: shopId
      } : {
        keyWord: vm.formData.relationPhone,
        name: vm.formData.name,
        mainType: vm.formData.mainType,
        status: vm.formData.status
      }
      const rs = {
        headers: {
          Authorization: getToken(),
          source: 4
        },
        responseType: 'blob',
        params
      }
      if (vm.tableData.length === 0) {
        vm.$message.warning('暂无数据！')
        return
      }
      if (shopId.length === 0) {
        vm.$message.warning('请选择导出数据！')
        return
      }
      vm.$axios.get(`${process.env.VUE_APP_BASE_API}/shop/exportShop`, rs).then(res => {
      // vm.$axios.get(`http://192.168.1.41:7005/shop/exportShop`,rs).then(res => {
        fileDownload(res.data, '门店列表.xlsx')
      }).catch(err => {
        const { response } = err
        if (response.status && response.status === 401) {
          vm.$message.error('暂无操作权限，请联系管理员！')
        }
      })
    },
    // 云镜删除事件
    delResetForm(itme) {
      this.optionList.forEach((t, i) => {
        if (t === itme) {
          this.optionList.splice(i, 1)
        }
      })
    },
    changeVover(e) {
      this.delBtn = true
    },
    changeOut() {
      const vm = this
      setTimeout(() => {
        vm.delBtn = false
      }, 4000)
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
.app-container /deep/ .filter-view {
  width: 450px;
}
</style>
