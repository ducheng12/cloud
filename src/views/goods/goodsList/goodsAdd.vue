<template>
  <div class="app-container">
    <el-page-header class="AddTitle" @back="$router.back()"> </el-page-header>
    <el-form ref="form" :model="myForm" size="small" label-position="top">
      <el-card class="box-card">
        <el-form-item label-width="0px" class="label-title">
          <span>基本信息</span>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称" :required="true">
              <el-input v-model.trim="myForm.name" style="width: 290px;" clearable placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="商品编码：">
              <el-input v-model.trim="myForm.code" style="width: 290px;" placeholder="请输入商品编码"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="商品分类" :required="true">
              <el-cascader
                v-model="myForm.classify"
                placeholder="一级分类/二级分类"
                :options="quarterList"
                :props="{ expandTrigger: 'hover' }"
                class="input-width"
                clearable
                style="width: 290px;"
                @change="handleArea"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" :required="true">
              <el-select v-model="myForm.supplierId" filterable placeholder="请选择供应商" style="width: 290px;">
                <el-option
                  v-for="item in supplierList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售季节">
              <el-select v-model="myForm.quarter" placeholder="请选择供应商" style="width: 290px;">
                <el-option label="第一季度" :value="1"></el-option>
                <el-option label="第二季度" :value="2"></el-option>
                <el-option label="第三季度" :value="3"></el-option>
                <el-option label="第四季度" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="场合" :required="true">
              <el-select v-model="myForm.placeIds" multiple placeholder="请选择场合" style="width: 290px;">
                <el-option
                  v-for="item in occasionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风格" :required="true">
              <el-select v-model="myForm.styleIds" multiple placeholder="请选择风格" style="width: 290px;">
                <el-option
                  v-for="item in styleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一拿货价" :required="true">
              <el-input v-model.trim="myForm.tradePrice" placeholder="请输入商品编码" style="width: 290px;" @input="inputControl(myForm, 'tradePrice', 2)">
                <i slot="suffix" style="font-style: normal;color: #666;">元</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否上架">
              <el-switch
                v-model="myForm.isShelves"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设为预售商品">
              <el-switch
                v-model="myForm.isPreSale"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品预售时间">
              <el-date-picker
                v-model="myForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计发货时间">
              <el-date-picker
                v-model="myForm.deliverGoodsTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="'请选择预计发货时间'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计商品定金占比">
              <el-input v-model.trim="myForm.proportionDeposit" style="width: 290px;" placeholder="请输入预计商品定金占比" @input="inputControl(myForm, 'proportionDeposit', 2)">
                <i slot="suffix" style="font-style: normal;color: #666;">%</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <el-form-item label-width="0px" class="label-title">
          <span>商品展示</span>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="主图（展示按照排列顺序，可拖拽）" :required="true">
              <p class="tips-text">单张图片大小不超过2M，支持JPG、JPEG、PNG格式，图片最多5张</p>
              <MultipleUpload style="width: 100%;min-height: 150px;" :limit="5" :image-list="fileList" @handle-upload="showProductUpload" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主视频">
              <p class="tips-text">视频大小不超过50M，支持MP4、avi格式，只能上传一个</p>
              <Video :limit="1" :url="storeBannerVideo" @onsuccess="storeVideoSuccessOption"></Video>
              <i v-if="storeBannerVideo" class="el-icon-circle-close" @click="handleRemove"></i>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品详情" :required="true">
              <p class="tips-text">单张图片大小不超过2M，支持JPG、JPEG、PNG格式，图片最多25张</p>
              <MultipleUpload style="width: 100%;min-height: 150px;" :limit="25" :image-list="goodsDetailFileList" @handle-upload="showProductDetailsUpload" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <el-form-item label-width="0px" class="label-title">
          <span>商品规格（SKU）</span>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item style="float: right;">
              <el-button plain icon="el-icon-plus" type="default" size="small" @click="addSku()">新增SKU</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-bottom: 24px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="图片" width="80" align="center">
            <template slot-scope="scope">
              <SingleUpload class="img-style" :image-url="scope.row.img" @on-upload="handleUploader" @handle-click="handleUpClick(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="colorName" label="颜色" align="center"></el-table-column>
          <el-table-column prop="name" label="规格名称" align="center"></el-table-column>
          <el-table-column prop="sizeName" label="尺码" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编码" align="center"></el-table-column>
          <el-table-column prop="tradePrice" label="拿货价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.tradePrice" size="small" style="width: 100%;" @input="inputControl(scope.row, 'tradePrice', 2)">
                <i slot="suffix" style="font-style: normal;color: #666;line-height: 32px;">元</i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="isShelves" label="上架" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShelves" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteSku(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <el-button type="default" size="small" :disabled="selectList.length === 0" @click="batchStoreOption(1)">批量上架</el-button>
          <el-button type="default" size="small" :disabled="selectList.length === 0" @click="batchStoreOption(0)">批量下架</el-button>
          <el-button type="default" size="small" :disabled="selectList.length === 0" @click="BatchDelteGoodsSku">批量删除</el-button>
        </el-form-item>
      </el-card>
    </el-form>
    <public-dialog
      :title="'新增SKU'"
      :visible="filterView"
      :custom-class="'filter-view'"
      @handle-cancel="handleCancel"
      @after-close="afterClosed"
    >
      <el-form ref="filterForm" :model="filterForm" size="small" label-width="80px">
        <el-form-item label-width="0px" style="width: 100%;">
          <p style="padding: 0;margin: 0;">选择的颜色，尺码，将依照排列组合自动生成SKU</p>
          <p style="padding: 0;margin: 0;color: #999;font-size; 12px;">Tips：自动过滤重复添加的sku</p>
        </el-form-item>
        <el-form-item label="颜色：" :required="true">
          <el-select v-model="filterForm.colours" multiple placeholder="请选择颜色" style="width: 90%;">
            <el-option
              v-for="item in coloursList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺码：" :required="true">
          <el-select v-model="filterForm.sizes" multiple placeholder="请选择尺码" style="width: 90%;">
            <el-option
              v-for="item in sizesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSearch">确 定</el-button>
      </template>
    </public-dialog>
    <div>
      <el-button type="primary" size="small" @click="comnfirms">保 存</el-button>
    </div>
  </div>
