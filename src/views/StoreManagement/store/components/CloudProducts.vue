<template>
  <div class="app-container">
    <el-page-header class="back" @back="$router.back()">返回</el-page-header>
    <el-form :inline="true" :model="formData" size="small" class="form-inline">
      <el-form-item>
        <el-input
          v-model="formData.goodsName"
          clearable
          placeholder="商品名称"
          @clear="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button plain icon="el-icon-refresh-right" @click="reset">重置</el-button>
        <el-button v-if="false" plain icon="el-icon-plus" @click="handleCreate">导出数据</el-button>
      </el-form-item>
    </el-form>
    <public-table :show-index="true" :table-head="tableHead" :table-data="baseInfoForm">
      <template slot="imgUrl" slot-scope="slotProps">
        <img style="width:30px;height:30px;" :src="imgBaseUrl + '/' + slotProps.data.imgUrl" @click="bigPics(slotProps)" title="点击查看大图" />
      </template>
      <template slot="source" slot-scope="slotProps">
        {{ slotProps.data.source === 1 ? '云档口商品' : '门店商品' }}
      </template>
      <template slot="classification" slot-scope="slotProps">
        {{ slotProps.data.firstCateName }}-{{ slotProps.data.secondCateName }}
      </template>
      <template slot="isShelves" slot-scope="slotProps">
        {{ slotProps.data.isShelves === 0 ? '未上架' : '上架' }}
      </template>
      <template slot="handle" slot-scope="slotProps">
        <el-button type="text" @click="handleInfo(slotProps.data)">{{ slotProps.data.skuNum || 0 }} 种</el-button>
      </template>
    </public-table>
    <Pagination
      ref="myPagination"
      :sum-total="sumTotal"
      @handle-size="handlePageSize"
      @handle-current="handlePageCurrent"
    />
    <public-dialog
      :title=" typeStatus + ' - SKU'"
      :visible="filterView"
      :custom-class="'filter-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <public-table :show-index="true" :table-head="tableSKU" class="tablHide" :table-data="tabSKU">
        <template slot="imgUrl" slot-scope="slotProps">
          <img style="width:30px;height:30px;" :src="imgBaseUrl + '/' + slotProps.data.imgUrl" @click="bigPics(slotProps)" title="点击查看大图" />
        </template>
        <template slot="isShelves" slot-scope="slotProps">
          {{ slotProps.isShelves === 0 ? '未上架' : '上架' }}
        </template>
        <template slot="tradePrice" slot-scope="slotProps">
          ￥{{ slotProps.data.tradePrice }}
        </template>
        
      </public-table>
    </public-dialog>
    <public-dialog
      :title="'缩略图'"
      :visible="bigPicView"
      :custom-class="'filters-view'"
      @handle-cancel="bigpicCancel"
      @after-close="bigpicClosed"
    >
      <!-- <img src="https://yswl-cloud-service.obs.cn-north-4.myhuaweicloud.com/img_file/3af892c4e7474c70bc5bf9eca5495f18_.jpg" alt="" /> -->
      <img :src="imgBaseUrl + '/' + bigPic" />
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
  props: {
    storeId: {
      type: String,
      default: ''
    },
    goodsAddid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imgBaseUrl: process.env.VUE_APP_FILE_URL_OBS,
      typeStatus: '',
      filterView: false,
      bigPicView: false,
      bigPic: '',
      shId: '',
      // 分页
      sumTotal: 0,
      currentPage: 1,
      pageSize: 10,
      formData: {
        goodsName: '' // 商品名称
      },
      tableHead: [
        { label: '缩略图', type: 'slot', slotName: 'imgUrl' },
        { label: '商品名称', value: 'name', width: 180 },
        { label: '来源', type: 'slot', slotName: 'source' },
        { label: '供应商', value: 'shopName' },
        { label: '分类', type: 'slot', slotName: 'classification' },
        { label: '状态', type: 'slot', slotName: 'isShelves' },
        { label: '添加时间', value: 'createTime', width: 180 },
        { label: '销量', value: 'goodsSale' },
        { label: '库存', value: 'goodsQty' },
        { label: 'SKU', type: 'slot', slotName: 'handle' }
      ],
      tableSKU: [
        { label: '缩略图', type: 'slot', slotName: 'imgUrl' },
        { label: '规格', value: 'name' },
        { label: '价格', type: 'slot', slotName: 'tradePrice' },
        { label: '库存', value: 'qty' },
        { label: '状态', type: 'slot', slotName: 'isShelves' }
      ],
      baseInfoForm: [],
      searchData: {},
      tabSKU: []
    }
  },
  created() {},
  mounted() {
    this.shId = this.$route.query.id
    this.getTableData()
  },
  methods: {
    // 查询商品
    async getTableData() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.searchData))
      params.shopId = this.shId
      params.pageNum = vm.currentPage
      params.pageSize = vm.pageSize
      await Basic.general('ShopGoods/pageGoodsListWeb', params).then(res => {
        if (res.code === 200) {
          const { data } = res
          const { total = 0, records = [] } = data
          this.sumTotal = total
          this.baseInfoForm = records
        }
      })
    },
    // SKU
    handleInfo(id) {
      this.typeStatus = id.firstCateName + '-' + id.secondCateName
      const params = {
        id: id.id
      }
      Basic.normal('ShopGoods/selectSkuList', params).then(res => {
        if (res.code === 200) {
          const { data } = res
          this.tabSKU = data
        }
      })
      this.filterView = true
    },
    afterClosed() {
      this.filterView = false
    },
    handleCancel() {
      this.filterView = false
    },
    // 查看大图
    bigPics(v) {
      const vm = this
      vm.bigPic = v.data.imgUrl
      vm.bigPicView = true
    },
    bigpicCancel() {
      this.bigPicView = false
    },
    bigpicClosed() {
      this.bigPicView = false
    },
    // 查询
    handleQuery() {
      const vm = this
      vm.currentPage = 1
      vm.$refs.myPagination.currentPage = 1
      const params = {
        goodsName: vm.formData.goodsName || null
      }
      vm.searchData = params
      vm.getTableData()
    },
    // 重置
    reset() {
      const vm = this
      vm.formData.goodsName = ''
      vm.$nextTick(_ => {
        vm.handleQuery()
      })
    },
    // 导出数据
    handleCreate() {
      const vm = this
      const params = {
        name: ''
      }
      const rs = {
        headers: {
          Authorization: getToken(),
          source: 4
        },
        responseType: 'blob',
        params
      }
      vm.$axios.get(`${process.env.VUE_APP_BASE_API}/shop/exportShop`, rs).then(res => {
      // vm.$axios.get(`http://192.168.1.41:7005/shop/exportShop`,rs).then(res => {
        fileDownload(res.data, '云店商品.xlsx')
      }).catch(err => {
        const { response } = err
        if (response.status && response.status === 401) {
          vm.$message.error('暂无操作权限，请联系管理员！')
        }
      })
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
<style lang="scss" scoped>
.back{
  margin-bottom: 20px;
}
.app-container /deep/ .filter-view {
  max-height:500px;
}
.app-container /deep/ .filters-view {
    height: 910px;
    width: 846px;
    img {
      width:800px;
      height:800px;
      display: inline-block;
    }
}
.app-container /deep/ .filter-view .tablHide {
  height:400px;
  overflow-x: auto;
}
</style>