</template>

<script>
import {
  getSupplierList,
  delGoodsImg
} from '@/api/goods'
import Video from '@/components/UploadVideo/Video'
import MultipleUpload from '@/components/MultipleUpload'
import SingleUpload from '@/components/SingleUpload'
import { Basic } from '@/api/base'
import PublicDialog from '@/components/Dialog/PublicDialog'
import _ from 'lodash'
export default {
  components: {
    PublicDialog,
    SingleUpload,
    MultipleUpload,
    Video
  },
  data() {
    return {
      baseInfoForm: {
        region: []
      },
      myForm: {
        id: '',
        name: '',
        code: '',
        classify: [],
        supplierId: '',
        goodsDetail: '',
        quarter: '',
        placeIds: [],
        styleIds: [],
        goodsDetailFileList: [],
        tradePrice: 0,
        fileList: [], // 商品图片列表
        video: {}, // 视屏参数
        delIds: '',
        isPreSale: '',
        dateRange: [],
        deliverGoodsTime: '',
        proportionDeposit: 0
      },
      quarterList: [],
      fullImgUrl: '',
      supplierList: [],
      occasionList: [],
      coloursList: [],
      sizesList: [],
      styleList: [],
      fileList: [],
      OrderIndexArr: [],
      goodsDetailFileList: [],
      storeBannerVideo: null,
      tableData: [],
      filterView: false,
      filterForm: {},
      imageLists: [],
      selectList: [],
      rowData: 0,
      title: '',
      formId: {
        goodsId: null, // 新增时返回的商品id
        attrList: []
      },
      storeId: '', // 商品列表里当前商品id
      active: 1,
      isEditorMode: false, // 编辑模式
      goodsId: '',
      supplierId: '',
      cateCode: ''
    }
  },
  created() {
    const vm = this
    vm.goodsId = vm.$route.params.id || ''
    vm.title = vm.$route.params.id ? '编辑' : '新增'
    if (vm.$route.params.id) {
      vm.getgoodsInfo(vm.$route.params.id)
    }
  },
  mounted() {
    const vm = this
    // 获取供应商列表
    vm.seekSupply()
  },
  methods: {
    // 上传图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
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
        vm.tableData.forEach(t => {
          if (t.colorName === vm.rowData.colorName) {
            t.img = ip + '/' + fileUrl
            t.imgUrl = fileUrl
          }
        })
        vm.$message({ message: `上传图片成功！`, type: 'success' })
      })
    },
    handleUpClick(row) {
      this.rowData = row
    },
    // 获取商品信息
    getgoodsInfo(id) {
      const vm = this
      Basic.normal('goods/selectByGoodsId', { id: id }).then(res => {
        const goods = JSON.parse(JSON.stringify(res.data))
        vm.myForm.id = goods.id || ''
        vm.myForm.name = goods.name || ''
        vm.myForm.code = goods.subtitle || ''
        vm.myForm.firstCategoryId = goods.firstCategoryId
        vm.myForm.secondCategoryId = goods.secondCategoryId
        vm.myForm.classify = [goods.firstCategoryId, goods.secondCategoryId]
        vm.myForm.supplierId = goods.supplierId
        vm.myForm.quarter = goods.quarter ? parseInt(goods.quarter) : ''
        vm.myForm.isShelves = goods.isShelves
        vm.myForm.isPreSale = goods.isPreSale
        vm.myForm.dateRange = [goods.preSaleStartTime, goods.preSaleEndTime]
        vm.myForm.deliverGoodsTime = goods.deliverGoodsTime
        vm.myForm.proportionDeposit = goods.proportionDeposit
        // vm.myForm.placeIds = goods.placeList
        goods.placeList.forEach(t => {
          vm.myForm.placeIds.push(t.id)
        })
        goods.styleList.forEach(i => {
          vm.myForm.styleIds.push(i.id)
        })
        if (goods.fileList && goods.fileList.length) {
          vm.fileList = goods.fileList.map(t => t.fileUrl)
          vm.myForm.fileList = goods.fileList.map(t => {
            const item = {
              id: t.id,
              fileUrl: t.fileUrl,
              fileType: 1
            }
            return item
          })
        }
        if (goods.goodsDetailFileList && goods.goodsDetailFileList.length) {
          vm.goodsDetailFileList = goods.goodsDetailFileList.map(t => t.fileUrl)
          vm.myForm.goodsDetailFileList = goods.goodsDetailFileList.map(t => {
            const item = {
              id: t.id,
              fileUrl: t.fileUrl,
              fileType: 1
            }
            return item
          })
        }
        // vm.myForm.styleIds = goods.styleList
        vm.myForm.tradePrice = goods.tradePrice
        vm.myForm.isShelves = goods.isShelves
        vm.myForm.fileList = goods.fileList
        if (goods.video) {
          const { fileUrl, id } = goods.video
          vm.storeBannerVideo = fileUrl
          vm.myForm.video = {
            id: id,
            fileType: 2,
            fileUrl: fileUrl
          }
        }
        vm.myForm.goodsDetailFileList = goods.goodsDetailFileList
        const imUrl = process.env.VUE_APP_FILE_URL_OBS + '/'
        goods.skuList.forEach(t => {
          t.img = imUrl + t.imgUrl
          t.imgUrl = t.imgUrl || ''
        })
        vm.tableData = goods.skuList
        // vm.getOrderNumber()
      })
    },
    handleCancel() {
      this.filterView = false
    },
    afterClosed() {
      const vm = this
      vm.filterForm.colours = []
      vm.filterForm.sizes = []
    },
    handleSearch() {
      const vm = this
      const { colours = [], sizes = [] } = vm.filterForm
      if (!colours.length) {
        vm.$message.error('请选择SKU颜色!')
        return false
      }
      if (!sizes.length) {
        vm.$message.error('请选择SKU尺码!')
        return false
      }
      colours.forEach(t => {
        sizes.forEach(i => {
          const cor = vm.coloursList.filter(h => t === h.id)
          const siz = vm.sizesList.filter(k => i === k.id)
          const listCorSiz = {
            img: '',
            colorName: cor[0].name,
            name: vm.myForm.name + ' ' + cor[0].name,
            sizeName: siz[0].name,
            skuCode: '',
            tradePrice: vm.myForm.tradePrice,
            isShelves: 1,
            colorId: cor[0].id,
            sizeId: siz[0].id,
            operation: '',
            imgUrl: ''
          }
          vm.tableData.push(listCorSiz)
        })
      })
      vm.tableData = _.uniqWith(vm.tableData, _.isEqual)
      vm.filterView = false
    },
    handleSelectionChange(e) {
      this.selectList = e
    },
    addSku() {
      this.filterView = true
    },
    // 删除
    deleteSku(data, index) {
      const vm = this
      const { id = '' } = data
      if (id) {
        vm.myForm.delIds += vm.myForm.delIds ? `,${id}` : id
      }
      vm.tableData.forEach((t, i) => {
        if (i === index) {
          vm.tableData.splice(i, 1)
        }
      })
    },
    handleUploads(d) {},
    // 获取供应商
    seekSupply() {
      const vm = this
      getSupplierList().then(data => {
        this.supplierList = data.data.map(item => {
          return {
            value: item.id,
            label: item.fullName
            // code: item.suppCode
          }
        })
      })
      Basic.general('GoodsAttribute/selectListPage').then(res => {
        const { data } = res
        const { records = [] } = data
        vm.occasionList = records.filter(t => t.type === '4')[0].list
        vm.styleList = records.filter(t => t.type === '2')[0].list
        vm.coloursList = records.filter(t => t.type === '3')[0].list
        vm.sizesList = records.filter(t => t.type === '1')[0].list
      })
      Basic.general('GoodsCategory/selectListPage').then(res => {
        const { data } = res
        const { records = [] } = data
        vm.quarterList = vm.initTree(records)
      })
    },
    initTree(data) {
      const vm = this
      const arr = JSON.parse(JSON.stringify(data))
      const list = []
      arr.forEach(t => {
        const item = {
          label: t.name,
          value: t.id
        }
        if (t.list.length) {
          item.children = vm.initTree(t.list)
        }
        list.push(item)
      })
      return list
    },
    // 季度选择
    handleArea(val) {
      const vm = this
      vm.baseInfoForm.province = parseInt(val[0])
      vm.baseInfoForm.city = parseInt(val[1])
      vm.baseInfoForm.district = parseInt(val[2])
    },
    // 视屏上传成功
    storeVideoSuccessOption(val) {
      const vm = this
      vm.myForm.video = {
        fileUrl: val,
        fileType: 2
      }
      vm.storeBannerVideo = val
    },
    // 删除视屏
    handleRemove() {
      const vm = this
      vm.myForm.video.fileUrl = null
      this.storeBannerVideo = null
      if (vm.myForm.video.id) {
        delGoodsImg({ id: vm.myForm.video.id }).then(res => {})
      }
    },
    getOrderNumber() {
      const OrderObj = {}
      this.tableData = this.tableData.sort((a, b) => b.colorName.charCodeAt(0) - a.colorName.charCodeAt(0))
      this.tableData.forEach((element, index) => {
        element.rowIndex = index
        if (OrderObj[element.colorName]) {
          OrderObj[element.colorName].push(index)
        } else {
          OrderObj[element.colorName] = []
          OrderObj[element.colorName].push(index)
        }
      })

      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (const k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k])
        }
      }
    },
    // 单元格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          const element = this.OrderIndexArr[i]
          for (let j = 0; j < element.length; j++) {
            const item = element[j]
            if (rowIndex === item) {
              if (j === 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                }
              } else if (j !== 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }
    },
    // 图片添加
    showProductUpload(val) {
      const vm = this
      const data = JSON.parse(JSON.stringify(val))
      const fileList = data.map((img, index) => {
        const item = {
          fileType: 1,
          fileUrl: img.fileUrl
        }
        return item
      })
      vm.myForm.fileList = fileList
      if (fileList.length) {
        vm.myForm.imgUrl = fileList[0].fileUrl
      }
    },
    showProductDetailsUpload(val) {
      const vm = this
      const data = JSON.parse(JSON.stringify(val))
      const fileList = data.map((img, index) => {
        const item = {
          fileType: 1,
          fileUrl: img.fileUrl,
          creatorId: vm.$store.state.user.userId,
          updateId: vm.$store.state.user.userId
        }
        return item
      })
      vm.myForm.goodsDetailFileList = fileList
      // if (fileList.length) {
      //   vm.myForm.goodsDetail = fileList[0].fileUrl
      // }
    },
    batchStoreOption(n) {
      const vm = this
      vm.selectList.forEach(t => {
        const index = vm.tableData.indexOf(t)
        vm.tableData[index].isShelves = n
      })
    },
    BatchDelteGoodsSku() {
      const vm = this
      vm.selectList.forEach(t => {
        const index = vm.tableData.indexOf(t)
        if (t.id) {
          vm.myForm.delIds += vm.myForm.delIds ? `,${t.id}` : t.id
        }
        vm.tableData.splice(index, 1)
      })
    },
    // 保存
    comnfirms() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.myForm))
      params.styleIds = _.flatten(vm.myForm.styleIds).join(',')
      params.placeIds = _.flatten(vm.myForm.placeIds).join(',')
      params.skuList = []
      vm.tableData.forEach(t => {
        const skuLists = {
          id: t.id || '',
          quarter: vm.myForm.quarter,
          isShelves: t.isShelves,
          sizeId: t.sizeId,
          colorId: t.colorId,
          placeId: params.styleIds,
          styleId: params.placeIds,
          tradePrice: t.tradePrice,
          imgUrl: t.imgUrl
        }
        params.skuList.push(skuLists)
      })
      params.firstCategoryId = vm.myForm.classify[0]
      params.secondCategoryId = vm.myForm.classify[1]
      if (!vm.myForm.name) {
        vm.$message.error('请输入商品名称!')
        return false
      }
      if (!vm.myForm.classify[0]) {
        vm.$message.error('请选择商品一级分类!')
        return false
      }
      if (!vm.myForm.classify[1]) {
        vm.$message.error('请选择商品二级分类!')
        return false
      }
      if (!vm.myForm.supplierId) {
        vm.$message.error('请选择商品供应商!')
        return false
      }
      if (!vm.myForm.placeIds) {
        vm.$message.error('请选择场合!')
        return false
      }
      if (!vm.myForm.styleIds) {
        vm.$message.error('请选择风格!')
        return false
      }
      if (!vm.myForm.tradePrice) {
        vm.$message.error('请输入拿货价!')
        return false
      }
      if (vm.myForm.proportionDeposit) {
        if (vm.myForm.proportionDeposit < 0) {
          vm.$message.error('商品定金占比数不能小于0！')
          return false
        }
        if (vm.myForm.proportionDeposit > 100) {
          vm.$message.error('商品定金占比数不能大于100！')
          return false
        }
      }
      if (!vm.myForm.fileList.length) {
        vm.$message.error('请上传商品展示图片!')
        return false
      }
      if (!vm.myForm.goodsDetailFileList.length) {
        vm.$message.error('请上传商品详情图片!')
        return false
      }
      if (!vm.chckedSkuList()) {
        return false
      }
      if (vm.myForm.dateRange !== []) {
        params.preSaleStartTime = vm.myForm.dateRange[0]
        if (vm.myForm.dateRange.length === 2) {
          params.preSaleEndTime = vm.myForm.dateRange[1]
        }
      }
      Basic.normal('goods/save', params).then(res => {
        vm.$message({ message: '保存成功', type: 'success' })
        vm.$router.back()
      })
    },
    chckedSkuList() {
      const vm = this
      let chcked = true
      if (vm.tableData.length) {
        for (let i = 0, len = vm.tableData.length; i < len; i++) {
          const { imgUrl, tradePrice } = vm.tableData[i]
          if (!imgUrl) {
            vm.$message.error('请上传商品SKU图片!')
            chcked = false
            break
          }
          if (tradePrice === 0) {
            vm.$message.error('请输入商品SKU拿货价!')
            chcked = false
            break
          }
        }
        // 判断是否存在上架sku
        const shelvesList = vm.tableData.filter(t => t.isShelves === 1)
        if (vm.myForm.isShelves === 1 && shelvesList.length === 0) {
          vm.$message.error('暂无上架商品SKU，无法上架商品，请检查后提交保存！')
          chcked = false
        }
      }
      return chcked
    }
  }
}
</script>

<style lang="scss" scoped>
.tips-text {
  padding: 0;
  margin: 0;
  margin-bottom: 12px;
  font-size: 12px;
  color: #666;
  line-height: 1;
}
.box-card {
  margin-bottom: 24px;
}
.app-container >>> .filter-view {
  width: 540px;
}
  // /deep/ .el-form-item__label {
  //   width: 100px;
  // }
  // /deep/ .el-input__inner {
  //   width: 290px;
  // }
  .AddTitle{
    margin:20px;
    margin-left: 25px;
  }
  .AddBox{
    padding: 20px 48px;
  }
  .addGoodsSteps{
    width: 40%;
    margin: auto;
    background:white;
  }
  /deep/ .el-page-header__title {
    font-size: 20px;
    font-weight: 500;
  }
  /deep/ .el-page-header__left::after {
    width: 0;
  }
  .sku-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-align: justify;
    text-align-last: left;
  }
  .label-title {
    margin: 10px 0 20px;
    span {
      font-size: 20px;
      color: #000;
      font-weight: bold;
    }
    /deep/ .el-form-item__content {
      // font-weight: bold;
      color: #005aa0;
      font-size: 15px;
      line-height: 24px;
    }
    .label-index {
      width: 24px;
      height: 24px;
      line-height: 22px;
      text-align: center;
      border: 1px solid #005aa0;
      border-radius: 24px;
      margin-right: 8px;
      font-weight: normal;
    }
    .label-tail {
      width: 160px;
      height: 12px;
      margin-left: 8px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
  .el-icon-circle-close {
    font-size: 24px;
    position: relative;
    bottom: 134px;
    left: 122px;
    color: white;
  }
  .el-icon-circle-close:hover {
    background: #323842;
    border-radius: 50%;
  }
  .img-style /deep/ .avatar-uploader {
    width: 50px;
    height: 50px;
  }
  .img-style /deep/ .avatar {
      width: 48px;
      height: 48px;
      display: block;
    }
  .img-style /deep/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }
</style>

